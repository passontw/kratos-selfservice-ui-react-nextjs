import { styled } from "@mui/system"

const StyledChangePasswordArea = styled("div")<{ marginTop?: string }>(
  ({ marginTop }) => ({
    backgroundColor: "#272735",
    display: "flex",
    width: "100%",
    fontFamily: "Open Sans",
    marginTop: marginTop ?? "36px",
    ">div": {
      backgroundColor: "transparent",
      padding: "32px",
      margin: "0px",
      border: "none",
      width: "500px",
    },
  }),
)

const StyledAccount = styled("div")<{}>(() => ({
  color: "#717197",
}))

const StyledEmail = styled("div")<{}>(() => ({
  color: "#A5A5A9",
}))

export { StyledChangePasswordArea, StyledAccount, StyledEmail }
