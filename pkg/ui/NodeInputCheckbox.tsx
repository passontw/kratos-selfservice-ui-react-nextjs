import Box from "@mui/material/Box"
import { getNodeLabel } from "@ory/integrations/ui"
import { Checkbox } from "@ory/themes"

import { NodeInputProps } from "./helpers"

export function NodeInputCheckbox<T>({
  node,
  attributes,
  setValue,
  disabled,
}: NodeInputProps) {
  // Render a checkbox.s
  return (
    <Box
      display="flex"
      width="100%"
      maxWidth="454px"
      height="88px"
      bgcolor="#272735"
      borderRadius="12px"
      justifyContent="space-between"
      alignItems="center"
    >
      <Box display="flex">
        <Box>logo</Box>
        <Box>fieldName</Box>
      </Box>
      <Box>
        <Checkbox
          style={{ display: "block" }}
          name={attributes.name}
          defaultChecked={attributes.value}
          onChange={(e) => setValue(e.target.checked)}
          disabled={attributes.disabled || disabled}
          label={getNodeLabel(node)}
          state={
            node.messages.find(({ type }) => type === "error")
              ? "error"
              : undefined
          }
          subtitle={node.messages.map(({ text }) => text).join("\n")}
        />
      </Box>
    </Box>
  )
}
