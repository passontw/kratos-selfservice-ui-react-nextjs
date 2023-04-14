import Box from "@mui/material/Box"
import { getNodeLabel } from "@ory/integrations/ui"
import { Button } from "@ory/themes"
import { NodeNextResponse } from "next/dist/server/base-http/node"
import { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"

import Apple from "../../public/images/login_icons/Apple"
import Google from "../../public/images/login_icons/Google"
import { selectActiveNav } from "../../state/store/slice/layoutSlice"
import { Navs } from "../../types/enum"

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
  const linkStyle = {
    backgroundColor: "transparent",
    background: "none",
    color: "#454545",
    border: "none",
    padding: "0",
    cursor: "pointer",
    outline: "inherit",
    width: "50px",
    fontSize: "14px",
    marginTop: "11px",
  }
  console.log("@getNodeLabel(node)", getNodeLabel(node))
  const showButton = ["Submit", "Resend code", "Sign in", "Sign up"].includes(
    getNodeLabel(node),
  )
  const link = ["Resend code"].includes(getNodeLabel(node))
  const activeNav = useSelector(selectActiveNav)
  const buttonText =
    activeNav === Navs.VERIFICATION && getNodeLabel(node) === "Submit"
      ? "Verify"
      : getNodeLabel(node) === "Resend code"
      ? "Resend"
      : getNodeLabel(node)

  const [timeRemaining, setTimeRemaining] = useState(60)
  const timerId = useRef(null)

  useEffect(() => {
    if (timeRemaining > 0 && timerId.current === null) {
      timerId.current = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
        timerId.current = null
      }, 1000)
    } else if (timeRemaining === 0) {
      clearTimeout(timerId.current)
      timerId.current = null
    }

    return () => {
      clearTimeout(timerId.current)
    }
  }, [timeRemaining])

  const resetTimer = () => {
    clearTimeout(timerId.current)
    setTimeRemaining(60)
  }

  return (
    <>
      {getNodeLabel(node) === "Resend code" ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap="4px"
        >
          <Box fontFamily="open sans" color="#A5A5A9" fontSize="14px">
            Didn’t receive?
          </Box>
          <Button
            style={showButton ? (link ? linkStyle : defaultStyle) : hiddenStyle}
            name={attributes.name}
            value={attributes.value || ""}
            disabled={attributes.disabled || disabled}
            onClick={resetTimer}
          >
            {buttonText}
          </Button>
          <Box fontFamily="open sans" color="#A5A5A9" fontSize="14px">
            ({timeRemaining})
          </Box>
        </Box>
      ) : (
        <Button
          style={showButton ? (link ? linkStyle : defaultStyle) : hiddenStyle}
          name={attributes.name}
          value={attributes.value || ""}
          disabled={attributes.disabled || disabled}
        >
          {buttonText}
        </Button>
      )}
    </>
  )
}
