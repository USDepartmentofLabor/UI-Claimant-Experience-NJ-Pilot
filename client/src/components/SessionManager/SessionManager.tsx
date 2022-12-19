import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Modal } from '@trussworks/react-uswds'
import { useWhoAmI } from 'hooks/useWhoAmI'
import { useTranslation } from 'react-i18next'
// import cognitoSignOut from 'utils/signout/cognitoSignOut'

type SessionManagerPros = {
  forceOpen: boolean
  forceExpireTime?: string
}

// if (process.env.NODE_ENV !== "test") {
//   Modal.setAppElement("#root");
// }

const NOTIFY_UNDER_MINUTES = 1
const TIMOUT_BUFFER_SECONDS = 5
// let lockRefresh=false
// const eventTypes = [
//     'keypress',
//     // 'mousemove',
//     'mouseup',
//     'scroll',
//     'touchend',
//     'pointerup'
//   ]
// const addEventListeners = (listener: any) => {
//     eventTypes.forEach((type) => {
//       window.addEventListener(type, listener, false)
//     })
//   }
// const urlParams = new URLSearchParams({
//     client_id: process.env.COGNITO_CLIENT_ID as string,
//     logout_uri: `${process.env.NEXTAUTH_URL as string}`,
//   })
// const logoxutUrl = `${process.env.COGNITO_DOMAIN}/logout?${urlParams}`
const logout = () => {
  // window.location.href = logoutUrl) results in not found
  // cognitoSignOut()// results in SessionManager.tsx?3e1a:27 Uncaught TypeError: (0 , utils_signout_cognitoSignOut__WEBPACK_IMPORTED_MODULE_5__.default) is not a function
  const saveAndExit = document.querySelector(
    '#save-and-exit-button'
  ) as HTMLButtonElement

  console.log('save and exit is ' + saveAndExit)
  saveAndExit?.click()
}
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

const reloadSession = async () => {
  const event = new Event('visibilitychange')
  document.dispatchEvent(event) // works
  // await axios.get('/api/auth/session?update');// does nothing
}
export const SessionManager = ({
  forceOpen,
  forceExpireTime,
}: SessionManagerPros) => {
  const expiresAt = useRef<Date>()
  const [secondsRemaining, setSecondsRemaining] = useState<number>()
  //   const [isOpen, setIsOpen] = useState<boolean>()
  const { t } = useTranslation('common')

  // Use whomai query to refresh session
  const { isLoading, sessionExpires } = useWhoAmI()
  console.log(
    'From whoam recieved sesison expiration as: ' +
      sessionExpires +
      'session type is ' +
      typeof sessionExpires
  )
  if (forceExpireTime !== undefined) {
    expiresAt.current = new Date(forceExpireTime)
  } else if (sessionExpires !== undefined) {
    const isNewExpiration =
      expiresAt.current === undefined ||
      expiresAt.current <
        new Date(sessionExpires.getTime() - TIMOUT_BUFFER_SECONDS * 1000)

    if (isNewExpiration) {
      console.log(
        'session manager main () -> is new expires temp is ' + expiresAt.current
      ) //__REMOVE__
      console.log('session manager main () -> using subtract time')
      expiresAt.current = new Date(
        sessionExpires.getTime() - TIMOUT_BUFFER_SECONDS * 1000
      )
      console.log(
        'session manager main () -> expires after subtract is ' +
          expiresAt.current
      )
    }
  }

  const getSecondsLeft = () => {
    if (expiresAt.current === undefined) {
      console.log('getSecondsLeft()_.>returning unedefined') //__REMOVE
      return undefined
    }
    const expireTime = expiresAt.current.getTime()
    const curr = new Date()
    const secondsLeft = Math.round((expireTime - curr.getTime()) / 1000)
    console.log(
      'getSecondsLeft()->seconds left is ' +
        secondsLeft +
        ' expire time is ' +
        expireTime +
        ' current time is ' +
        curr +
        ' expire at is ' +
        expiresAt.current
    )
  }

  const checkExpiry = useCallback(() => {
    const seconds = getSecondsLeft()

    console.log('checkExpiry->in check expires temp is ' + expiresAt.current) //17:08:45

    console.log('checkExpiry->seconds was ' + seconds) //returns u40
    if (expiresAt.current !== undefined) {
      // console.log("expires at is "+expiresAt.current)
      //expire time-time now converted to seconds and rounded

      const remaining =
        (expiresAt.current.getTime() - new Date().getTime()) / 1000
      console.log(
        'checkExpiry->setting seconds remaining to ' +
          remaining +
          ' current is ' +
          expiresAt.current
      )
      setSecondsRemaining(Math.max(0, Math.round(remaining)))
    }
  }, [])
  //   const handleOnAction=() =>  {
  //     if (isOpen!== undefined && isOpen!==false){
  //     console.log('user did something open is '+isOpen)
  //     // if(!lockRefresh)
  //     //     {
  //     //         lockRefresh=true
  //             reloadSession()
  //     //         lockRefresh=false
  //     //     }
  //     }
  //   }
  //   useEffect(() => {

  //     addEventListeners(handleOnAction)
  //   })
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
  //   const modalRef = useRef<ModalRef>(null)
  const open = !forceOpen ? secondsRemaining <= NOTIFY_UNDER_MINUTES * 60 : true
  console.log(
    'open is ' +
      open +
      'seconds remaining is ' +
      secondsRemaining +
      'notfigy seconds is ' +
      NOTIFY_UNDER_MINUTES * 60
  )

  // setIsOpen(open)
  return (
    <Modal
      //   ref={modalRef}
      id="timout-modal"
      aria-labelledby="timout-modal-heading"
      aria-describedby="timout-modal-description"
      isInitiallyOpen={true}
      hidden={open}
      forceAction
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
