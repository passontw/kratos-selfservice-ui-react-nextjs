/* eslint-disable react/jsx-props-no-spreading */
import Box from "@mui/material/Box"
import { components } from "react-select"

import SelectTickIcon from "./SelectTickIcon"

const { Option } = components
const CustomSelectedIcon = (props: any) => {
  const { isSelected, isMulti, data } = props
  return !isMulti && isSelected ? (
    <Option {...props}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <span>{data.label}</span>
        <SelectTickIcon color="#000" />
      </Box>
    </Option>
  ) : (
    <Option {...props}>{data.label}</Option>
  )
}

export default CustomSelectedIcon
