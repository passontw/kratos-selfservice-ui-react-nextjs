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
  lang? :any
}

const MfaModal: React.FC<MfaModalProps> = ({ submit, email, handleToast, lang }) => {
  const dispatch = useDispatch()
  const mfaState = useSelector(selectMfaState)
  const modalContent = mfaState
    ? lang?.turnOnTwoStepVerifyDesc
    : lang?.turnOffTwoStepVerifyDesc
  const btnText = mfaState ? lang?.turnOn :  lang?.turnOff

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
            {`${lang?.currentAcct} : `} <span style={{ color: "#CA4AE8" }}>{email}</span>
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
            window.location.reload()
          }}
          sx={{
            cursor: "pointer",
          }}
        >
          {lang?.cancel || "Cancel"}
        </Box>
      </Box>
    </>
  )
}

export default MfaModal
