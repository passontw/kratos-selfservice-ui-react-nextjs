import { styled } from "@mui/system"

const StyledProfileArea = styled("div")(() => ({
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
}))

const StyledSideInputs = styled("div")(() => ({}))

export {
  StyledProfileArea,
  StyledImageUpload,
  StyledSideInputs,
  StyledForm,
  StyledProfileDeco,
}
