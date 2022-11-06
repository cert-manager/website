import { useEffect } from 'react'

function useOutsideAlerter(ref, setShow = null, callBack = null) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        if (setShow) {
          setShow(false)
        }
        if (callBack) {
          callBack()
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref])
}

export default useOutsideAlerter
