import React, { useState, useRef, useEffect } from "react"
import { useDispatch } from "react-redux"
import {
  Title,
  InputsContainer,
  Container,
  Input,
} from "./styles"

import { setSixDigitCode } from "../../../state/store/slice/layoutSlice"
import { useTranslation } from "next-i18next"

const VerificationInput = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
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
      console.log('12121212121212')
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
      <Title>{t('verif_code')}</Title>
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
