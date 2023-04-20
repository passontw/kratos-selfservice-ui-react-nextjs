import {
  FormControlLabel,
  FormHelperText,
  RadioGroup as RadioGroupMui,
} from "@mui/material"
import Radio, { RadioProps } from "@mui/material/Radio"
import React, { ReactElement } from "react"

// import { FieldMetaProps } from 'formik';
import { BpCheckedIcon, BpIcon, StyledFormGroup } from "./styles"

interface RadioGroupProps {
  value: string | number
  onChange: (event: React.ChangeEvent<HTMLInputElement>, value?: string) => void
  classNames?: {
    label?: string
    radioGroup?: string
    radio?: string
  }
  withWarning?: boolean
  label?: string | ReactElement
  className?: string
  radios: Array<{
    value: string | number
    label: string
  }>
  // meta?: FieldMetaProps<unknown>;
  placement?: "start" | "end" | "top" | "bottom"
  custom?: boolean
  color?: string
  direction?: "row" | "column"
  [key: string]: unknown
}

function BpRadio(props: RadioProps) {
  return (
    <Radio
      sx={{
        "&:hover": {
          bgcolor: "transparent",
        },
      }}
      disableRipple
      color="default"
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  )
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  withWarning = true,
  label,
  value,
  onChange,
  classNames,
  radios,
  className,
  // meta,
  placement,
  custom = false,
  color = "#FFF",
  direction = "row",
  ...restParam
}) => {
  // const displayHelperText = !!(label && meta?.touched && meta?.error)

  return (
    <StyledFormGroup direction={direction} className={className || ""}>
      {label && (
        <FormHelperText
          sx={{
            fontSize: "14px",
            color: "#FFF",
          }}
        >
          {label}{" "}
          {/* {withWarning && meta?.touched && meta?.error && (
            <span style={{ display: 'block', color: '#FF3E49' }}>{meta.error}</span>
          )} */}
        </FormHelperText>
      )}

      <RadioGroupMui
        value={value}
        onChange={onChange}
        className={
          classNames?.radioGroup
            ? `${classNames.radioGroup} ${
                restParam.disabled ? "disabledRadio" : ""
              }`
            : `${restParam.disabled ? "disabledRadio" : ""}`
        }
      >
        {radios.map((radio) => (
          <FormControlLabel
            key={radio.value}
            className={classNames?.radio ? classNames.radio : ""}
            value={radio.value}
            labelPlacement={placement}
            control={
              !custom ? (
                <Radio
                  name={(restParam.name as string) || "localRadio"}
                  size="small"
                  sx={{
                    color,
                    "&.Mui-checked": {
                      color,
                    },
                  }}
                />
              ) : (
                <BpRadio
                  name={(restParam.name as string) || "localRadio"}
                  sx={{
                    "& span:before": {
                      width: "10px",
                      height: "10px",
                      background: "#fff",
                      borderRadius: "24px",
                      margin: "auto",
                    },
                  }}
                />
              )
            }
            disabled={!!restParam.disabled || !!restParam.readOnly}
            label={radio.label}
          />
        ))}
      </RadioGroupMui>
    </StyledFormGroup>
  )
}

export default RadioGroup
