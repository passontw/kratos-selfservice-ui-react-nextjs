/* eslint-disable react/jsx-props-no-spreading */
import CloseIcon from "@mui/icons-material/Close"
import Box from "@mui/material/Box"
import MuiDialog from "@mui/material/Dialog"
import IconButton from "@mui/material/IconButton"
import Slide from "@mui/material/Slide"
import Zoom from "@mui/material/Zoom"
import { TransitionProps } from "@mui/material/transitions"
import { useRouter } from "next/router"
import React, {
  forwardRef,
  JSXElementConstructor,
  ReactElement,
  Ref,
} from "react"
import { useDispatch, useSelector } from "react-redux"

import {
  selectActiveNav,
  selectActiveStage,
  selectDialog,
  setActiveStage,
  setDialog,
} from "../../state/store/slice/layoutSlice"
import { Navs, Stage } from "../../types/enum"

import { StyledDialogContent, StyledDialogTitle } from "./styles"

export interface DialogProps {
  title?: string
  titleHeight?: number | string
  width?: string | number
  height?: string | number
  center?: boolean
  children?: any
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
  children,
}) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const handleClose = (event: React.SyntheticEvent, reason: string) => {
    // TODO: uncomment these 2 lines if you don't want the dialog to close when clicking outside of it or pressing the escape key
    if (reason === "escapeKeyDown") return
    if (reason === "backdropClick") return
    dispatch(setDialog(null))
  }

  const activeNav = useSelector(selectActiveNav)
  const activeStage = useSelector(selectActiveStage)

  return (
    <MuiDialog
      PaperProps={{
        style: {
          right: center ? "none" : 0,
          width,
          height,
          minWidth: width,
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
          <div>{title}</div>
          <IconButton
            onClick={(e) => {
              dispatch(setActiveStage(Stage.NONE))
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
            <CloseIcon
              sx={{
                color: "#78787E",
              }}
              fontSize="small"
            />
          </IconButton>
        </StyledDialogTitle>
      )}
      <StyledDialogContent center={center}>
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
