import { getNodeLabel } from "@ory/integrations/ui"
import { Button } from "@ory/themes"
import { NodeNextResponse } from "next/dist/server/base-http/node"

import Apple from "../../public/images/login_icons/Apple"
import Google from "../../public/images/login_icons/Google"

import { NodeInputProps } from "./helpers"

export function NodeInputSubmit<T>({
  node,
  attributes,
  disabled,
}: NodeInputProps) {
  const defaultStyle = {
    backgroundColor: "#A62BC3",
    borderRadius: "8px",
    height: "44px",
  }
  const hiddenStyle = {
    display: "none",
  }
  console.log(getNodeLabel(node))
  const showButton = ["Submit", "Resend code", "Sign in", "Sign up"].includes(
    getNodeLabel(node),
  )

  return (
    <>
      <Button
        style={showButton ? defaultStyle : hiddenStyle}
        name={attributes.name}
        value={attributes.value || ""}
        disabled={attributes.disabled || disabled}
      >
        {getNodeLabel(node)}
      </Button>
    </>
  )
}
