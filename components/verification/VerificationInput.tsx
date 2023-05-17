import React, { useState, useRef, useEffect } from "react"
import { useDispatch } from "react-redux"
import styled from "styled-components"

import { setSixDigitCode } from "../../state/store/slice/layoutSlice"

interface InputProps {
  error?: boolean
}

const Input = styled.input<InputProps>`
  width: 48px;
  height: 54px;
  margin: 9px;
  border-radius: 8px;
  background-color: #37374f;
  color: #fff;
  text-align: center;
  border: 1px solid ${(props) => (props.error ? "red" : "#37374f")};
  font-size: 20px;
  outline: none;
`

const InputsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const Title = styled.h1`
  color: #717197;
  font-size: 13px;
  font-family: "open sans";
  margin: 8px 9px 0 9px;
`

const VerificationInput = () => {
  const dispatch = useDispatch()
  const [inputValues, setInputValues] = useState(Array(6).fill(""))
  const [isTouched, setIsTouched] = useState(false)
  const isEmpty = inputValues.every((item) => item === "")
  const inputRefs = Array(6)
    .fill()
    .map(() => useRef())

  useEffect(() => {
    inputRefs[0].current.focus()
  }, [])

  const handleChange = (index, event) => {
    // if inputs are yet untouched set them to touched as inputs are being typed in
    if (!isTouched) {
      setIsTouched(true)
    }
    if (event.target.value !== "" && !Number.isInteger(+event.target.value)) {
      return
    }

    const newInputValues = [...inputValues]
    newInputValues[index] = event.target.value

    if (event.target.nextSibling && event.target.value !== "") {
      event.target.nextSibling.focus()
    }

    setInputValues(newInputValues)
    // Dispatch setSixDigitCode action with the updated code
    dispatch(setSixDigitCode(newInputValues.join("")))
  }

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !inputValues[index]) {
      event.preventDefault()
      const newInputValues = [...inputValues]
      newInputValues[index - 1] = ""
      setInputValues(newInputValues)

      if (index > 0) {
        inputRefs[index - 1].current.focus()
      }
      // Dispatch setSixDigitCode action with the updated code
      dispatch(setSixDigitCode(newInputValues.join("")))
    }
  }

  return (
    <Container>
      <Title>Verification Code</Title>
      <InputsContainer>
        {inputValues.map((value, i) => (
          <Input
            key={i}
            ref={inputRefs[i]}
            type="tel"
            maxLength="1"
            value={value}
            onChange={(event) => handleChange(i, event)}
            onKeyDown={(event) => handleKeyDown(i, event)}
            error={isEmpty && isTouched}
          />
        ))}
      </InputsContainer>
    </Container>
  )
}

export default VerificationInput
