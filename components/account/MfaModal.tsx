import Box from "@mui/material/Box"
import { FormEvent } from "react"
import { useSelector } from "react-redux"

import { selectMfaState } from "../../state/store/slice/layoutSlice"

interface MfaModalProps {
  // mfaState: boolean
  submit: (event: any) => void
}

const MfaModal: React.FC<MfaModalProps> = ({ submit }) => {
  const mfaState = useSelector(selectMfaState)
  console.log("mfaState", mfaState)
  const modalContent = mfaState
    ? "If 2-step verification is turned on, you’ll need to complete the email verification process every time you log in."
    : "You will no longer receive a code if we notice an attempted login from an unrecognized device or browser. Are you sure to proceed?"
  const btnText = mfaState ? "Turn on" : "Turn off"

  return (
    <>
      <Box>
        {mfaState && (
          <Box fontSize="14px" color="#A5A5A9" fontFamily="open sans" mb="10px">
            Current account :{" "}
            <span style={{ color: "#CA4AE8" }}>master123@gmail.com</span>
          </Box>
        )}
        <Box fontSize="14px" color="#A5A5A9" fontFamily="open sans">
          {modalContent}
        </Box>
      </Box>
      <Box display="flex">
        <Box>Cancel</Box>
        <Box
          onClick={(e) => {
            submit(e)
          }}
        >
          {btnText}
        </Box>
      </Box>
    </>
  )
}

export default MfaModal
