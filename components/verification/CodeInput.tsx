import React, { useState, useRef, useEffect } from "react"
import { useDispatch } from "react-redux"
import styled from "styled-components"

import { setSixDigitCode } from "../../state/store/slice/layoutSlice"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 30px;
`

const InputsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
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
  border: 1px solid ${(props) => (props.error ? "red" : "#37374f")};
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
  show: string
  validationMsgs: any
}

const CodeInput: React.FC<CodeInput> = ({ show, validationMsgs }) => {
  // console.log("show@@@", show)
  const dispatch = useDispatch()
  const [code, setCode] = useState(Array(6).fill(""))
  const [isTouched, setIsTouched] = useState(false)
  const firstInputRef = useRef(null)

  useEffect(() => {
    firstInputRef.current?.focus()
  }, [])

  const handleInputChange = (e, index) => {
    // if inputs are yet untouched set them to touched as inputs are being typed in
    if (!isTouched) {
      setIsTouched(true)
    }

    const value = e.target.value

    let updatedCode = [...code]

    if (e.nativeEvent.inputType === "deleteContentBackward") {
      updatedCode = [...code.slice(0, index - 1), "", ...code.slice(index)]
      if (index > 0) {
        document.getElementById(`input-${index - 1}`)?.focus()
      }
    } else if (/^[0-9]*$/.test(value)) {
      updatedCode = [
        ...code.slice(0, index),
        value.slice(-1),
        ...code.slice(index + 1),
      ]
      if (value && index < 5) {
        document.getElementById(`input-${index + 1}`)?.focus()
      }
    } else if (value === "") {
      updatedCode = [...code.slice(0, index), "", ...code.slice(index + 1)]
    }

    setCode(updatedCode)

    // Dispatch setSixDigitCode action with the updated code
    dispatch(setSixDigitCode(updatedCode.join("")))
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      let updatedCode = [...code]

      if (index > 0 && e.target.value === "") {
        document.getElementById(`input-${index - 1}`)?.focus()
        updatedCode = [...code.slice(0, index - 1), "", ...code.slice(index)]
      } else {
        updatedCode = [...code.slice(0, index), "", ...code.slice(index + 1)]
      }

      setCode(updatedCode)

      // Dispatch setSixDigitCode action with the updated code
      dispatch(setSixDigitCode(updatedCode.join("")))
    }
  }

  console.log("@validation code:", code)
  console.log("@validation validationMsgs:", validationMsgs)

  const isEmpty = code.every((item) => item === "")
  const isInValid =
    validationMsgs &&
    validationMsgs[0]?.text ===
      "The recovery code is invalid or has already been used. Please try again."

  return show !== "email" ? (
    <Container>
      <Title>Verification Code</Title>
      <InputsWrapper onClick={() => !isTouched && setIsTouched(true)}>
        {code.map((digit, index) => (
          <Input
            id={`input-${index}`}
            key={index}
            maxLength={1}
            value={digit}
            ref={index === 0 ? firstInputRef : null}
            onChange={(e) => handleInputChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            error={isEmpty && isTouched}
          />
        ))}
      </InputsWrapper>
      {isEmpty && isTouched && (
        <div
          style={{
            fontFamily: "Open Sans",
            fontWeight: 400,
            fontSize: "13px",
            color: "red",
          }}
        >
          Required
        </div>
      )}
      {isInValid && (
        <div
          style={{
            fontFamily: "Open Sans",
            fontWeight: 400,
            fontSize: "13px",
            color: "red",
          }}
        >
          {validationMsgs[0].text}
        </div>
      )}
    </Container>
  ) : null
}

export default CodeInput
