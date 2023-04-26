import { styled } from "@mui/system"

const StyledWrapper = styled("div")(() => ({
  display: "flex",
  backgroundColor: "#1F1F2A",
  // flexDirection: "column",
  justifyContent: "center",
  height: "100%",
  width: "100vw",
  minHeight: "100vh",
}))

const StyledContent = styled("div")(() => ({
  color: "#A5A5A9",
  fontFamily: "Open Sans",
  marginBottom: "48px",
}))

export { StyledWrapper, StyledContent }
