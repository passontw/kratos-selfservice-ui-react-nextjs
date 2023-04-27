/* eslint-disable react/prop-types */
import { Form, Formik } from "formik"
import React, { useEffect, useState } from "react"

import { SelectOption, SizeBreakPoint } from "../../types/general"
import FormikSelect from "../FormikFields/FormikSelect"

interface SelectProps {
  icon?: React.ReactNode
  name?: string
  title?: string
  options: SelectOption[]
  defaultValue?: SelectOption | SelectOption[]
  placeholder?: string
  disabled?: boolean
  isRequired?: boolean
  autoFocus?: boolean
  width?: string | number
  menuPlacement?: "bottom" | "top"
  size?: SizeBreakPoint
  style?: Record<string, string>
  isMulti?: boolean
  onChange: (option: SelectOption) => void
  forcedValue?: any
  alt?: string
  keepBorder?: boolean
}

const randomName = `input${Math.random().toString().substring(2)}`

const Select: React.FC<SelectProps> = ({
  icon,
  name = randomName,
  title,
  options,
  defaultValue,
  placeholder,
  disabled,
  isRequired,
  width,
  menuPlacement = "bottom",
  size = "md",
  style,
  isMulti,
  onChange,
  alt,
  forcedValue,
  keepBorder,
}) => {
  const [selectValue, setSelectValue] = useState<SelectOption | null>(null)

  useEffect(() => {
    selectValue && onChange(selectValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectValue])

  const handleSelectChange = (option: SelectOption) => {
    setSelectValue(option)
  }

  return (
    <Formik
      initialValues={{
        [name]: "",
      }}
      onSubmit={() => {}}
    >
      {({ values, setFieldValue, handleBlur }) => {
        return (
          <FormikSelect
            icon={icon}
            title={title}
            isRequired={isRequired}
            name={name}
            placeholder={placeholder}
            disabled={disabled}
            style={style}
            isMulti={isMulti}
            size={size}
            options={options}
            optionValue={(forcedValue && forcedValue.value) || values[name]}
            defaultValue={defaultValue}
            onChange={(option: SelectOption) => {
              setFieldValue(name, option.value)
              handleSelectChange(option)
            }}
            alt={alt}
            onBlur={handleBlur}
            width={width}
            menuPlacement={menuPlacement}
            keepBorder={keepBorder}
          />
        )
      }}
    </Formik>
  )
}

export default Select
