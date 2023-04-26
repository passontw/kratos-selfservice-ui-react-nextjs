import { Grid } from "@mui/material"
import Box from "@mui/material/Box"
import { getNodeLabel } from "@ory/integrations/ui"
import { Button } from "@ory/themes"
import { NodeNextResponse } from "next/dist/server/base-http/node"
import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"

import Switch from "../../components/Switch"
import Timer from "../../components/Timer"
import { showToast } from '../../components/Toast'
import Apple from "../../public/images/login_icons/Apple"
import Google from "../../public/images/login_icons/Google"
import {
  selectActiveNav,
  selectActiveStage,
  selectDialog,
  selectLockCodeResend,
  selectSixDigitCode,
  setLockCodeResend,
} from "../../state/store/slice/layoutSlice"
import { Navs, Stage } from "../../types/enum"

import { NodeInputProps } from "./helpers"

export function NodeInputSubmit<T>({
  node,
  attributes,
  disabled,
  dispatchSubmit,
  // handleToast,
  ref,
}: NodeInputProps) {
  const dispatch = useDispatch()
  const codeLocked = useSelector(selectLockCodeResend)
  const activeNav = useSelector(selectActiveNav)
  const activeStage = useSelector(selectActiveStage)
  const sixDigitCode = useSelector(selectSixDigitCode)
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
    position: isDialogForgotPswd ? "absolute" : "unset",
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
    color: codeLocked ? "#454545" : "#CA4AE8",
    border: "none",
    padding: "0",
    cursor: "pointer",
    outline: "inherit",
    width: "50px",
    fontSize: "14px",
    marginTop: "11px",
  }

  let showButton = [
    "Save",
    "Submit",
    "Resend code",
    "Sign in",
    "Sign up",
    // "Link apple",
    // "Link google",
    // "Unlink google",
    // "Unlink apple",
  ].includes(getNodeLabel(node))

  if (activeNav === Navs.ACCOUNT && getNodeLabel(node) === "Save") {
    showButton = false
  }

  const buttonText =
    (activeNav === Navs.VERIFICATION || activeNav === Navs.RECOVERY) &&
    getNodeLabel(node) === "Submit"
      ? "Verify"
      : getNodeLabel(node) === "Resend code"
      ? "Resend"
      : getNodeLabel(node) === "Sign in"
      ? "Login"
      : getNodeLabel(node)

  const handleClick = () => {
    const clickAppleBtn = document.querySelector(".apple >button")
    const clickGoogleBtn = document.querySelector(".google >button")
    if (attributes.value === "apple") {
      clickAppleBtn.click()
    } else {
      clickGoogleBtn.click()
    }
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
            Didn't receive?
          </Box>

          <Button
            style={
              showButton ? (resendLink ? linkStyle : defaultStyle) : hiddenStyle
            }
            name={attributes.name}
            value={attributes.value || ""}
            disabled={attributes.disabled || disabled}
            onClick={(e) => {
              if (!codeLocked) {
                dispatch(setLockCodeResend(true))
              } else {
                e.preventDefault()
                e.stopPropagation()
              }
            }}
          >
            {buttonText}
          </Button>

          <Box>{codeLocked && <Timer />}</Box>
        </Box>
      ) : (
        <>
          <Box>
            <Button
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
              className={attributes.value}
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
              boxSizing="border-box"
              width="100%"
              bgcolor="#272735"
              borderRadius="12px"
              display="flex"
              p="24px"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box display="flex" gap="20px" alignItems="center">
                <Box height="40px">
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
                  handleToast={()=>showToast(`${getNodeLabel(node)}`)}
                />
              </Box>
            </Box>
          )}
        </>
      )}
    </>
  )
}
