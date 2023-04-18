import Box from "@mui/material/Box"
import { getNodeLabel } from "@ory/integrations/ui"
import { Checkbox } from "@ory/themes"

import Switch from "../../components/Switch"
import Mail from "../../public/images/Mail"

import { NodeInputProps } from "./helpers"

export function NodeInputCheckbox<T>({
  node,
  attributes,
  setValue,
  disabled,
}: NodeInputProps) {
  console.log("@checklabel", attributes.name)
  // Render a checkbox.s
  return (
    <Box
      display="flex"
      width="100%"
      maxWidth="454px"
      height={attributes.name === "traits.loginVerification" ? "74px" : "88px"}
      bgcolor="#272735"
      borderRadius="12px"
      justifyContent="space-between"
      alignItems="center"
      px="26px"
    >
      <Box
        display="flex"
        gap={attributes.name === "traits.loginVerification" ? "14px" : "20px"}
        alignItems="center"
      >
        <Box>
          {attributes.name === "traits.loginVerification" ? <Mail /> : "???"}
        </Box>
        <Box fontFamily="open sans" color="#FFF" fontSize="20px">
          {attributes.name === "traits.loginVerification" ? "Email" : "???"}
        </Box>
      </Box>
      <Box>
        <Switch />
        <Checkbox
          style={{ display: "block" }}
          name={attributes.name}
          defaultChecked={attributes.value}
          onChange={(e) => setValue(e.target.checked)}
          disabled={attributes.disabled || disabled}
          // label={getNodeLabel(node)}
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
