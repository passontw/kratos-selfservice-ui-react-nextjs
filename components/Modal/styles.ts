/* eslint-disable import/prefer-default-export */
import strokeImage from "../../public/images/cropImage/stroke.png"
import Box from "@mui/material/Box"
import { alpha, styled } from "@mui/system"

const WHITE = "#fff"
const BLACK = "#000"
const CHARCOAL = "#1B1B1C"
const DEEP_BLACK = "#121212"

const StyledBoxContent = styled(Box)<{ height?: string; minHeight?: string }>(
  ({ minHeight, height }) => ({
    padding: 40,
    maxHeight: "calc(90vh - 66px - 76px)", // 66: header, 76: footer
    overflowY: "auto",
    background: CHARCOAL,
    minHeight,
    height,
    "&::-webkit-scrollbar": {
      width: 8,
      height: 0,
    },
    "&::-webkit-scrollbar-track": {
      borderRadius: 4,
      backgroundColor: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#616169",
      borderRadius: 4,
    },
  }),
)

const StyledBoxFooter = styled(Box)(() => ({
  padding: "20px",
  background: CHARCOAL,
}))

const StyledCropImageContainer = styled(Box, {
  shouldForwardProp: () => true,
})<{ aspect: number; axis: "vertical" | "horizontal" }>(({ aspect, axis }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: axis === "vertical" ? "row" : "column",
  aspectRatio: `${aspect} / 1`,
  "& img": {
    maxWidth: "100%",
    maxHeight: "100%",
  },
}))

const StyledCropImageFiller = styled(Box)(() => ({
  flex: 1,
  width: "100%",
  height: "100%",
  backgroundColor: BLACK,
}))

const StyledCropImageWrapper = styled(Box, {
  shouldForwardProp: () => true,
})<{ radius: string }>(({ radius }) => ({
  display: "flex",
  justifyContent: "center",
  "& .ReactCrop__crop-selection": {
    border: 0,
    boxShadow: "none",
    overflow: "hidden",
    "&:before": {
      content: '""',
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: "transparent",
      boxShadow: `0 0 0 9999em ${alpha(BLACK, 0.5)}`,
      border: `1px solid ${alpha(WHITE, 0.5)}`,
      borderRadius: radius,
    },
    "& .ReactCrop__drag-handle": {
      display: "block",
      margin: 0,
      "&:after": {
        width: "20px",
        height: "20px",
        border: "none",
        background: `url(${strokeImage}) 0 0 / 350px`,
      },
      "&.ord-n, &.ord-s": {
        "&:after": {
          width: "28px",
          backgroundPosition: "50% 0",
          transform: "translateX(-50%)",
        },
      },
      "&.ord-s": {
        "&:after": {
          backgroundPosition: "50% 100%",
        },
      },
      "&.ord-w, &.ord-e": {
        "&:after": {
          height: "28px",
          backgroundPosition: "0 50%",
          transform: "translateY(-50%)",
        },
      },
      "&.ord-e": {
        "&:after": {
          backgroundPosition: "100% 50%",
        },
      },
      "&.ord-ne": {
        "&:after": {
          backgroundPosition: "100% 0",
        },
      },
      "&.ord-se": {
        "&:after": {
          backgroundPosition: "100% 100%",
        },
      },
      "&.ord-sw": {
        "&:after": {
          backgroundPosition: "0 100%",
        },
      },
    },
  },
}))

const StyledBox = styled(Box)(() => ({
  color: WHITE,
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  borderRadius: "8px 8px 8px 8px",
  overflow: "hidden",
  boxShadow: "0px 4px 50px rgba(0, 0, 0, 0.25)",
  outline: "none",
}))

const StyledBoxHeader = styled("div")(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontFamily: "Rubik",
  background: DEEP_BLACK,
  padding: "12px 24px",
  fontSize: "2.4rem",
  fontWeight: 600,
  fontStyle: "normal",
  letterSpacing: "1.3px",
  "& .MuiButtonBase-root": {
    background: "inherit",
    "&:hover": {
      background: "rgba(255,255,255,0.1)",
    },
  },
  "& .title": {
    maxWidth: 870,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
}))
export {
  StyledBox,
  StyledBoxHeader,
  StyledBoxContent,
  StyledBoxFooter,
  StyledCropImageWrapper,
  StyledCropImageContainer,
  StyledCropImageFiller,
}
