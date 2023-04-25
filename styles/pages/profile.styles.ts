import { styled } from "@mui/system"

import { WHITE } from "../../constants/colors"

const StyledProfileArea = styled("div")<{ paddingRight?: string }>(
  ({ theme, paddingRight }) => ({
    fontFamily: "Open Sans",
    marginTop: "48px",
    backgroundColor: "#272735",
    paddingLeft: "74px",
    paddingRight: paddingRight ? paddingRight : "48px",
    borderRadius: "12px",
    minHeight: "602px",
    [theme.breakpoints.down("sm")]: {
      paddingLeft: "0px",
    },
  }),
)

const StyledProfileDeco = styled("img")(({ theme }) => ({
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}))

const StyledForm = styled("div")(({ theme }) => ({
  display: "flex",
  [theme.breakpoints.down("sm")]: {
    flexFlow: "wrap",
    width: "100%",
    justifyContent: "center",
  },
}))

const StyledImageUpload = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderRight: "1px solid #1F1F2A",
  paddingRight: "64px",
  paddingTop: "165px",
  [theme.breakpoints.down("sm")]: {
    paddingRight: "0px",
    paddingTop: "48px",
  },
}))

const StyledImageTitle = styled("div")(() => ({
  textAlign: "center",
  marginTop: "40px",
  fontSize: "16px",
  fontWeight: 600,
  color: WHITE,
}))

const StyledImageText = styled("div")(() => ({
  textAlign: "center",
  marginTop: "12px",
  fontSize: "13px",
  fontWeight: 400,
  color: "#7E7E89",
}))

const StyledProfileImageWrap = styled("div")(({ theme }) => ({
  position: "relative",
  width: "168px",
  [theme.breakpoints.down("sm")]: {
    margin: "auto",
    width: "100px",
  },
}))

const StyledProfileImage = styled("img")(() => ({
  width: "100%",
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

const StyledSideInputs = styled("div")(({ theme }) => ({
  padding: "48px",
  paddingBottom: "0px",
  [theme.breakpoints.down("sm")]: {
    padding: "24px 20px",
  },
}))

const StyledFieldTitle = styled("div")<{ topSpacing?: boolean }>(
  ({ topSpacing }) => ({
    marginTop: topSpacing ? "24px" : 0,
    fontSize: "14px",
    color: "#717197;",
    fontWeight: 400,
  }),
)

const StyledSubmitArea = styled("div")(() => ({
  marginTop: "38px",
  width: "100%",
  display: "flex",
  justifyContent: "end",
}))

const StyledBirthdayWrap = styled("div")(() => ({
  display: "flex",
  justifyContent: "space-between",
}))

const StyledSubmitButton = styled("div")(({ theme }) => ({
  width: "76px",
  marginBottom: "84px",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}))

const StyledFieldSpacer = styled("div")(() => ({
  marginTop: "25px",
}))

const StyledBirthdayYear = styled("div")(() => ({
  width: "100%",
  marginRight: "24px",
}))

const StyledBirthdayMonth = styled("div")(() => ({
  width: "100%",
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
  StyledFieldSpacer,
  StyledBirthdayYear,
  StyledBirthdayMonth,
}
