import { useTranslation } from "next-i18next"
import React, {
  useState,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react"
import { useDispatch, useSelector } from "react-redux"
import styled from "styled-components"

import { setSixDigitCode } from "../../state/store/slice/layoutSlice"
import {
  selectIsInputChanging,
  selectIsSubmitting,
  setIsInputChanging,
} from "../../state/store/slice/verificationSlice"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
`

const InputsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  @media only screen and (max-width: 599px) {
    justify-content: space-between;
    width: 100%;
  }
  @media only screen and (max-width: 435px) {
    gap: 6px;
  }
`

interface InputProps {
  error?: boolean
}

const Input = styled.input<InputProps>`
  width: 48px;
  height: 54px;
  background: #37374f;
  border: 1px solid
    ${(props) => (props.error ? "rgb(242, 72, 103)" : "#37374f")};
  border-radius: 8px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  @media only screen and (max-width: 435px) {
    width: 36px;
    height: 50px;
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }
  &:focus-visible {
    border-color: #37374f;
  }
`

const Title = styled.h3`
  font-family: "Open Sans", sans-serif;
  font-weight: 400;
  font-size: 13px;
  color: #717197;
  margin: 0;
`

interface CodeInput {
  show?: string
  validationMsgs?: any
  code?: string[]
  setCode?: Dispatch<SetStateAction<string[]>>
  isTouched?: boolean
  setIsTouched?: Dispatch<SetStateAction<boolean>>
  inputBlurred?: boolean
  setInputBlurred?: Dispatch<SetStateAction<boolean>>
  validationError?: string
  setValidationError?: Dispatch<SetStateAction<string>>
}

const CodeInput: React.FC<CodeInput> = ({
  show,
  validationMsgs,
  code,
  setCode,
  isTouched,
  setIsTouched,
  inputBlurred,
  setInputBlurred,
  validationError,
  setValidationError,
}) => {
  const isInputChanging = useSelector(selectIsInputChanging)
  const globalState = useSelector((state) => state)
  const isSubmitting = useSelector(selectIsSubmitting)
  const { t } = useTranslation()
  const ref = useRef(null)
  const dispatch = useDispatch()
  const firstInputRef = useRef(null)

  useEffect(() => {
    firstInputRef.current?.focus()
  }, [])

  useEffect(() => {
    const isEmpty = !code.filter((item) => item !== "").length
    console.log("@validationDebug2 useEffect isEmpty", isEmpty)
    console.log("@validationDebug2 useEffect inputBlurred", inputBlurred)
    console.log("@validationDebug2 useEffect isSubmitting", isSubmitting)
    if ((isEmpty && inputBlurred) || (isEmpty && isSubmitting)) {
      setValidationError(
        t("error-field_required") ||
          "This field is required, please fill it out.",
      )
    } else {
      setValidationError("")
    }
  }, [code, inputBlurred, isSubmitting])

  const handleInputChange = (e, index) => {
    // if inputs are still untouched set them to touched as inputs are being typed in
    if (!isTouched) {
      // setIsTouched(true)
    }

    dispatch(setIsInputChanging(true))

    const value = e.target.value

    let updatedCode = [...code]

    console.log("@validationDebug attempting to focus new...")

    if (e.nativeEvent.inputType === "deleteContentBackward") {
      console.log("@validationDebug 1")
      updatedCode = [...code.slice(0, index - 1), "", ...code.slice(index)]
      if (index > 0) {
        // select input that isn't nested inside hidden sections
        const targetInput = e.target.parentNode.querySelector(
          `#input-verification-${index + 1}`,
        )

        console.log("@validationDebug targetted input:", targetInput)

        // focus the correct input for the user to type in
        if (targetInput) {
          targetInput.focus()
        }
      }
    } else if (/^[0-9]*$/.test(value)) {
      updatedCode = [
        ...code.slice(0, index),
        value.slice(-1),
        ...code.slice(index + 1),
      ]
      if (value && index < 5) {
        // select input that isn't nested inside hidden sections
        const targetInput = e.target.parentNode.querySelector(
          `#input-verification-${index + 1}`,
        )

        // focus the correct input for the user to type in
        if (targetInput) {
          targetInput.focus()
        }
      }
    } else if (value === "") {
      updatedCode = [...code.slice(0, index), "", ...code.slice(index + 1)]
    }

    setCode(updatedCode)

    // Dispatch setSixDigitCode action with the updated code
    dispatch(setSixDigitCode(updatedCode.join("")))
  }

  const handleKeyDown = (e, index) => {
    dispatch(setIsInputChanging(true))
    if (e.key === "Backspace") {
      let updatedCode = [...code]

      if (index > 0 && e.target.value === "") {
        const targetInput = e.target.parentNode.querySelector(
          `#input-verification-${index - 1}`,
        )

        targetInput.focus()
        updatedCode = [...code.slice(0, index - 1), "", ...code.slice(index)]
      } else {
        updatedCode = [...code.slice(0, index), "", ...code.slice(index + 1)]
      }

      setCode(updatedCode)

      // Dispatch setSixDigitCode action with the updated code
      dispatch(setSixDigitCode(updatedCode.join("")))
    }
  }

  const isInValid =
    validationMsgs &&
    validationMsgs[0]?.text ===
      "The recovery code is invalid or has already been used. Please try again."

  const text = isInValid
    ? t("error-verif_code_incorrect") ||
      "Verification code is incorrect, please check and try again."
    : ""

  // mapping validation message from ORY to match the confirmed design from clients
  const validationMsgMapping = (msg: string) => {
    console.log("@validationDebug2 msg:", msg)
    switch (msg) {
      case "The verification code is invalid or has already been used. Please try again.": {
        return (
          t("error-verif_code_incorrect") ||
          "Verification code is incorrect, please check and try again."
        )
      }
      case "6 word": {
        return (
          t("error-verif_code_incorrect") ||
          "This field is required, please fill it out"
        )
      }
      case "": {
        return t("error-field_required")
      }

      case "This field is required, please fill it out.": {
        if (code?.filter((item) => item.length > 0).length || 0 > 0) {
          return t("error-verif_code_incorrect")
        }
      }
      default: {
        return msg
      }
    }
  }

  const isRouteAllowed =
    window.location.pathname.includes("/verification") ||
    window.location.pathname.includes("/account") ||
    window.location.pathname.includes("/recovery")

  console.log("@validationDebug2 validationError:", validationError)
  console.log("@validationDebug2 validationMsgs (inner):", validationMsgs)
  console.log("@validationDebug2 redux isInputChanging:", isInputChanging)
  console.log("@validationDebug2 redux globalState:", globalState)
  console.log("@validationDebug2 code:", code)

  return show !== "email" ? (
    <Container>
      <Title>{t("verif_code") || "Verification Code"}</Title>
      <span className="verification-inputs">
        <InputsWrapper onClick={() => !isTouched && setIsTouched(true)}>
          {code.map((digit, index) => (
            <Input
              id={
                isRouteAllowed
                  ? `input-verification-${index}`
                  : `input-${index}`
              }
              key={index}
              maxLength={1}
              value={digit}
              ref={index === 0 ? firstInputRef : null}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              error={
                validationError ||
                (validationMsgs.length && !isInputChanging) ||
                (!validationMsgs.length &&
                  code?.filter((item) => item !== "").length === 6 &&
                  !isInputChanging)
              }
              // onBlur={() => setInputBlurred(true)}
            />
          ))}
        </InputsWrapper>
      </span>
      <div
        style={{
          color: "rgb(242, 72, 103)",
          fontSize: "13px",
          fontFamily: "Open Sans",
        }}
      >
        {validationError
          ? // custom required input validation
            validationError
          : // For handling exception of 6 digit submit where error code is wrong but
          // there is missing validation message from props
          !validationMsgs.length &&
            code?.filter((item) => item !== "").length === 6 &&
            !isInputChanging
          ? t("error-verif_code_incorrect")
          : // if there is actual validationMsgs recieved and input is currently not being typed in
            !isInputChanging &&
            validationMsgs.map(
              (
                msg: { context: {}; id: number; text: string; type: string },
                index: number,
              ) => (
                <div key={index} style={{ margin: "10px 0" }}>
                  {console.log("@validationDebug2 mapped msg", msg.text)}
                  {validationMsgMapping(msg.text)}
                </div>
              ),
            )}
      </div>

      {isInValid && (
        <div
          style={{
            fontFamily: "Open Sans",
            fontWeight: 400,
            fontSize: "13px",
            color: "red",
          }}
        >
          {text}
        </div>
      )}
    </Container>
  ) : null
}

export default CodeInput
