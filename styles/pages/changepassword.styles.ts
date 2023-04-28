import { styled } from "@mui/system"

const StyledChangePasswordArea = styled("div")<{ marginTop?: string }>(
  ({ marginTop, theme }) => ({
    backgroundColor: "#272735",
    display: "flex",
    width: "100%",
    fontFamily: "Open Sans",
    marginTop: marginTop ?? "36px",
    flexWrap: "wrap",
    borderRadius: "12px",
    ">div": {
      backgroundColor: "transparent",
      padding: "32px",
      margin: "0px",
      border: "none",
      width: "100%",
      maxWidth: "500px",
    },
    [theme.breakpoints.down("sm")]: {
      marginTop: "24px",
    },
  }),
)
const StyledSection = styled("section")<{}>(({ theme }) => ({
  padding: "16px 32px 32px",
  [theme.breakpoints.down("sm")]: {
    padding: "16px 32px 16px",
  },
}))

const StyledAccount = styled("p")<{}>(() => ({
  color: "#717197",
  padding: "0px 0px 8px",
  margin: "0px",
}))

const StyledEmail = styled("p")<{}>(() => ({
  color: "#A5A5A9",
  padding: "0px 0px 8px",
  margin: "0px",
}))

const StyledChangePasswordDeco = styled("img")(({ theme }) => ({
  width: "100%",
  height: "16px",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}))

export {
  StyledChangePasswordArea,
  StyledSection,
  StyledAccount,
  StyledEmail,
  StyledChangePasswordDeco,
}
