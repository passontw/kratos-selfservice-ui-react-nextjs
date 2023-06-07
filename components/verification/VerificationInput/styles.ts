import { styled } from "@mui/material/styles"

export const Input = styled("input")<{ windowWidth: number }>(({ windowWidth, theme }) => ({
  width: windowWidth > 500 ? "48px" : "10vw",
  height: windowWidth > 500 ? "54px" : "12vw",
  margin: windowWidth > 500 ? "9px" : windowWidth > 375 ? "1.9vw": "1.5vw",
  borderRadius: "8px",
  backgroundColor: "#37374f",
  color: "#fff",
  textAlign: "center",
  border: "none",
  fontSize: "20px",
  outline: "none",
  // [theme.breakpoints.down("sm")]: {
  //   maxWidth: "48px",
  //   maxHeight: "54px",
  //   width: "10vw",
  //   height: "12vw",
  //   margin: "1.9vw",
  //   fontSize: "20px",
  // },
  // [theme.breakpoints.down(375)]: {
  //   margin: "1.5vw",
  // },
}))

export const Title = styled("h1")(({ theme }) => ({
  color: "#717197",
  fontSize: "13px",
  fontFamily: "open sans",
  margin: "8px 9px 0 9px",
}))

export const InputsContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}))

export const Container = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
}))

