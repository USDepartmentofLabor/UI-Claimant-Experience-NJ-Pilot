import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Modal, ModalRef } from '@trussworks/react-uswds'
import { useWhoAmI } from 'hooks/useWhoAmI'
import { useTranslation } from 'react-i18next'
import { cognitoSignOut } from 'utils/signout/cognitoSignOut'

type SessionManagerPros = {
  forceOpen: boolean
  forceExpireTime?: string
}

const NOTIFY_UNDER_MINUTES = 2
const TIMOUT_BUFFER_SECONDS = 5
let lastRefresh = Date.now()
const eventTypes = ['keypress', 'scroll', 'touchend', 'pointerup']
const addEventListeners = (listener: any) => {
  eventTypes.forEach((type) => {
    window.addEventListener(type, listener, false)
  })
}

export const SessionManager = ({
  forceOpen,
  forceExpireTime,
}: SessionManagerPros) => {
  const expiresAt = useRef<Date>()
  const modalRef = useRef<ModalRef>(null)
  const [secondsRemaining, setSecondsRemaining] = useState<number>()
  const { t } = useTranslation('common')

  // Use whomai query to refresh session
  const { isLoading, sessionExpires } = useWhoAmI()

  if (forceExpireTime !== undefined) {
    expiresAt.current = new Date(forceExpireTime)
  } else if (sessionExpires !== undefined) {
    const isNewExpiration =
      expiresAt.current === undefined ||
      expiresAt.current <
        new Date(sessionExpires.getTime() - TIMOUT_BUFFER_SECONDS * 1000)

    if (isNewExpiration) {
      expiresAt.current = new Date(
        sessionExpires.getTime() - TIMOUT_BUFFER_SECONDS * 1000
      )
    }
  }

  const reloadSession = async () => {
    const event = new Event('visibilitychange')
    document.dispatchEvent(event)
  }

  //   const getSecondsLeft = () => {
  //     if (expiresAt.current === undefined) {
  //       return undefined
  //     }

  //     const expireTime = expiresAt.current.getTime()
  //     const curr = new Date()
  //     const secondsLeft = Math.round((expireTime - curr.getTime()) / 1000)
  //     console.log(
  //       'getSecondsLeft()->seconds left is ' +
  //         secondsLeft +
  //         ' expire time is ' +
  //         expireTime +
  //         ' current time is ' +
  //         curr +
  //         ' expire at is ' +
  //         expiresAt.current
  //     )
  //     return secondsLeft
  //   }

  const shouldOpenModal = () => {
    return !forceOpen
      ? secondsRemaining !== undefined &&
          secondsRemaining <= NOTIFY_UNDER_MINUTES * 60
      : true
  }

  const modalIsOpen = () => {
    return modalRef.current === null ? false : modalRef.current.modalIsOpen
  }
  const checkExpiry = useCallback(() => {
    // const seconds = getSecondsLeft()

    // console.log('checkExpiry->in check expires temp is ' + expiresAt.current) //17:08:45

    // console.log('checkExpiry->seconds was ' + seconds) //returns u40
    if (expiresAt.current !== undefined) {
      // console.log("expires at is "+expiresAt.current)
      //expire time-time now converted to seconds and rounded
      const remaining =
        (expiresAt.current.getTime() - new Date().getTime()) / 1000

      setSecondsRemaining(Math.max(0, Math.round(remaining)))

      if (!modalIsOpen() && shouldOpenModal() && modalRef.current !== null) {
        modalRef.current.modalIsOpen = true
      }
    }
  }, [])

  const closeModal = () => {
    if (modalRef.current !== null) {
      modalRef.current.toggleModal(undefined, false)
    }
  }

  const handleStayLoggedIn = async () => {
    reloadSession()
    closeModal()
  }
  const handleLogout = async () => {
    closeModal()
    await cognitoSignOut()
  }
  const handleOnAction = () => {
    const timeSinceLastRefresh = (Date.now() - lastRefresh) / 1000
    if (
      !modalIsOpen() &&
      expiresAt.current !== undefined &&
      timeSinceLastRefresh > TIMOUT_BUFFER_SECONDS
    ) {
      lastRefresh = Date.now()
      reloadSession()
    }
  }
  useEffect(() => {
    addEventListeners(handleOnAction)
  })
  useEffect(() => {
    const interval = setInterval(() => {
      checkExpiry()
    }, 1000)
    // Check after whoami fetch
    if (!isLoading) {
      checkExpiry()
    }
    return () => {
      clearInterval(interval)
    }
  }, [isLoading, checkExpiry])

  useEffect(() => {
    const shouldOpenModal = !forceOpen
      ? secondsRemaining !== undefined &&
        secondsRemaining <= NOTIFY_UNDER_MINUTES * 60
      : true
    if (secondsRemaining === 0) {
      handleLogout()
    } else if (!modalIsOpen() && shouldOpenModal && modalRef.current !== null) {
      modalRef.current.toggleModal(undefined, true)
    }
  }, [secondsRemaining])

  if (secondsRemaining === undefined) {
    return null
  }

  const timeFromSeconds = (time: number, sr = false) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    if (sr) {
      return t('timeout.sr_countdown', { count: minutes, seconds })
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const time = timeFromSeconds(secondsRemaining)

  // For screen readers, only announce every 10 seconds
  const announceSecondsRemaining = Math.ceil(secondsRemaining / 10) * 10
  const announceTime = timeFromSeconds(announceSecondsRemaining, true)

  return (
    <Modal
      ref={modalRef}
      id="timout-modal"
      aria-labelledby="timout-modal-heading"
      aria-describedby="timout-modal-description"
      isInitiallyOpen={forceOpen}
      //   isInitiallyOpen={forceOpen}
      forceAction
    >
      <h1
        className="font-sans-lg margin-top-0"
        aria-live={secondsRemaining % 10 === 0 ? 'polite' : 'off'}
      >
        {t('timeout.title')}
        <span className="usa-sr-only">{announceTime}.</span>
        <span aria-hidden="true">{time}.</span>
      </h1>

      <p>{t('timeout.instructions')}</p>
      <div className="display-flex flex-justify-center margin-top-3">
        {/* <ModalToggleButton */}
        <Button
          // modalRef={modalRef}
          className="margin-right-4"
          disabled={isLoading}
          onClick={() => handleStayLoggedIn()}
          type="button"
          //   closer
        >
          {t('timeout.stay_logged_in')}
          {/* </ModalToggleButton> */}
        </Button>
        <Button
          onClick={handleLogout}
          disabled={isLoading}
          unstyled
          type="button"
          //   closer
        >
          {t('timeout.log_out')}
        </Button>
      </div>
    </Modal>
  )
}
