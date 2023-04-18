import { getNodeLabel } from "@ory/integrations/ui"
import { Button } from "@ory/themes"

import { NodeInputProps } from "./helpers"

export function NodeInputButton<T>({
  node,
  attributes,
  setValue,
  disabled,
  dispatchSubmit,
}: NodeInputProps) {
  // Some attributes have dynamic JavaScript - this is for example required for WebAuthn.
  const onClick = (e: React.MouseEvent | React.FormEvent<HTMLFormElement>) => {
    // This section is only used for WebAuthn. The script is loaded via a <script> node
    // and the functions are available on the global window level. Unfortunately, there
    // is currently no better way than executing eval / function here at this moment.
    //
    // Please note that we also need to prevent the default action from happening.
    if (attributes.onclick) {
      e.stopPropagation()
      e.preventDefault()
      const run = new Function(attributes.onclick)
      run()
      return
    }

    setValue(attributes.value).then(() => dispatchSubmit(e))
  }

  return (
    <>
      <Button
        className="button"
        name={attributes.name}
        onClick={(e) => {
          onClick(e)
        }}
        value={attributes.value || ""}
        disabled={attributes.disabled || disabled}
      >
        {getNodeLabel(node) === "Continue"
          ? "Redirect now"
          : getNodeLabel(node)}
      </Button>
    </>
  )
}
