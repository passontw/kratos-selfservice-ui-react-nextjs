import { Box } from "@mui/system"
import React from "react"
import { toast } from "react-toastify"

import SuccessIcon from "../../public/images/SuccessIcon"

import { StyledMessage, StyledStatus, StyleSucess, StyleError } from "./styles"

/**
 *
 * @param message - message to show on toast window
 * @param success - boolean value to show either success or error toast
 * @param position - position of toast, example option: toast.POSITION.TOP_RIGHT,
 * @returns
 */
export const showToast = (
  message: string,
  success: boolean = true,
  hideProgressBar: boolean = true,
  position = toast.POSITION.BOTTOM_LEFT,
  stylesucess = StyleSucess,
  styleerror = StyleError
) => {
  return success
    ? toast(<Success message={message} />, { position, hideProgressBar, style: stylesucess })
    : toast.error(message, { position, style: styleerror })
}

interface SuccessProps {
  message: string
}

const Success: React.FC<SuccessProps> = ({ message }) => {
  return (
    <Box display="flex" alignItems="center">
      <StyledStatus>
        <SuccessIcon />
      </StyledStatus>
      <StyledMessage>{message}</StyledMessage>
    </Box>
  )
}
