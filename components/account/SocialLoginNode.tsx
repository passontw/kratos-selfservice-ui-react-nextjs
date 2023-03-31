import isEmpty from "lodash/isEmpty"
import { getNodeLabel } from "@ory/integrations/ui"
import { Button, Checkbox, TextInput } from "@ory/themes"

import { FormDispatcher, NodeInputProps, ValueSetter } from "./helpers"

export default function SocialLoginNode<T>({
  node,
  attributes,
  setValue,
  disabled,
  dispatchSubmit,
}: NodeInputProps) {
  if (isEmpty(node)) return null;
  return (
    <>
      <Button
        name={attributes.name}
        onClick={(e) => {
          // On click, we set this value, and once set, dispatch the submission!
          setValue(attributes.value).then(() => dispatchSubmit(e))
        }}
        value={attributes.value || ""}
        disabled={attributes.disabled || disabled}
      >
        {getNodeLabel(node)}
      </Button>
    </>
  )
}
