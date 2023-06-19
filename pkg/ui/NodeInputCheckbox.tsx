import Box from "@mui/material/Box"
import { getNodeLabel } from "@ory/integrations/ui"
import { Checkbox } from "@ory/themes"

import Switch from "../../components/Switch"
import Mail from "../../public/images/Mail"

import { NodeInputProps } from "./helpers"
import { useTranslation } from "next-i18next"

export function NodeInputCheckbox<T>({
  node,
  attributes,
  setValue,
  disabled,
}: NodeInputProps) {
  const { t } = useTranslation()
  // Render a checkbox.s
  return (
    <Box
      display="flex"
      width={{ sx: "100%", md: "48%" }}
      height={attributes.name === "traits.loginVerification" ? { xs: "64px", md: "74px" } : "88px"}
      bgcolor="#272735"
      borderRadius="12px"
      justifyContent="space-between"
      alignItems="center"
      px={{
        sm: "26px",
        xs: "20px",
      }}
      boxSizing="border-box"
    >
      <Box
        display="flex"
        gap={attributes.name === "traits.loginVerification" ? "14px" : "20px"}
        alignItems="center"
      >
        <Box mt="4px">
          {attributes.name === "traits.loginVerification" ? <Mail /> : "???"}
        </Box>
        <Box fontFamily="open sans" color="#FFF"
            fontSize={{
                sm: "20px",
                xs: "16px",
              }}>
          {attributes.name === "traits.loginVerification" ? t('email') ||"Email" : "???"}
        </Box>
      </Box>
      <Box mt="12px">
        <Switch on={attributes.value} change={setValue} origin="MFA" />
        <Checkbox
          style={{ display: "none" }}
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
