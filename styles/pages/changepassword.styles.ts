import { styled } from "@mui/system"

const StyledProfileArea = styled("div")<{ paddingRight?: string }>(
  ({ paddingRight }) => ({
    fontFamily: "Open Sans",
    ">div": {
      backgroundColor: "#272735",
      padding: "32px",
      margin: "32px auto auto",
      border: "none",
      width: "100%",
    },
  }),
)

export { StyledProfileArea }
