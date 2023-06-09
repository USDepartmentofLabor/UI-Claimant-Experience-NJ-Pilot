import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Modal, ModalRef } from '@trussworks/react-uswds'
import { useWhoAmI } from 'hooks/useWhoAmI'
import { useTranslation } from 'react-i18next'
import { cognitoSignOut } from 'utils/signout/cognitoSignOut'

type SessionManagerPros = {
  forceOpen?: boolean
  forceExpireTime?: string
}

const NOTIFY_UNDER_MINUTES = 5
const TIMEOUT_BUFFER_SECONDS = 5
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
        new Date(sessionExpires.getTime() - TIMEOUT_BUFFER_SECONDS * 1000)

    if (isNewExpiration) {
      expiresAt.current = new Date(
        sessionExpires.getTime() - TIMEOUT_BUFFER_SECONDS * 1000
      )
    }
  }

  const reloadSession = async () => {
    const event = new Event('visibilitychange')
    document.dispatchEvent(event)
  }

  const forceModuleOpen = () => {
    return forceOpen !== undefined && forceOpen
  }

  const shouldOpenModal = () => {
    return !forceModuleOpen()
      ? secondsRemaining !== undefined &&
          secondsRemaining <= NOTIFY_UNDER_MINUTES * 60
      : true
  }

  const modalIsOpen = () => {
    return modalRef.current === null ? false : modalRef.current.modalIsOpen
  }

  const checkExpiry = useCallback(() => {
    if (expiresAt.current !== undefined) {
      const remaining =
        (expiresAt.current.getTime() - new Date().getTime()) / 1000

      setSecondsRemaining(Math.max(0, Math.round(remaining)))
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
      timeSinceLastRefresh > TIMEOUT_BUFFER_SECONDS
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
    if (secondsRemaining === 0) {
      handleLogout()
    } else if (modalRef.current !== null) {
      if (!modalIsOpen() && shouldOpenModal()) {
        modalRef.current.toggleModal(undefined, true)
      } else if (modalIsOpen() && !shouldOpenModal()) {
        //close modal if an async refresh comes from the server
        //while the modal was open
        modalRef.current.toggleModal(undefined, false)
      }
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
      id="timeout-modal"
      aria-labelledby="timeout-modal-heading"
      aria-describedby="timeout-modal-description"
      isInitiallyOpen={forceModuleOpen()}
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
        <Button
          className="margin-right-4"
          disabled={isLoading}
          onClick={() => handleStayLoggedIn()}
          type="button"
        >
          {t('timeout.stay_logged_in')}
        </Button>
        <Button
          onClick={handleLogout}
          disabled={isLoading}
          unstyled
          type="button"
        >
          {t('timeout.log_out')}
        </Button>
      </div>
    </Modal>
  )
}
