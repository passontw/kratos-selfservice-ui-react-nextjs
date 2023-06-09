import { UiNode } from "@ory/client"
import {
  isUiNodeAnchorAttributes,
  isUiNodeImageAttributes,
  isUiNodeInputAttributes,
  isUiNodeScriptAttributes,
  isUiNodeTextAttributes,
} from "@ory/integrations/ui"
import { ReactHTMLElement, Ref, RefObject } from "react"

import { NodeAnchor } from "./NodeAnchor"
import { NodeImage } from "./NodeImage"
import { NodeInput } from "./NodeInput"
import { NodeScript } from "./NodeScript"
import { NodeText } from "./NodeText"
import { FormDispatcher, ValueSetter } from "./helpers"

interface Props {
  ref?: HTMLButtonElement | null
  node: UiNode
  disabled: boolean
  value: any
  setValue: ValueSetter
  dispatchSubmit: FormDispatcher
  validationMsgs: any
  className?: string
}

export const Node = ({
  node,
  value,
  setValue,
  disabled,
  dispatchSubmit,
  ref,
  validationMsgs,
  className,
}: Props) => {
  console.log("@modal Ref Node ref:", ref)

  if (isUiNodeImageAttributes(node.attributes)) {
    return <NodeImage node={node} attributes={node.attributes} />
  }

  if (isUiNodeScriptAttributes(node.attributes)) {
    return <NodeScript node={node} attributes={node.attributes} />
  }

  if (isUiNodeTextAttributes(node.attributes)) {
    return <NodeText node={node} attributes={node.attributes} />
  }

  if (isUiNodeAnchorAttributes(node.attributes)) {
    return <NodeAnchor node={node} attributes={node.attributes} />
  }

  if (isUiNodeInputAttributes(node.attributes)) {
    return (
      <>
        <NodeInput
          ref={ref}
          dispatchSubmit={dispatchSubmit}
          value={value}
          setValue={setValue}
          node={node}
          disabled={disabled}
          attributes={node.attributes}
          validationMsgs={validationMsgs}
          className={className}
        />
      </>
    )
  }

  return null
}
