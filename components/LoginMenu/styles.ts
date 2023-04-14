import { styled } from "@mui/system"

const StyledWrapper = styled("div")(({ theme }) => ({
  padding: "0px 20px",
  width: "100vw",
  [theme.breakpoints.up("sm")]: {
    padding: "0px 80px",
    width: "400px",
  },
}))

export { StyledWrapper }
