import Box from "@mui/material/Box"
import { UiText } from "@ory/client"
import { Alert, AlertContent } from "@ory/themes"

import ErrorIcon from "../../public/images/ErrorIcon"

interface MessageProps {
  message: UiText
}

export const Message = ({ message }: MessageProps) => {
  const dontShowMsg = "An email containing".includes(
    message.text.substring(0, 10),
  )

  let displayMessage = message.text
  if (displayMessage.includes("The provided credentials are invalid")) {
    displayMessage =
      "The provided credentials are invalid. Please try again or sign up."
  }
  if (displayMessage.includes("An account with the same identifier")) {
    displayMessage =
      "Email account already existed. Please try login or forgot password."
  }

  return dontShowMsg ? null : (
    <Alert severity={message.type === "error" ? "error" : "info"}>
      <AlertContent data-testid={`ui/message/${message.id}`}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap="8px"
          bgcolor="#FFC9E0"
          borderRadius="8px"
          p="12px 16px"
        >
          <Box>
            <ErrorIcon />
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
