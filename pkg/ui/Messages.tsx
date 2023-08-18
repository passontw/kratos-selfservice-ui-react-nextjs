import Box from "@mui/material/Box"
import { UiText } from "@ory/client"
import { Alert, AlertContent } from "@ory/themes"
import { useTranslation } from "next-i18next"

import ErrorIcon from "../../public/images/ErrorIcon"
import SuccessIcon from "../../public/images/SuccessIcon"

interface MessageProps {
  message: UiText
}

const getDisplayMessage = (displayMessage = "", t: any) => {
  if (
    displayMessage.includes(
      "check for spelling mistakes in your password or username, email address, or phone number.",
    )
  ) {
    return t("error-email_or_pw_incorrect")
  }
  if (displayMessage.includes("The provided credentials are invalid")) {
    return t("error-email_or_pw_incorrect")
  }

  if (displayMessage.includes("An account with the same identifier")) {
    return t("error-email_existed")
  }

  if (
    displayMessage.includes(
      "Please confirm this action by verifying that it is you",
    )
  ) {
    return t("error-verify_account")
  }

  return displayMessage
}
export const Message = ({ message }: MessageProps) => {
  const { t } = useTranslation()
  console.log("@message", message)
  const dontShowMsg = "An email containing".includes(
    message.text.substring(0, 10),
  )

  const displayMessage = getDisplayMessage(message.text, t)

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
