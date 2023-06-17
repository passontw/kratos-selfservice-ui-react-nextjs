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
import VerificationInput from "../../components/verification/VerificationInput"
import Eye from "../../public/images/eyes"
import {
  selectActiveNav,
  selectActiveStage,
  selectSixDigitCode,
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
  const { node, attributes, value, setValue, disabled, validationMsgs, lang } = props
  console.log(lang)
  console.log(node.meta.label?.text)
  const label =
    node.meta.label?.text === "ID"
      ? lang?.email
      : node.meta.label?.text === "Name" || node.meta.label?.text === "Username"
      ? lang?.username
      : node.meta.label?.text === "E-Mail" || node.meta.label?.text === "Email"
      ? lang?.email
      : node.meta.label?.text === "Password"
      ? lang?.password
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
      value: 3,
    },
  ]
  const [gender, setGender] = useState(
    attributes.name === "traits.gender" && value
      ? value
      : genderRadios[2].value,
  )

  const [selectValue, setSelectValue] = useState(undefined)
  const [selectValue2, setSelectValue2] = useState(1)

  const [defaultSelectValue, setDefaultSelectValue] = useState(
    genderRadios.find((g) => g.value === parseInt(gender)),
  )

  useEffect(() => {
    if (value && attributes.name === "traits.gender") {
      setGender(value ? value : 3)
      setDefaultSelectValue(
        value
          ? genderRadios.find((g) => g.value === parseInt(value))
          : genderRadios[2],
      )
      setSelectValue(1)
    }
    if (value !== undefined && attributes.name === "traits.gender") {
      setSelectValue2(undefined)
    }
  }, [value])

  const accountError =
    validationMsgs &&
    (validationMsgs[0]?.text.includes("Email account") ||
      validationMsgs[0]?.text.includes("The provided credentials are invalid"))

  const verifyCodeConditions =
    (activeStage === Stage.VERIFY_CODE &&
      // nav !== Navs.RECOVERY &&
      nav !== Navs.LOGIN) ||
    (nav === Navs.VERIFICATION && activeStage === Stage.NONE)
    || activeStage === Stage.DELETE_ACCOUNT
  // const verifyCodeConditions2 = activeStage === Stage.DELETE_ACCOUNT

  // Render a generic text input field.
  return (
    <>
      {verifyCodeConditions && (
        <VerificationInput lang={lang}/>
      )}
      {/* {verifyCodeConditions2 && <VerificationInput />} */}
      <StyledDefaultInput isInputLabel={isInputLabel}>
        {isInputLabel && (
          <StyledDefaultLabel isError={isError}>{label}</StyledDefaultLabel>
        )}
        <TextInput
          className="my-text-input"
          style={{
            display:
              (label === "Verify code") ||
              attributes.name === "traits.gender"
                ? "none"
                : "unset",
            border: isError || accountError ? "1px solid #F24867" : "8px solid #37374F",
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
              ? lang?.enterNewPw
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
              {node.messages.map(({ type, text = "", id }, k) => {
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
            router.push("/recovery")
          }}
        >
          {`${lang?.forgotPw}`}
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
          {lang?.signUpPwHint}
        </span>
      )}
      {nav === Navs.PROFILE && attributes.name === "traits.gender" && (
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
            {selectValue && (
              <Select
                title="Gender"
                defaultValue={defaultSelectValue}
                options={genderRadios}
                width={"calc(100vw)"}
                onChange={(selectedOption: SelectOption) => {
                  setGender(parseInt(selectedOption.value))
                  setValue(parseInt(selectedOption.value))
                }}
              />
            )}
            {selectValue2 && (
              <Select
                title="Gender"
                defaultValue={defaultSelectValue}
                options={genderRadios}
                width={"calc(100vw)"}
                onChange={(selectedOption: SelectOption) => {
                  setGender(parseInt(selectedOption.value))
                  setValue(parseInt(selectedOption.value))
                }}
              />
            )}
          </Box>
        </Box>
      )}
    </>
  )
}
