import { styled } from "@mui/system"

const CmidHeadWrap = styled("div")(({ theme }) => ({
  display: "flex",
  width: "100%",
  fontFamily: "Teko",
  color: "#fff",
  fontSize: "40px",
  gap: "16px",
  [theme.breakpoints.down("sm")]: {
    justifyContent: "center",
  },
}))

export { CmidHeadWrap }
