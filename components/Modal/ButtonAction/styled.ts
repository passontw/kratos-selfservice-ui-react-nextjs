import Button from "@mui/material/Button"
import { styled } from "@mui/system"

// import { DISABLED_GREY, DISBALED_BLACK } from 'shared/constants/colors';
// import Box from '@mui/material/Box';

const DISABLED_GREY = "#4B4B53"
const DISBALED_BLACK = "#1B1B1C"
const StyledButton = styled(Button)<{ background?: string }>(
  ({ theme, background = "#8E2AA7" }) => ({
    "&.MuiButtonBase-root": {
      borderRadius: "12px",
      background,
      "&.Mui-disabled": {
        background: DISABLED_GREY,
        color: DISBALED_BLACK,
        border: "none",
      },
    },
  }),
)

export default StyledButton
