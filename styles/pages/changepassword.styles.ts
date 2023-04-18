import { styled } from "@mui/system"

const StyledChangePasswordArea = styled("div")<{ paddingRight?: string }>(
  ({ paddingRight }) => ({
    display: "flex",
    width: "100%",
    fontFamily: "Open Sans",
    marginTop: "36px",
    ">div": {
      backgroundColor: "#272735",
      padding: "32px",
      margin: "0px",
      border: "none",
      width: "100%",
    },
  }),
)

export { StyledChangePasswordArea }
