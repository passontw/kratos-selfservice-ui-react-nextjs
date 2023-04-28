import { styled } from "@mui/system"

const StyledAppItemWrap = styled("div")(({ theme }) => ({
  position: "absolute",
  left: "9999px",
  fontFamily: "Open Sans",
  fontWeight: 400,
  width: "100%",
  gap: "20px",
  margin: "10px",
  marginTop: "60px",
  overflow: "scroll",
  "&::-webkit-scrollbar": {
    display: "none",
  },
  [theme.breakpoints.down("sm")]: {
    position: "unset",
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
  [theme.breakpoints.down("sm")]: {
    borderRadius: "30px",
    flexDirection: "row",
    width: "182px",
    height: "100%",
    padding: "12px 16px",
    marginBottom: "33px",
  },
}))

const StyledAppIcon = styled("div")(({ theme }) => ({
  width: "80px",
  [theme.breakpoints.down("sm")]: {
    width: "34px",
    height: "34px",
  },
}))

const StyledAppTitle = styled("div")(({ theme }) => ({
  fontSize: "18px",
  color: "#fff",
  marginTop: "10px",
  [theme.breakpoints.down("sm")]: {
    marginTop: 0,
    marginLeft: "5px",
    whiteSpace: "nowrap",
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "20px",
  },
}))

export { StyledAppItemWrap, StyledAppItem, StyledAppIcon, StyledAppTitle }
