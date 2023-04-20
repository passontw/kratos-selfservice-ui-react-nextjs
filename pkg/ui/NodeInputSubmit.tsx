import Box from "@mui/material/Box"
import { getNodeLabel } from "@ory/integrations/ui"
import { Button } from "@ory/themes"
import { NodeNextResponse } from "next/dist/server/base-http/node"
import { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"

import Switch from "../../components/Switch"
import Apple from "../../public/images/login_icons/Apple"
import Google from "../../public/images/login_icons/Google"
import {
  selectActiveNav,
  selectActiveStage,
  selectDialog,
  selectSixDigitCode,
} from "../../state/store/slice/layoutSlice"
import { Navs, Stage } from "../../types/enum"

import { NodeInputProps } from "./helpers"

export function NodeInputSubmit<T>({
  node,
  attributes,
  disabled,
  dispatchSubmit,
  ref,
}: NodeInputProps) {
  const switchRef = useRef(null)
  const activeNav = useSelector(selectActiveNav)
  const activeStage = useSelector(selectActiveStage)
  // const sixDigitCode = useSelector(selectSixDigitCode)
  const isDialogForgotPswd =
    activeStage === Stage.FORGOT_PASSWORD && getNodeLabel(node) === "Submit"
  const isSignINOUT = ["Sign in", "Sign up"].includes(getNodeLabel(node))
  const resendLink = ["Resend code"].includes(getNodeLabel(node))
  const linkRelated =
    getNodeLabel(node).includes("Link") || getNodeLabel(node).includes("Unlink")

  const defaultStyle = {
    backgroundColor: "#A62BC3",
    borderRadius: "8px",
    height: "44px",
    margin: "36px 0px 0px",
    fontSize: "16px",
    fontFamily: "Open Sans",
    color: "#FFF",
    width:
      isDialogForgotPswd || activeNav === Navs.SETTINGS || linkRelated
        ? "95px"
        : "100%",
    position:
      isDialogForgotPswd || activeNav === Navs.SETTINGS ? "absolute" : "unset",
    right:
      activeNav === Navs.SETTINGS
        ? "0px"
        : isDialogForgotPswd
        ? "30px"
        : "unset",
    marginTop: isDialogForgotPswd ? "30px" : isSignINOUT ? "36px" : "unset",
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

  const showButton = [
    "Save",
    "Submit",
    "Resend code",
    "Sign in",
    "Sign up",
    "Link apple",
    "Link google",
    "Unlink google",
    "Unlink apple",
  ].includes(getNodeLabel(node))
  console.log("ppp", getNodeLabel(node))
  const buttonText =
    activeNav === Navs.VERIFICATION && getNodeLabel(node) === "Submit"
      ? "Verify"
      : getNodeLabel(node) === "Resend code"
      ? "Resend"
      : getNodeLabel(node)

  console.log("@modal NodeInputSubmit props ref:", ref)

  const handleClick = () => {
    console.log('handleClick')
  }

  useEffect(()=>{
    console.log('switchRef', switchRef.current)
  },[switchRef.current])

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
            style={
              showButton ? (resendLink ? linkStyle : defaultStyle) : hiddenStyle
            }
            name={attributes.name}
            value={attributes.value || ""}
            disabled={attributes.disabled || disabled}
          >
            {buttonText}
          </Button>
        </Box>
      ) : (
        <>
          <Box>
            <Button
              ref= {switchRef}
              style={
                showButton
                  ? resendLink
                    ? linkStyle
                    : defaultStyle
                  : hiddenStyle
              }
              name={attributes.name}
              value={attributes.value || ""}
              disabled={attributes.disabled || disabled}
              // disabled={
              //   buttonText === "Verify" && sixDigitCode.length !== 6
              //     ? true
              //     : attributes.disabled || disabled
              // }
            >
              {buttonText}
            </Button>
          </Box>
          {linkRelated && (
            <Box
              height="40px"
              maxWidth="400px"
              width="100%"
              bgcolor="#272735"
              borderRadius="12px"
              display="flex"
              p="24px"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box display="flex" gap="20px" alignItems="center">
                <Box>
                  {getNodeLabel(node).includes("google") ? (
                    <Google />
                  ) : getNodeLabel(node).includes("apple") ? (
                    <Apple />
                  ) : null}
                </Box>
                <Box fontFamily="open sans" fontSize="20px" color="#FFF">
                  {getNodeLabel(node).split(" ")[1].charAt(0).toUpperCase() +
                    getNodeLabel(node).split(" ")[1].slice(1)}
                </Box>
              </Box>
              <Box>
                <Switch
                  origin="ACC_LINK"
                  on={getNodeLabel(node).split(" ")[0] === "Unlink"}
                  change={handleClick}
                />
                <Box onClick={dispatchSubmit}>test</Box>
              </Box>
            </Box>
          )}
        </>
      )}
    </>
  )
}
