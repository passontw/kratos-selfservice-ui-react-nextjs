import { Box } from "@mui/material"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import {
  selectLockCodeResend,
  setLockCodeResend,
} from "../../state/store/slice/layoutSlice"

interface TimerProps {}

const Timer: React.FC<TimerProps> = () => {
  const [timeLeft, setTimeLeft] = useState(60)
  const dispatch = useDispatch()
  const isResendLocked = useSelector(selectLockCodeResend)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1)
    }, 1000)

    // Stop the timer when the countdown reaches 0
    if (timeLeft === 0) {
      clearInterval(timer)
      dispatch(setLockCodeResend(false))
    }

    return () => clearInterval(timer)
  }, [timeLeft, isResendLocked])

  return (
    <Box color="#454545" mt="2px" fontFamily="open sans">{`(${timeLeft})`}</Box>
  )
}

export default Timer
