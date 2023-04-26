import { UiNode } from "@ory/client"
import {
  isUiNodeAnchorAttributes,
  isUiNodeImageAttributes,
  isUiNodeInputAttributes,
  isUiNodeScriptAttributes,
  isUiNodeTextAttributes,
} from "@ory/integrations/ui"

import { NodeAnchor } from "../../pkg/ui/NodeAnchor"
import { NodeImage } from "../../pkg/ui/NodeImage"
import { NodeInput } from "../../pkg/ui/NodeInput"
import { NodeScript } from "../../pkg/ui/NodeScript"
import { NodeText } from "../../pkg/ui/NodeText"
import { FormDispatcher, ValueSetter } from "../../pkg/ui/helpers"

interface Props {
  node: UiNode
  disabled: boolean
  value: any
  setValue: ValueSetter
  dispatchSubmit: FormDispatcher
  handleToast: () => void
}

export const Node = ({
  node,
  value,
  setValue,
  disabled,
  dispatchSubmit,
  // handleToast,
}: Props) => {
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
      <NodeInput
        dispatchSubmit={dispatchSubmit}
        // handleToast={handleToast}
        value={value}
        setValue={setValue}
        node={node}
        disabled={disabled}
        attributes={node.attributes}
      />
    )
  }

  return null
}
