import { Box, Link } from "@mui/material"
import { TextInput } from "@ory/themes"
import { useRouter } from "next/router"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import styled from "styled-components"

import RadioGroup from "../../components/RadioGroup"
import Select from "../../components/Select"
import RecoveryProcess from "../../components/changepassword/RecoveryProcess"
import CodeInput from "../../components/verification/CodeInput"
import Eye from "../../public/images/eyes"
import {
  selectActiveNav,
  selectActiveStage,
  selectSixDigitCode,
  setDialog,
} from "../../state/store/slice/layoutSlice"
import {
  StyledDefaultInput,
  StyledDefaultLabel,
  StyledPasswordIcon,
} from "../../styles/share"
import { Navs, Stage } from "../../types/enum"
import { SelectOption } from "../../types/general"
import { CenterLink } from "../styled"

import { NodeInputProps } from "./helpers"

export function NodeInputDefault<T>(props: NodeInputProps) {
  const router = useRouter()
  const dispatch = useDispatch()
  const nav = useSelector(selectActiveNav)
  const activeStage = useSelector(selectActiveStage)
  const {
    node,
    attributes,
    value = "",
    setValue,
    disabled,
    validationMsgs,
  } = props
  const label =
    node.meta.label?.text === "ID"
      ? "Email"
      : node.meta.label?.text === "Name"
      ? "Username"
      : node.meta.label?.text === "E-Mail"
      ? "Email"
      : node.meta.label?.text
  const [isError, setIsError] = useState(node.messages.length > 0)
  const [inputType, setInputType] = useState(attributes.type)

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

  const genderRadios = [
    {
      label: "Male",
      value: 1,
    },
    {
      label: "Female",
      value: 2,
    },
    {
      label: "Undisclosed",
      value: 0,
    },
  ]
  const [gender, setGender] = useState(
    attributes.name === "traits.gender" ? value : genderRadios[2].value,
  )

  const [defaultSelectValue, setDefaultSelectValue] = useState(
    genderRadios.find((g) => g.value === value),
  )

  // const defaultSelectValue = genderRadios.find((g) => g.value === gender)

  useEffect(() => {
    if (attributes.name === "traits.gender") {
      console.log("value", value)
      setGender(value ? value : 0)
      setDefaultSelectValue(
        value
          ? genderRadios.find((g) => g.value === parseInt(value))
          : genderRadios[2],
      )
    }
  }, [value])

  console.log("attributes@@@", attributes.name)
  console.log("value@@@", value)

  const verifyCodeConditions =
    (activeStage === Stage.VERIFY_CODE &&
      // nav !== Navs.RECOVERY &&
      nav !== Navs.LOGIN) ||
    (nav === Navs.VERIFICATION && activeStage === Stage.NONE)
  // || activeStage === Stage.DELETE_ACCOUNT

  // Render a generic text input field.
  return (
    <>
      {verifyCodeConditions && (
        <CodeInput show={attributes.name} validationMsgs={validationMsgs} />
      )}
      <StyledDefaultInput isInputLabel={isInputLabel}>
        {isInputLabel && (
          <StyledDefaultLabel isError={isError}>{label}</StyledDefaultLabel>
        )}
        <TextInput
          className="my-text-input"
          style={{
            display:
              (label === "Verify code" &&
                // nav !== Navs.RECOVERY &&
                nav !== Navs.ACCOUNT) ||
              attributes.name === "traits.gender"
                ? "none"
                : "unset",
            border: isError ? "1px solid #F24867" : "none",
            backgroundColor: "#37374F",
            height: "44px",
            color: "#fff",
            caretColor: "#fff",
            borderRadius: "8px",
            padding: isInputLabel ? "0px 50px 0px 82px" : "12px 50px 12px 16px",
            margin: "0px",
            fontFamily: "Open Sans",
          }}
          placeholder={
            isInputLabel
              ? ""
              : (nav === Navs.SETTINGS || nav === Navs.CHANGEPASSWORD) &&
                attributes.name === "password"
              ? "Enter new password"
              : label
          }
          // title={node.meta.label?.text}
          onClick={onClick}
          onChange={(e) => {
            setValue(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.stopPropagation()
              e.preventDefault()
            }
          }}
          type={inputType === "email" ? "text" : inputType}
          name={attributes.name}
          value={value}
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
                  displayText = "This field is required, please fill it out."
                }
                if (text.includes("is not valid")) {
                  displayText =
                    "Invalid email format, please check and try again."
                }
                return (
                  <span
                    key={`${id}-${k}`}
                    data-testid={`ui/message/${id}`}
                    style={{
                      color: "#F24867",
                      fontSize: "13px",
                      fontFamily: "Open Sans",
                    }}
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
        <Box
          width="fit-content"
          color="#CA4AE8"
          fontSize="16px"
          position="relative"
          fontFamily="Open Sans"
          sx={{
            cursor: "pointer",
            ":hover": {
              filter: "brightness(1.5)",
            },
          }}
          onClick={() => {
            openDialog()
          }}
        >
          Forgot Password?
        </Box>
      )}
      {attributes.name === "password" && nav === "REGISTER" && !isError && (
        <span
          style={{
            color: "#7E7E89",
            fontSize: "13px",
            fontFamily: "Open Sans",
          }}
        >
          A combination of numbers and characters. (min 8 characters)
        </span>
      )}
      {console.log("defaultSelectValue", defaultSelectValue)}
      {nav === Navs.PROFILE &&
        attributes.name === "traits.gender" &&
        defaultSelectValue && (
          <Box color="#FFF" ml="3px" position="relative">
            <Box
              display={{
                xs: "none",
                sm: "inline-block",
              }}
            >
              <RadioGroup
                value={gender}
                label="Gender"
                onChange={(e) => {
                  setGender(e.target.value)
                  setValue(e.target.value)
                }}
                radios={genderRadios}
                direction="row"
                custom
              />
            </Box>
            <Box
              display={{
                sm: "none",
                xs: "inline-block",
              }}
            >
              <Select
                title="Gender"
                defaultValue={defaultSelectValue}
                options={genderRadios}
                width={"calc(100vw)"}
                onChange={(selectedOption: SelectOption) => {
                  setGender(selectedOption.value)
                  setValue(selectedOption.value)
                }}
              />
            </Box>
          </Box>
        )}
    </>
  )
}
