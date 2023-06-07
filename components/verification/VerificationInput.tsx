import React, { useState, useRef, useEffect } from "react"
import { useDispatch } from "react-redux"
import styled from "styled-components"

import { setSixDigitCode } from "../../state/store/slice/layoutSlice"

const Input = styled.input`
  width: 48px;
  height: 54px;
  margin: 9px;
  border-radius: 8px;
  background-color: #37374f;
  color: #fff;
  text-align: center;
  border: none;
  font-size: 20px;
  outline: none;

  @media (max-width: 600px) {
    max-width: 48px;
    max-height: 54px;
    width: 10vw;
    height: 12vw;
    margin: 1.9vw;
    font-size: 20px;
  }

  @media (max-width: 375px) {
    margin: 1.5vw;
  }
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
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()]

  useEffect(() => {
    inputRefs[0].current.focus()
  }, [])

  const handleChange = (index, event) => {
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
          />
        ))}
      </InputsContainer>
    </Container>
  )
}

export default VerificationInput
