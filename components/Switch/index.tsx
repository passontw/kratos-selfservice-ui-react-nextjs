import FormGroup from "@mui/material/FormGroup"
import Stack from "@mui/material/Stack"
import Switch from "@mui/material/Switch"
import { styled } from "@mui/material/styles"
import React from "react"

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#A62BC3" : "#A62BC3",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#37374F" : "#37374F",
    boxSizing: "border-box",
  },
}))

interface SwitchProps {
  checked: boolean
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const CustomizedSwitches: React.FC<SwitchProps> = ({
  checked,
  handleChange,
}) => {
  return (
    <FormGroup>
      <Stack direction="row" spacing={1} alignItems="center">
        <AntSwitch
          // defaultChecked
          inputProps={{ "aria-label": "controlled" }}
          checked={checked}
          onChange={handleChange}
        />
      </Stack>
    </FormGroup>
  )
}

export default CustomizedSwitches
