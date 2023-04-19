import { UiNode, UiNodeInputAttributes } from "@ory/client"
import { FormEvent, MouseEvent, Ref } from "react"

export type ValueSetter = (
  value: string | number | boolean | undefined,
) => Promise<void>

export type FormDispatcher = (
  e: FormEvent<HTMLFormElement> | MouseEvent,
) => Promise<void>

export interface NodeInputProps {
  node: UiNode
  attributes: UiNodeInputAttributes
  value: any
  disabled: boolean
  dispatchSubmit: FormDispatcher
  setValue: ValueSetter
<<<<<<< HEAD
  ref?: Ref<HTMLButtonElement>
=======
  handleClick: Function
>>>>>>> 8fb9da6b7b60ccb39b4e0e56d55112b8ec48fc96
}
