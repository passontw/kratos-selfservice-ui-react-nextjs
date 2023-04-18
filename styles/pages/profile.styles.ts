import { styled } from "@mui/system"

import { WHITE } from "../../constants/colors"

const StyledProfileArea = styled("div")(() => ({
  fontFamily: "Open Sans",
  marginTop: "48px",
  backgroundColor: "#272735",
  paddingLeft: "74px",
  paddingRight: "48px",
  paddingBottom: "96px",
  borderRadius: "12px",
}))

const StyledProfileDeco = styled("img")(() => ({}))

const StyledForm = styled("div")(() => ({
  display: "flex",
}))

const StyledImageUpload = styled("div")(() => ({
  borderRight: "1px solid #1F1F2A",
  paddingRight: "64px",
  paddingTop: "165px",
}))

const StyledImageTitle = styled("div")(() => ({
  marginTop: "40px",
  fontSize: "16px",
  fontWeight: 600,
  color: WHITE,
}))
const StyledImageText = styled("div")(() => ({
  marginTop: "12px",
  fontSize: "13px",
  fontWeight: 400,
  color: "#7E7E89",
}))

const StyledSideInputs = styled("div")(() => ({}))

export {
  StyledProfileArea,
  StyledImageUpload,
  StyledSideInputs,
  StyledForm,
  StyledProfileDeco,
  StyledImageTitle,
  StyledImageText,
}
