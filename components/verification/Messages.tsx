import Box from "@mui/material/Box"
import { UiText } from "@ory/client"
import { Alert, AlertContent } from "@ory/themes"

interface MessageProps {
  message: UiText
}

export const Message = ({ message }: MessageProps) => {
  const dontShowMsg = "An email containing".includes(
    message.text.substring(0, 10),
  )

  return dontShowMsg ? null : (
    <Alert severity={message.type === "error" ? "error" : "info"}>
      <AlertContent data-testid={`ui/message/${message.id}`}>
        <Box color={message.type === "error" ? "#F44336" : "#74e279"}>
          {message.text === "You successfully verified your email address." ? null : message.text}
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
    <div>
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  )
}
