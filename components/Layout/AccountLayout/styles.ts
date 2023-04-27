import { styled } from "@mui/system"

import { BACKGROUND_DARK, WHITE } from "../../../constants/colors"

const StyledWrapper = styled("div")(() => ({
  display: "flex",
  backgroundColor: "#1F1F2A",
  // flexDirection: "column",
  height: "100%",
  width: "100vw",
  minHeight: "100vh",
  overflowY: "hidden",
  "&::-webkit-scrollbar": {
    width: 5,
    height: 0,
  },
  "&::-webkit-scrollbar-track": {
    borderRadius: 4,
    backgroundColor: "#272735",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#272735",
    borderRadius: 4,
  },
}))

const StyledMenuWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "400px",
  backgroundColor: "#161622",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}))

const StyledDropdownMenu = styled("div")(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}))

const StyledHeader = styled("div")(({ theme }) => ({
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
  [theme.breakpoints.down("sm")]: {
    padding: "0px",
    gap: "6px",
  },
}))

const StyledMobieHeaderWrapper = styled("div")(({ theme }) => ({
  display: "none",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "40px",
  [theme.breakpoints.down("sm")]: {
    display: "flex",
  },
}))

const StyledImg = styled("img")(() => ({
  flexAlign: "start",
}))

const StyledContent = styled("div")(() => ({}))

const StyledContentWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  padding: "48px 48px 110px",
  width: "100%",
  minWidth: "880px",
  boxSizing: "border-box",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}))

export {
  StyledWrapper,
  StyledContent,
  StyledHeader,
  StyledImg,
  StyledMenuWrapper,
  StyledDropdownMenu,
  StyledMobieHeaderWrapper,
  StyledContentWrapper,
}
