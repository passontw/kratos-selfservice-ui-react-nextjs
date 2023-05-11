/* eslint-disable react/jsx-props-no-spreading */
import CloseIcon from "@mui/icons-material/Close"
import Box from "@mui/material/Box"
import MuiDialog from "@mui/material/Dialog"
import IconButton from "@mui/material/IconButton"
import Slide from "@mui/material/Slide"
import Zoom from "@mui/material/Zoom"
import { useTheme } from "@mui/material/styles"
import { TransitionProps } from "@mui/material/transitions"
import useMediaQuery from "@mui/material/useMediaQuery"
import { useRouter } from "next/router"
import React, {
  forwardRef,
  JSXElementConstructor,
  ReactElement,
  Ref,
} from "react"
import { useDispatch, useSelector } from "react-redux"

import MenuCloseIcon from "../../public/images/Menu/CloseIcon"
import Cmid from "../../public/images/app_icons/Cmid"
import {
  selectActiveNav,
  selectActiveStage,
  selectDialog,
  selectMfaState,
  setActiveStage,
  setDialog,
  setMfaModalOpen,
} from "../../state/store/slice/layoutSlice"
import { Navs, Stage, Icon } from "../../types/enum"

import { StyledDialogContent, StyledDialogTitle } from "./styles"

export interface DialogProps {
  title?: string
  titleHeight?: number | string
  width?: string | number
  height?: string | number
  center?: boolean
  padding?: string
  children?: any
  icon?: Icon
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<unknown, string | JSXElementConstructor<unknown>>
  },
  ref: Ref<unknown>,
) {
  return useSelector(selectDialog).center ? (
    <Zoom ref={ref} {...props} style={{ transitionDelay: "0ms" }} />
  ) : (
    <Slide direction="left" ref={ref} {...props} />
  )
})

const Dialog: React.FC<DialogProps> = ({
  title,
  titleHeight,
  width,
  height,
  center,
  padding,
  icon,
  children,
}) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const currentNav = useSelector(selectActiveNav)
  const handleClose = (event: React.SyntheticEvent, reason: string) => {
    if (currentNav === Navs.ACCOUNT) {
      window.location.reload()
    }
    // TODO: uncomment these 2 lines if you don't want the dialog to close when clicking outside of it or pressing the escape key
    if (reason === "escapeKeyDown") return
    if (reason === "backdropClick") return
    dispatch(setDialog(null))
    dispatch(setDialog(null))
  }

  const handleCloseIcon = () => {
    if (icon === Icon.MENU) return <MenuCloseIcon />

    return (
      <CloseIcon
        sx={{
          color: "#78787E",
        }}
        fontSize="small"
      />
    )
  }

  const mobileHeader = (title: string) => {
    return (
      <Box
        display="flex"
        gap="6px"
        justifyContent="center"
        alignItems="center"
        fontFamily="Teko"
        fontSize="20px"
        textTransform="uppercase"
      >
        <Box display="flex" width="31px">
          <Cmid />
        </Box>
        <div>{title}</div>
      </Box>
    )
  }

  const activeNav = useSelector(selectActiveNav)
  const activeStage = useSelector(selectActiveStage)
  const mfaState = useSelector(selectMfaState)
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <MuiDialog
      PaperProps={{
        style: {
          right: center ? "none" : 0,
          width,
          height,
          minWidth: isSmallScreen ? "90vw" : width,
          minHeight: height,
          maxWidth: height,
          backgroundColor: "#2B2B33",
          margin: "0",
          position: "absolute",
          borderRadius: "8px",
        },
      }}
      open
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      {title && (
        <StyledDialogTitle titleHeight={titleHeight}>
          <div>
            {title.includes("2-Step")
              ? `Turn ${mfaState ? "on" : "off"} 2-Step Verification`
              : title.includes("Cooler Master ID")
              ? mobileHeader(title)
              : title}
          </div>
          <IconButton
            onClick={(e) => {
              dispatch(setActiveStage(Stage.NONE))
              dispatch(setMfaModalOpen(false))
              if (activeNav === Navs.RECOVERY) {
                router.push("/login")
              }
              return handleClose(e, "click")
            }}
            sx={{
              "&:hover": {
                background: "rgba(255, 255, 255, 0.15)",
              },
            }}
          >
            {handleCloseIcon()}
          </IconButton>
        </StyledDialogTitle>
      )}
      <StyledDialogContent center={center} padding={padding}>
        {React.cloneElement(children, { onClick: handleClose })}
        {activeStage === Stage.FORGOT_PASSWORD && (
          <Box
            width="95px"
            height="44px"
            position="absolute"
            bgcolor="transparent"
            border="1px solid #C0C0C0"
            borderRadius="8px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            color="#C0C0C0"
            fontFamily="open sans"
            fontSize="16px"
            right="140px"
            mt="30px"
            sx={{
              cursor: "pointer",
            }}
            onClick={(e) => {
              if (activeStage === Stage.FORGOT_PASSWORD) {
                router.push("/login")
              }
              handleClose(e, "")
              dispatch(setActiveStage(Stage.NONE))
            }}
          >
            Cancel
          </Box>
        )}
      </StyledDialogContent>
    </MuiDialog>
  )
}

export default Dialog
