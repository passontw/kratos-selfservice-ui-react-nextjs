import { styled } from "@mui/system"

const StyledMainContent = styled("div")(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  flexDirection: "column",
  color: "#fff",
}))

const StyledTitle = styled("div")(() => ({
  fontFamily: "teko",
  fontSize: "48px",
  fontWeight: "500",
}))

const StyledContinueSection = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  fontWeight: 400,
  padding: "24px",
  paddingBottom: "32px",
  fontFamily: "Open Sans",
  cursor: "pointer",
  borderBottom: "1px solid var(--body, #A5A5A9)",
}))
const StyledNameEmailWrap = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
}))
const StyledAvatar = styled("div")(() => ({}))
const StyledName = styled("div")(() => ({
  fontSize: "16px",
}))
const StyledEmail = styled("div")(() => ({
  fontSize: "14px",
  color: "var(--body, #A5A5A9)",
}))
const StyledArrow = styled("div")(() => ({
  marginLeft: "32px",
}))

const StyledLoginSection = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  color: "var(--body, #A5A5A9)",
  padding: "24px",
  fontFamily: "Open Sans",
  fontSize: "14px",
  cursor: "pointer",
}))

const StyledUserIconWrap = styled("div")(() => ({
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginRight: "24px",
}))

const StyledUserIcon = styled("div")(() => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
}))

export {
  StyledUserIconWrap,
  StyledUserIcon,
  StyledMainContent,
  StyledTitle,
  StyledContinueSection,
  StyledLoginSection,
  StyledNameEmailWrap,
  StyledAvatar,
  StyledName,
  StyledEmail,
  StyledArrow,
}
