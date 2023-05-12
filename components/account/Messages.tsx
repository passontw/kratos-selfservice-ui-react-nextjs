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
    <div>
      {messages.map((message) => {
        if (message.text.includes("An email containing")) {
          return
        }
        if (message.text.includes("The verification code is invalid")) {
          return "Wrong verification code"
        }
        
        return <Message key={message.id} message={message} />
      })}
    </div>
  )
}
