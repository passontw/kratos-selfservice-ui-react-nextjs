import { styled } from "@mui/system"

const StyledSection = styled("div")(() => ({
  marginBottom: "32px",
}))

const StyledDiv = styled("div")(() => ({
  marginBottom: "16px",
}))

const StyledTitle = styled("div")(() => ({
  color: "#717197",
  fontSize: "18px",
  marginBottom: "32px",
}))

const StyledBold = styled("span")(() => ({
  fontWeight: "700",
}))

const StyledContent = styled("div")(({ theme }) => ({
  paddingLeft: "50px",
  [theme.breakpoints.down("sm")]: {
    paddingLeft: "20px",
  },
}))

const StyledUpperCase = styled("div")(() => ({
  textTransform: 'uppercase'
}))

export { StyledSection, StyledTitle, StyledDiv, StyledBold, StyledContent, StyledUpperCase }
