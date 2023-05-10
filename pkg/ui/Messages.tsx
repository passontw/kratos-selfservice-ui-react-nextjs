import Box from "@mui/material/Box"
import { UiText } from "@ory/client"
import { Alert, AlertContent } from "@ory/themes"
import { useSelector } from "react-redux"

import { showToast } from "../../components/Toast"
import ErrorIcon from "../../public/images/ErrorIcon"
import SuccessIcon from "../../public/images/SuccessIcon"
import { selectActiveNav } from "../../state/store/slice/layoutSlice"
import { Navs } from "../../types/enum"

interface MessageProps {
  message: UiText
}

const getDisplayMessage = (displayMessage = "", currentNav: string) => {
  if (
    displayMessage.includes(
      "check for spelling mistakes in your password or username, email address, or phone number.",
    )
  ) {
    return "Your email or password is incorrect. Please check and try again."
  }
  if (displayMessage.includes("The provided credentials are invalid")) {
    return "The provided credentials are invalid. Please try again or sign up."
  }

  if (displayMessage.includes("An account with the same identifier")) {
    if (currentNav === Navs.ACCOUNT) {
      showToast(`Account already in use. Can't be linked`, false)
    }
    return "Email account already existed. Please try login or forgot password."
  }

  return displayMessage
}
export const Message = ({ message }: MessageProps) => {
  const currentNav = useSelector(selectActiveNav)
  const dontShowMsg = "An email containing".includes(
    message.text.substring(0, 10),
  )

  const displayMessage = getDisplayMessage(message.text, currentNav)

  return dontShowMsg ? null : (
    <Alert severity={message.type === "error" ? "error" : "info"}>
      <AlertContent data-testid={`ui/message/${message.id}`}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap="8px"
          bgcolor={message.type === "error" ? "#FFC9E0" : "#D9F7E2"}
          borderRadius="8px"
          p="12px 16px"
        >
          <Box>
            {message.type === "error" ? <ErrorIcon /> : <SuccessIcon />}
          </Box>
          <Box
            fontFamily="open sans"
            fontSize="14px"
            color={message.type === "error" ? "#F44336" : "#74e279"}
          >
            {displayMessage}
          </Box>
        </Box>
      </AlertContent>
    </Alert>
  )
}

interface MessagesProps {
  messages?: Array<UiText>
}

export const Messages = ({ messages }: MessagesProps) => {
  if (!messages) {
    // No messages? Do nothing.
    return null
  }

  return (
    <Box>
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </Box>
  )
}
