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
    width: 45px;
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
  const ref = useRef(null)
  const dispatch = useDispatch()
  const firstInputRef = useRef(null)

  useEffect(() => {
    firstInputRef.current?.focus()
  }, [])

  useEffect(() => {
    console.log("@validation code:", code)
    const isEmpty = !code.filter((item) => item !== "").length
    console.log("@validation isEmpty", isEmpty)
    if (isEmpty && inputBlurred) {
      setValidationError("This field is required, please fill it out.")
    } else {
      setValidationError("")
    }
  }, [code, inputBlurred])

  console.log("@validation validationError:", validationError)
  console.log("@validation isTouched", isTouched)

  const handleInputChange = (e, index) => {
    // if inputs are still untouched set them to touched as inputs are being typed in
    if (!isTouched) {
      setIsTouched(true)
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
      console.log("@validationDebug 2")
      updatedCode = [
        ...code.slice(0, index),
        value.slice(-1),
        ...code.slice(index + 1),
      ]
      if (value && index < 5) {
        console.log(
          "@validationDebug 2 getting element by id and focusing at index:",
          `input-${index + 1}`,
          e.target.parentNode.querySelector(`#input-verification-${index + 1}`),
        )
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
    ? "Verification code is incorrect, please check and try again."
    : ""

  // mapping validation message from ORY to match the confirmed design from clients
  const validationMsgMapping = (msg: string) => {
    console.log("@validation validationMsgMapping msg:", msg)
    switch (msg) {
      case "The verification code is invalid or has already been used. Please try again.": {
        return "Verification code is incorrect, please check and try again"
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
  console.log("@validationDebug2 isInputChanging:", isInputChanging)

  return show !== "email" ? (
    <Container>
      <Title>Verification Code</Title>
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
                validationError || (validationMsgs.length && !isInputChanging)
              }
              onBlur={() => setInputBlurred(true)}
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
          ? validationError
          : !isInputChanging &&
            validationMsgs.map(
              (
                msg: { context: {}; id: number; text: string; type: string },
                index: number,
              ) => (
                <div key={index} style={{ margin: "10px 0" }}>
                  {" "}
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
