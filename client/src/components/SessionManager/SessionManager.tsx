import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Modal, ModalRef } from '@trussworks/react-uswds'
import { useWhoAmI } from 'hooks/useWhoAmI'
import { useTranslation } from 'react-i18next'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

type SessionManagerPros = {
  forceOpen: boolean
}
// if (process.env.NODE_ENV !== "test") {
//   Modal.setAppElement("#root");
// }

const NOTIFY_UNDER_MINUTES = 1
const TIMOUT_BUFFER_SECONDS = 5

const getSecondsLeft = () => {
  //   const secondsLeft = expiresAt.getSeconds();
  const secondsLeft = cookies.get('expires_at')
  if (secondsLeft) {
    cookies.remove('expires_at', { path: '/' })
    // console.log("seconds left" +secondsLeft)
    return secondsLeft - TIMOUT_BUFFER_SECONDS
  }
  return undefined
}

const baseUrl = process.env.REACT_APP_BASE_URL || ''
const logoutUrl = `${baseUrl}/logout/`
const logout = () => (window.location.href = logoutUrl)

// const customStyles = {
//   overlay: {
//     zIndex: 100,
//     backgroundColor: "rgba(0, 0, 0, 0.7)",
//     padding: "0 10rem",
//   },
//   content: {
//     top: "50%",
//     left: "50%",
//     width: "20.5rem",
//     maxWidth: "100%",
//     bottom: "auto",
//     marginRight: "-50%",
//     transform: "translate(-50%, -50%)",
//   },
// };
const reloadSession = () => {
  const event = new Event('visibilitychange')
  document.dispatchEvent(event)
}
export const SessionManager = ({ forceOpen }: SessionManagerPros) => {
  const expiresAt = useRef<Date>()
  const [secondsRemaining, setSecondsRemaining] = useState<number>()
  const { t } = useTranslation('common')

  // Use whomai query to refresh session
  // const { refetch, isFetching } = useWhoAmI();
  const { isLoading } = useWhoAmI()
  //check if have log in info??
  if (!isLoading && expiresAt.current === undefined) {
    cookies.set(
      'expires_at',
      new Date().getTime() + NOTIFY_UNDER_MINUTES * 60000
    )
    console.log('was undefined')
  }
  const checkExpiry = useCallback(() => {
    const seconds = getSecondsLeft()
    // if (seconds ===undefined){
    //     cookies.set("expires_at",new Date().getTime() + NOTIFY_UNDER_MINUTES * 60000)
    //     console.log("was undefined")
    // }
    if (seconds) {
      expiresAt.current = new Date(new Date().getTime() + seconds * 1000)
      console.log('expires at is ' + expiresAt.current)
    }

    console.log('seconds was ' + seconds) //returns undefined
    if (expiresAt.current) {
      // console.log("expires at is "+expiresAt.current)
      setSecondsRemaining(
        Math.max(
          0,
          Math.round(
            (expiresAt.current.getTime() - new Date().getTime()) / 1000
          )
        )
      )
    }
  }, [])

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
      logout()
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
  //   const time = 30;
  // For screen readers, only announce every 10 seconds
  //   const secondsRemaining=15;
  //   const announceSecondsRemaining = 10;
  //   const announceTime = 5;
  const modalRef = useRef<ModalRef>(null)
  //   const open= !forceOpen ? secondsRemaining <= NOTIFY_UNDER_MINUTES * 60 : true
  const open = forceOpen || true
  return (
    <Modal
      ref={modalRef}
      id="example-modal-1"
      aria-labelledby="modal-1-heading"
      aria-describedby="modal-1-description"
      isInitiallyOpen={open}
      hidden={open}
    >
      {/* isOpen={secondsRemaining <= NOTIFY_UNDER_MINUTES * 60}
      style={customStyles}
      ariaHideApp={process.env.NODE_ENV !== "test"} */}

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
          onClick={() => reloadSession()}
          type="button"
        >
          {t('timeout.stay_logged_in')}
        </Button>
        <Button onClick={logout} disabled={isLoading} unstyled type="button">
          {t('timeout.log_out')}
        </Button>
      </div>
    </Modal>
  )
}
