import { styled } from "@mui/system"

const StyledProfileArea = styled("div")<{ paddingRight?: string }>(
  ({ paddingRight }) => ({
    fontFamily: "Open Sans",
    backgroundColor: "#272735",
  }),
)

export { StyledProfileArea }
