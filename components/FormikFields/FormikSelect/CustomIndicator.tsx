/* eslint-disable react/jsx-props-no-spreading */
import { components } from "react-select"

import DropdownIndicatorIcon from "./DropdownIndicatorIcon"

const { DropdownIndicator } = components
const CustomIndicator = (props: any) => {
  return (
    <DropdownIndicator {...props}>
      <DropdownIndicatorIcon />
    </DropdownIndicator>
  )
}

export default CustomIndicator
