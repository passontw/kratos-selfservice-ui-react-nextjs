import { Box, Link } from "@mui/material"
import { TextInput } from "@ory/themes"
import { useRouter } from "next/router"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import styled from "styled-components"

import RecoveryProcess from "../../components/changepassword/RecoveryProcess"
import CodeInput from "../../components/verification/CodeInput"
import Eye from "../../public/images/eyes"
import {
  selectActiveNav,
  selectActiveStage,
  selectSixDigitCode,
  setDialog,
} from "../../state/store/slice/layoutSlice"
import { Navs, Stage } from "../../types/enum"
import { CenterLink } from "../styled"

import { NodeInputProps } from "./helpers"

const StyledDefaultInput = styled.div`
  position: relative;
  input:-webkit-autofill,
  textarea:-webkit-autofill,
  select:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px #37374F inset !important;
    -webkit-text-fill-color: white !important;
  }

  
  input {
    padding: ${(props) =>
      props.isInputLabel ? "12px 16px 12px 82px" : "12px 16px"};
  } 
}
`
const StyledDefaultLabel = styled.label`
  font-family: "Open Sans";
  font-weight: 400;
  font-size: 13px;
  line-height: 20px;
  position: absolute;
  pointer-events: none;
  left: 16px;
  top: ${(props) => (props?.isError ? "40%" : "45%")};
  transform: translate(0%, -50%);
  color: #717197;
`
const StyledPasswordIcon = styled.span`
  display: inline-block;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  position: absolute;
  right: 16px;
  top: ${(props) => (props?.isError ? "40%" : "45%")};
  transform: translate(0%, -50%);
  cursor: pointer;
`

export function NodeInputDefault<T>(props: NodeInputProps) {
  const router = useRouter()
  const dispatch = useDispatch()
  const nav = useSelector(selectActiveNav)
  const activeStage = useSelector(selectActiveStage)
  const sixDigitCode = useSelector(selectSixDigitCode)
  const { node, attributes, value = "", setValue, disabled } = props
  const label = node.meta.label?.text === "ID" ? "Email" : node.meta.label?.text
  const [isError, setIsError] = useState(node.messages.length > 0)
  const [inputType, setInputType] = useState(attributes.type)
  const inputRef = useRef(null)

  useEffect(() => {
    setIsError(node.messages.length > 0)
  }, [node.messages.length])

  const isInputLabel = useMemo(() => {
    const list = ["/login", "/registration"]
    return list.includes(router.pathname)
  }, [router.pathname])

  // Some attributes have dynamic JavaScript - this is for example required for WebAuthn.

  const handleEye = () => {
    inputType === "password" ? setInputType("text") : setInputType("password")
  }

  const onClick = () => {
    // This section is only used for WebAuthn. The script is loaded via a <script> node
    // and the functions are available on the global window level. Unfortunately, there
    // is currently no better way than executing eval / function here at this moment.
    if (attributes.onclick) {
      const run = new Function(attributes.onclick)
      run()
    }
  }

  const openDialog = () => {
    dispatch(
      setDialog({
        title: "Forgot Password",
        titleHeight: "58px",
        width: 480,
        height: 358,
        center: true,
        children: <RecoveryProcess />,
      }),
    )
  }

  // Render a generic text input field.
  return (
    <>
      {/* <CodeInput /> */}
      {activeStage === Stage.VERIFY_CODE && <CodeInput />}
      <StyledDefaultInput isInputLabel={isInputLabel}>
        {isInputLabel && (
          <StyledDefaultLabel isError={isError}>{label}</StyledDefaultLabel>
        )}
        <TextInput
          className="my-text-input"
          style={{
            display: label === "Verify code" ? "none" : "unset",
            border: isError ? "1px solid #F24867" : "none",
            backgroundColor: "#37374F",
            height: "44px",
            color: "#fff",
            caretColor: "#fff",
            borderRadius: "8px",
          }}
          placeholder={
            isInputLabel
              ? ""
              : nav === Navs.SETTINGS && attributes.name === "password"
              ? "Enter new password"
              : label
          }
          // title={node.meta.label?.text}
          onClick={onClick}
          onChange={(e) => {
            setValue(e.target.value)
          }}
          type={inputType}
          name={attributes.name}
          value={value}
          // value={label === "Verify code" ? sixDigitCode : value}
          disabled={attributes.disabled || disabled}
          help={node.messages.length > 0}
          state={
            node.messages.find(({ type }) => type === "error")
              ? "error"
              : undefined
          }
          subtitle={
            <>
              {node.messages.map(({ type, text, id }, k) => {
                let displayText = text
                if (text.includes("is missing")) {
                  // const field = text.split(" ")[1]
                  displayText = "This field is required, please fill it out."
                }
                return (
                  <span
                    key={`${id}-${k}`}
                    data-testid={`ui/message/${id}`}
                    style={{ color: "#F24867", fontSize: "13px" }}
                  >
                    {displayText}
                  </span>
                )
              })}
            </>
          }
        />
        {attributes.type === "password" && (
          <StyledPasswordIcon isError={isError}>
            <Eye setInputType={handleEye} />
          </StyledPasswordIcon>
        )}
      </StyledDefaultInput>
      {attributes.name === "password" && nav === "LOGIN" && (
        <span
          style={{
            color: "#CA4AE8",
            fontSize: "13px",
            cursor: "pointer",
            fontFamily: "Open Sans",
          }}
          onClick={() => {
            openDialog()
          }}
        >
          Forgot Password?
        </span>
      )}
    </>
  )
}
