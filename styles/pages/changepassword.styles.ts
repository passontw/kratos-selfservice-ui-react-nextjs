import { styled } from "@mui/system"

const StyledChangePasswordArea = styled("div")<{ marginTop?: string }>(
  ({ marginTop }) => ({
    backgroundColor: "#272735",
    display: "flex",
    width: "100%",
    fontFamily: "Open Sans",
    marginTop: marginTop ?? "36px",
    flexWrap: "wrap",
    ">div": {
      backgroundColor: "transparent",
      padding: "32px",
      margin: "0px",
      border: "none",
      width: "500px",
    },
  }),
)

const StyledAccount = styled("p")<{}>(() => ({
  color: "#717197",
  padding: "8px 0px",
  margin: "0px",
}))

const StyledEmail = styled("p")<{}>(() => ({
  color: "#A5A5A9",
  padding: "8px 0px",
  margin: "0px",
}))

const StyledChangePasswordDeco = styled("img")(() => ({}))

export {
  StyledChangePasswordArea,
  StyledAccount,
  StyledEmail,
  StyledChangePasswordDeco,
}
