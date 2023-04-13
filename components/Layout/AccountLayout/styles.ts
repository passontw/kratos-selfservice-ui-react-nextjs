import { styled } from "@mui/system"

import { BACKGROUND_DARK, WHITE } from "../../../constants/colors"

const StyledWrapper = styled("div")(() => ({
  display: "flex",
  backgroundColor: '#1F1F2A',
  // flexDirection: "column",
  height: "100vh",
  width: "100%",
}))

const StyledHeader = styled("div")(() => ({
  fontFamily: "teko",
  textTransform: "uppercase",
  fontWeight: 500,
  fontSize: "32px",
  color: WHITE,
  padding: "0 48px",
  paddingTop: "50px",
  display: "flex",
  justifyContent: "start",
  alignItems: "center",
  gap: "16px",
}))

const StyledImg = styled("img")(() => ({
  flexAlign: "start",
}))

const StyledContent = styled("div")(() => ({}))

export { StyledWrapper, StyledContent, StyledHeader, StyledImg }
