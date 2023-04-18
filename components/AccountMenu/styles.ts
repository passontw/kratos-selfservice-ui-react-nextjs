import { styled } from "@mui/system"

import { ACTIVE_COLOR, TEXT_COLOR } from "../../constants/colors"

const StyledWrapper = styled("div")(() => ({
  color: TEXT_COLOR,
  fontFamily: "Open Sans",
  marginTop: "115px",
  display: "flex",
  flexDirection: "column",
  fontWeight: 400,
  fontSize: "18px",
}))

const StyledMenuItem = styled("div")<{ active?: boolean }>(({ active }) => ({
  display: "flex",
  alignItems: "center",
  padding: "19px 0",
  paddingLeft: "54px",
  ...(active && {
    color: ACTIVE_COLOR,
    background:
      "linear-gradient(90deg, rgba(202, 74, 232, 0.4) 0%, rgba(202, 74, 232, 0.2) 30.21%, rgba(202, 74, 232, 0) 99.99%, rgba(255, 255, 255, 0) 100%)",
  }),
  cursor: "pointer",
  transition: "padding-left 200ms ease-in",
  "&:hover": {
    paddingLeft: "59px",
  },
  svg: {
    paddingRight: "16px",
  },
}))

export { StyledWrapper, StyledMenuItem }
