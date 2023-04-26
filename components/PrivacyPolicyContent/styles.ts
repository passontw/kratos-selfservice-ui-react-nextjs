import { styled } from "@mui/system"

const StyledSection = styled("div")(() => ({
  marginBottom: "32px",
}))

const StyledDiv = styled("div")(() => ({
  marginBottom: "16px",
}))

const StyledTitle = styled("div")(() => ({
  color: '#717197',
  fontSize: '18px',
  marginBottom: '32px'
}))

export { StyledSection, StyledTitle, StyledDiv }
