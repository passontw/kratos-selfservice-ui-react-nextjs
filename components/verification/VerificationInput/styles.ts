import { styled } from "@mui/material/styles"

export const Input = styled("input")<{ windowWidth: number }>(({ windowWidth, theme }) => ({
  width: "100%",
  height: "100%",
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
  margin: "8px 9px 0 0",
}))

export const InputsContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "8px",
  height: "56px",
  gap: "15px",
}))

export const Container = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
}))

