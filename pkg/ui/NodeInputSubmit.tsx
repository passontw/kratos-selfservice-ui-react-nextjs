import { Grid } from "@mui/material"
import Box from "@mui/material/Box"
import { getNodeLabel } from "@ory/integrations/ui"
import { Button } from "@ory/themes"
import { useTranslation } from "next-i18next"
import { NodeNextResponse } from "next/dist/server/base-http/node"
import { useRouter } from "next/router"
import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"

import Switch from "../../components/Switch"
import Timer from "../../components/Timer"
import { showToast } from "../../components/Toast"
import Apple from "../../public/images/login_icons/Apple"
import Google from "../../public/images/login_icons/Google"
import {
  selectActiveNav,
  selectActiveStage,
  selectDialog,
  selectLockCodeResend,
  selectSixDigitCode,
  setActiveStage,
  setLockCodeResend,
} from "../../state/store/slice/layoutSlice"
import { Navs, Stage } from "../../types/enum"

import { NodeInputProps } from "./helpers"

export function NodeInputSubmit<T>({
  node,
  attributes,
  disabled,
  lang,
}: NodeInputProps) {
  const dispatch = useDispatch()
  const router = useRouter()
  const { t } = useTranslation()
  const codeLocked = useSelector(selectLockCodeResend)
  const activeNav = useSelector(selectActiveNav)
  const activeStage = useSelector(selectActiveStage)
  const isDialogForgotPswd =
    activeStage === Stage.FORGOT_PASSWORD && getNodeLabel(node) === "Submit"
  const isSignINOUT = ["Sign in", "Sign up"].includes(getNodeLabel(node))
  const resendLink = ["Resend code"].includes(getNodeLabel(node))
  const linkRelated =
    getNodeLabel(node).includes("Link") || getNodeLabel(node).includes("Unlink")
  const deleteAccount =
    activeNav === Navs.ACCOUNT &&
    activeStage === Stage.DELETE_ACCOUNT &&
    !resendLink
  const deleteAccountResend =
    activeNav === Navs.ACCOUNT && activeStage === Stage.DELETE_ACCOUNT

  const defaultStyle = {
    backgroundColor: "#A62BC3",
    borderRadius: "8px",
    height: "44px",
    margin: deleteAccount ? "36px 0px 0px" : 0,
    fontSize: "16px",
    fontFamily: "Open Sans",
    color: "#FFF",
    minWidth: "95px",
    width: deleteAccount
      ? "111px"
      : activeNav === Navs.SETTINGS || linkRelated
        ? "95px"
        : activeStage === Stage.VERIFY_CODE
          ? "100%"
          : "@media (max-width: 600px) {100%}",
    position: deleteAccount ? "absolute" : "unset",
    right:
      activeNav === Navs.SETTINGS
        ? "0px"
        : isDialogForgotPswd || deleteAccount
          ? "30px"
          : "unset",
    marginTop: deleteAccount
      ? "50px"
      : isDialogForgotPswd
        ? "20px"
        : isSignINOUT
          ? "36px"
          : "unset",
    zIndex: 1,
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
    // width: "50px",
    fontSize: "14px",
    marginTop: "11px",
  }
  const resendStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "4px",
    position: deleteAccountResend ? "absolute" : "unset",
    marginTop: deleteAccountResend ? "20px" : "unset",
    zIndex: 1,
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

  const buttonText = deleteAccount
    ? t("continue") || "Continue"
    : activeNav === Navs.RECOVERY && activeStage === Stage.FORGOT_PASSWORD
      ? lang?.submit
      : (activeNav === Navs.VERIFICATION || activeNav === Navs.RECOVERY) &&
        getNodeLabel(node) === "Submit"
        ? lang?.verify
        : getNodeLabel(node) === "Resend code"
          ? lang?.resend || t("resend") || "Resend"
          : getNodeLabel(node) === "Sign in"
            ? lang?.login
            : getNodeLabel(node) === "Sign up"
              ? lang?.signUp
              : getNodeLabel(node) === "Save"
                ? lang?.save || t("save") || "Save"
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
        <Box display="flex" justifyContent="center" alignItems="center">
          <Box style={resendStyle}>
            <Box fontFamily="open sans" color="#A5A5A9" fontSize="14px">
              {`${lang?.didntReceive || t("didnt_receive") || "Didn't receive"
                } ?`}
            </Box>
            <Button
              style={
                showButton
                  ? resendLink
                    ? linkStyle
                    : defaultStyle
                  : hiddenStyle
              }
              id="resendcode"
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
        </Box>
      ) : (
        <>
          {isDialogForgotPswd ? (
            <Box display="flex" justifyContent="end" gap="12px">
              <Box
                zIndex={1}
                mt="20px"
                width="95px"
                height="44px"
                bgcolor="transparent"
                border="1px solid #C0C0C0"
                borderRadius="8px"
                display="flex"
                justifyContent="center"
                alignItems="center"
                color="#C0C0C0"
                fontFamily="open sans"
                fontSize="16px"
                right="140px"
                sx={{
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  if (activeStage === Stage.FORGOT_PASSWORD) {
                    router.push("/login")
                  }
                  // handleClose(e, "")
                  dispatch(setActiveStage(Stage.NONE))
                }}
              >
                {lang?.cancel}
              </Box>
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
          ) : (
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
          )}
          {linkRelated && (
            <Box
              boxSizing="border-box"
              width="100%"
              bgcolor="#272735"
              borderRadius="12px"
              display="flex"
              p={{
                sm: "24px",
                xs: "12px 20px",
              }}
              alignItems="center"
              justifyContent="space-between"
            >
              <Box
                display="flex"
                gap={{
                  sm: "20px",
                  xs: "16px",
                }}
                alignItems="center"
              >
                <Box height="40px" display="flex" alignItems="center">
                  {getNodeLabel(node).includes("google") ? (
                    <Google />
                  ) : getNodeLabel(node).includes("apple") ? (
                    <Apple />
                  ) : null}
                </Box>
                <Box
                  fontFamily="open sans"
                  fontSize={{
                    sm: "20px",
                    xs: "16px",
                  }}
                  color="#FFF"
                >
                  {getNodeLabel(node).split(" ")[1].charAt(0).toUpperCase() +
                    getNodeLabel(node).split(" ")[1].slice(1)}
                </Box>
              </Box>
              <Box>
                <Switch
                  origin="ACC_LINK"
                  on={getNodeLabel(node).split(" ")[0] === "Unlink"}
                  change={handleClick}
                  handleToast={() => {
                    showToast(`${getNodeLabel(node)}`)
                  }}
                />
              </Box>
            </Box>
          )}
        </>
      )}
    </>
  )
}
