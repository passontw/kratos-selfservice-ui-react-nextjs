import { fontFamily, fontSize } from '@mui/system'
import { UiNode, UiNodeAnchorAttributes } from "@ory/client"
import { Button } from "@ory/themes"

interface Props {
  node: UiNode
  attributes: UiNodeAnchorAttributes
}

export const NodeAnchor = ({ node, attributes }: Props) => {
  return (
    <Button
      data-testid={`node/anchor/${attributes.id}`}
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        window.location.href = attributes.href
      }}
      style={{
        backgroundColor: '#A62BC3',
        borderRadius: '8px',
        color: '#fff',
        padding: '10px 20px',
        fontSize: '16px',
        fontFamily: 'Open Sans'
      }}
    >
      {attributes.title.text === 'Continue'? 'Redirect now' : attributes.title.text }
    </Button>
  )
}
