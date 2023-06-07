import { styled } from "@mui/material/styles"

export const Input = styled("input")(({ theme }) => ({
  width: "48px",
  height: "54px",
  margin: "9px",
  borderRadius: "8px",
  backgroundColor: "#37374f",
  color: "#fff",
  textAlign: "center",
  border: "none",
  fontSize: "20px",
  outline: "none",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "48px",
    maxHeight: "54px",
    width: "10vw",
    height: "12vw",
    margin: "1.9vw",
    fontSize: "20px",
  },
  [theme.breakpoints.down(375)]: {
    margin: "1.5vw",
  },
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

