import { styled } from "@mui/system"

import { BACKGROUND_DARK, WHITE } from "../../../constants/colors"

const StyledWrapper = styled("div")(() => ({
  display: "flex",
<<<<<<< HEAD
  backgroundColor: '#1F1F2A',
=======
  minHeight: "100vh",
  backgroundColor: "#1F1F2A",
>>>>>>> 459f4ee17591ea974e0fd150ccf82774c8e156ee
  // flexDirection: "column",
  height: "100vh",
  width: "100%",
}))

const StyledHeader = styled("div")(() => ({
  fontFamily: "teko",
  textTransform: "uppercase",
  fontWeight: 500,
  fontSize: "32px",
  color: WHITE,
  padding: "0 48px",
  paddingTop: "50px",
  display: "flex",
  justifyContent: "start",
  alignItems: "center",
  gap: "16px",
}))

const StyledImg = styled("img")(() => ({
  flexAlign: "start",
}))

const StyledContent = styled("div")(() => ({}))

<<<<<<< HEAD
export { StyledWrapper, StyledContent, StyledHeader, StyledImg }
=======
// new stuff

const StyledContent = styled("div")(({ theme }) => ({
  width: "100%",
}))

export {
  StyledWrapper,
  StyledContent,
  StyledHeader,
  StyledImg,
  StyledContentWrapper,
}
>>>>>>> 459f4ee17591ea974e0fd150ccf82774c8e156ee
