import { styled } from "@mui/system"

const StyledAppItemWrap = styled("div")(({ theme }) => ({
  // display: "none",
  fontFamily: "Open Sans",
  fontWeight: 400,
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    display: "flex",
  },
}))

const StyledAppItem = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  borderRadius: "20px",
  width: "170px",
  height: "162px",
}))

export { StyledAppItemWrap, StyledAppItem }
