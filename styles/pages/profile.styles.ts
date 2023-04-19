import { styled } from "@mui/system"

import { WHITE } from "../../constants/colors"

const StyledProfileArea = styled("div")<{ paddingRight?: string }>(
  ({ paddingRight }) => ({
    fontFamily: "Open Sans",
    marginTop: "48px",
    backgroundColor: "#272735",
    paddingLeft: "74px",
    paddingRight: paddingRight ? paddingRight : "48px",
    paddingBottom: "96px",
    borderRadius: "12px",
  }),
)

const StyledProfileDeco = styled("img")(() => ({
  width: "100%",
}))

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

const StyledProfileImageWrap = styled("div")(() => ({
  position: "relative",
}))

const StyledProfileImage = styled("img")(() => ({
  width: "168px",
}))

const StyledEditButton = styled("img")(() => ({
  position: "absolute",
  bottom: 0,
  right: "-5px",
  curosor: "pointer",
}))

const StyledSideWrap = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
}))

const StyledSideInputs = styled("div")(() => ({
  padding: "48px 48px",
}))

const StyledFieldTitle = styled("div")<{ topSpacing: boolean }>(
  ({ topSpacing }) => ({
    marginTop: topSpacing ? "24px" : 0,
    fontSize: "14px",
    color: "#717197;",
    fontWeight: 400,
  }),
)

const StyledSubmitArea = styled("div")(() => ({
  marginTop: "48px",
  width: "100%",
  display: "flex",
  justifyContent: "end",
}))

const StyledBirthdayWrap = styled("div")(() => ({
  display: "flex",
  justifyContent: "space-between",
}))

const StyledSubmitButton = styled("div")(() => ({
  width: "76px",
}))

export {
  StyledProfileArea,
  StyledImageUpload,
  StyledSideInputs,
  StyledForm,
  StyledProfileDeco,
  StyledImageTitle,
  StyledImageText,
  StyledEditButton,
  StyledProfileImage,
  StyledProfileImageWrap,
  StyledSideWrap,
  StyledFieldTitle,
  StyledSubmitArea,
  StyledBirthdayWrap,
  StyledSubmitButton,
}
