import { styled } from "@mui/system"

import { ACTIVE_COLOR, TEXT_COLOR } from "../../constants/colors"

const StyledWrapper = styled("div")(({ theme }) => ({
  color: TEXT_COLOR,
  fontFamily: "Open Sans",
  marginTop: "95px",
  display: "flex",
  flexDirection: "column",
  fontWeight: 400,
  fontSize: "18px",
  [theme.breakpoints.down("sm")]: {
    marginTop: "0px",
    paddingTop: "60px",
    backgroundColor: "#000",
  },
}))

const StyledMenuItem = styled("div")<{ active?: boolean }>(
  ({ active, theme }) => ({
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
      [theme.breakpoints.down("sm")]: {
        width: "24px",
      },
    },
  }),
)

const StyledVercelWrapper = styled("div")<{ active?: boolean }>(
  ({ theme }) => ({
    position: "absolute",
    left: "0px",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  }),
)

const StyledLine = styled("div")<{ active?: boolean }>(() => ({
  width: "calc(100% - 40px)",
  height: "1px",
  backgroundColor: "#5C5C73",
  margin: "0px 20px",
}))

const StyledMobile = styled("div")<{}>(({ theme }) => ({
  [theme.breakpoints.up("sm")]: {
    display: "none",
  },
}))

export {
  StyledWrapper,
  StyledMenuItem,
  StyledVercelWrapper,
  StyledLine,
  StyledMobile,
}
