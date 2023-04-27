/* eslint-disable react/prop-types */
import { FormControl, FormHelperText } from "@mui/material"
import Box from "@mui/material/Box"
import { useField } from "formik"
import React from "react"
import ReactSelect from "react-select"

import { SelectOption, SizeBreakPoint } from "../../../types/general"

import CustomIndicator from "./CustomIndicator"
import CustomSelectedIcon from "./CustomSelectedIcon"
import { customStyles, SelectLabel, StyledSelect } from "./styles"

interface FormikSelectProps {
  icon?: React.ReactNode
  title?: string
  label?: string
  isRequired?: boolean
  size?: SizeBreakPoint
  placeholder?: string
  style?: Record<string, string>
  isMulti?: boolean
  width?: number | string
  margin?: string
  optionValue?: string | number
  defaultValue?: SelectOption | SelectOption[]
  onChange: (option: SelectOption) => void
  options: SelectOption[]
  errorText?: string
  name: string
  onBlur: any
  disabled?: boolean
  alt?: string
  menuPlacement?: "bottom" | "top"
  keepBorder?: boolean
}

const FormikSelect: React.FC<FormikSelectProps> = ({
  icon,
  title,
  label,
  isRequired,
  size = "md",
  placeholder,
  style,
  isMulti,
  width,
  margin,
  onChange,
  optionValue,
  defaultValue,
  options,
  errorText,
  name,
  onBlur,
  disabled,
  alt,
  menuPlacement = "bottom",
  keepBorder,
}) => {
  const getValue = (options: SelectOption[], value?: string | number) => {
    return options
      ? options.find((option: SelectOption) => option.value === value)
      : undefined
  }
  const [field, meta, helpers] = useField(name)
  const error = !!meta.error && !!meta.touched
  const onSelectBlur = () => onBlur(name)

  return (
    <FormControl
      sx={{
        width: width || "100",
        margin: margin || "0",
        ...style,
      }}
    >
      <Box display="flex" justifyContent="center" flexDirection="column">
        {(title || icon) && (
          <Box
            mb="8px"
            color="#717197"
            fontSize="14px"
            display="flex"
            alignItems="center"
          >
            {icon}
            <span style={{ marginLeft: icon ? "6px" : "" }}>{title}</span>
            {isRequired && (
              <span style={{ color: "#FF3E49", marginLeft: "4px" }}>*</span>
            )}
          </Box>
        )}
        <StyledSelect
          width={width}
          label={label}
          disabled={disabled}
          keepBorder={keepBorder}
        >
          {label && <SelectLabel>{label}</SelectLabel>}
          <ReactSelect
            // defaultMenuIsOpen
            isMulti={isMulti}
            className={`size-${size}`}
            instanceId="react-select-id" // this is to resolve "Warning: Prop 'id' did not match" error
            onBlur={onSelectBlur()}
            value={getValue(options, optionValue)}
            defaultValue={defaultValue}
            onChange={(value: any) => onChange(value)}
            placeholder={placeholder}
            isDisabled={disabled}
            styles={customStyles}
            options={options}
            maxMenuHeight={300}
            menuPlacement={menuPlacement}
            aria-label={label}
            aria-invalid={error}
            aria-labelledby={alt}
            closeMenuOnSelect={!isMulti}
            openMenuOnFocus
            openMenuOnClick
            components={{
              IndicatorSeparator: () => null,
              DropdownIndicator: CustomIndicator,
            }}
          />
        </StyledSelect>
      </Box>
      <FormHelperText
        sx={{
          color: error ? "#FF3E49" : "BLACK",
          position: "absolute",
          bottom: "-25px",
          fontSize: "12px",
          margin: "0",
        }}
      >
        {error ? meta.error : errorText || ""}
      </FormHelperText>
    </FormControl>
  )
}

export default FormikSelect
