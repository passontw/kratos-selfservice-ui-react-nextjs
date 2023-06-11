import { Box, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

// responsive wrapper
export const StyledWrapper = styled("div")(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    padding: "20px",
  },
}))

// success
export const StyleSucess = {
  background: "#1B2B30",
  border: "1px solid #4AE8AF",
}

export const StyleError = {
  background: "#2C1B29",
  border: "1px solid #F24867",
}

export const StyledStatus = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "transparent",
  borderRadius: "12px",
  width: 40,
  height: 40,
  marginRight: "12px",
}))

export const StyledMessage = styled(Typography)(({ theme }) => ({
  fontSize: "14px", // anchornav width 228 + gap 12
  color: "#FFF",
  fontWeight: 600,
  borderRadius: "8px",
}))
