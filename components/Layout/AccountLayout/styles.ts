import { styled } from "@mui/system"

import { BACKGROUND_DARK, WHITE } from "../../../constants/colors"

const StyledWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  minHeight: "100vh",
  backgroundColor: "#1F1F2A",
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

const StyledContentWrapper = styled("div")(({ theme }) => ({
  display: "none",
  position: "relative",
  width: "100%",
  padding: "48px 48px 0px 48px",
  [theme.breakpoints.up("sm")]: {
    display: "inline-block",
  },
}))

// new stuff

const StyledContent = styled("div")(({ theme }) => ({
  width: "100%",
}))

export {
  StyledWrapper,
  StyledContent,
  StyledHeader,
  StyledImg,
  StyledContentWrapper,
}
