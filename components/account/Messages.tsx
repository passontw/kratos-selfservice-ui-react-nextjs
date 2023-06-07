import Box from "@mui/material/Box"
import { UiText } from "@ory/client"
import { Alert, AlertContent } from "@ory/themes"

interface MessageProps {
  message: UiText
}

export const Message = ({ message }: MessageProps) => {
  return (
    <Alert severity={message.type === "error" ? "error" : "info"}>
      <AlertContent data-testid={`ui/message/${message.id}`}>
        {message.text}
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
    <Box color="#F24867" fontFamily="open sans" fontSize="13px">
      {messages.map((message) => {
        if (message.text.includes("An email containing")) {
          return
        }
        if (message.text.includes("The verification code is invalid")) {
          return "Verification code is incorrect, please check and try again."
        }

        return <Message key={message.id} message={message} />
      })}
    </Box>
  )
}
