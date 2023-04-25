import Box from "@mui/material/Box"
import { FormEvent } from "react"
import { useDispatch, useSelector } from "react-redux"

import {
  selectMfaState,
  setDialog,
  setMfaModalOpen,
} from "../../state/store/slice/layoutSlice"

interface MfaModalProps {
  email: string
  submit: (event: any) => void
  handleToast?: (value?: string) => void
}

const MfaModal: React.FC<MfaModalProps> = ({ submit, email, handleToast }) => {
  const dispatch = useDispatch()
  const mfaState = useSelector(selectMfaState)
  console.log("mfaState", mfaState)
  const modalContent = mfaState
    ? "If 2-step verification is turned on, you’ll need to complete the email verification process every time you log in."
    : "You will no longer receive a code if we notice an attempted login from an unrecognized device or browser. Are you sure to proceed?"
  const btnText = mfaState ? "Turn on" : "Turn off"

  const handleSubmit = () => {
    submit(new Event("submit", { bubbles: true }))
    // close modal
    dispatch(setMfaModalOpen(false))
    dispatch(setDialog(null))
    // handleToast("modal")
  }

  return (
    <>
      <Box>
        {mfaState && (
          <Box fontSize="14px" color="#A5A5A9" fontFamily="open sans" mb="10px">
            Current account : <span style={{ color: "#CA4AE8" }}>{email}</span>
          </Box>
        )}
        <Box fontSize="14px" color="#A5A5A9" fontFamily="open sans">
          {modalContent}
        </Box>
      </Box>
      <Box display="flex" gap="15px" flexDirection="row-reverse" mt="30px">
        <Box
          onClick={handleSubmit}
          color="#FFF"
          fontSize="16px"
          fontFamily="open sans"
          bgcolor="#A62BC3"
          borderRadius="8px"
          p="12px 20px"
          sx={{
            cursor: "pointer",
          }}
        >
          {btnText}
        </Box>
        <Box
          color="#C0C0C0"
          fontSize="16px"
          fontFamily="open sans"
          border="1px solid #C0C0C0"
          borderRadius="8px"
          p="12px 20px"
          onClick={() => {
            dispatch(setMfaModalOpen(false))
            dispatch(setDialog(null))
          }}
          sx={{
            cursor: "pointer",
          }}
        >
          Cancel
        </Box>
      </Box>
    </>
  )
}

export default MfaModal
