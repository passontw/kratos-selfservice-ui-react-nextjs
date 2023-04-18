import Box from "@mui/material/Box"
import { FormEvent } from "react"
import { useSelector } from "react-redux"

import { selectMfaState } from "../../state/store/slice/layoutSlice"

interface MfaModalProps {
  // mfaState: boolean
  submit: (event: any) => void
}

const MfaModal: React.FC<MfaModalProps> = () => {
  const mfaState = useSelector(selectMfaState)
  console.log("mfaState", mfaState)
  const modalContent = mfaState
    ? "If 2-step verification is turned on, you’ll need to complete the email verification process every time you log in."
    : "You will no longer receive a code if we notice an attempted login from an unrecognized device or browser. Are you sure to proceed?"

  return (
    <Box>
      {mfaState && (
        <Box fontSize="14px" color="#A5A5A9" fontFamily="open sans">
          Current account : master123@gmail.com
        </Box>
      )}
      <Box fontSize="14px" color="#A5A5A9" fontFamily="open sans">
        {modalContent}
      </Box>
    </Box>
  )
}

export default MfaModal
