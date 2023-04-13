import { DialogProps } from "."
import CloseIcon from "@mui/icons-material/Close"
import MuiDialog from "@mui/material/Dialog"
import IconButton from "@mui/material/IconButton"
import Zoom from "@mui/material/Zoom"
import { TransitionProps } from "@mui/material/transitions"
import React, {
  forwardRef,
  JSXElementConstructor,
  ReactElement,
  Ref,
} from "react"
import { useDispatch } from "react-redux"

import { setDialog } from "../../state/store/slice/layoutSlice"

import { StyledDialogContent, StyledDialogTitle } from "./styles"

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<unknown, string | JSXElementConstructor<unknown>>
  },
  ref: Ref<unknown>,
) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Zoom ref={ref} {...props} style={{ transitionDelay: "0ms" }} />
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
  const handleClose = (event: React.SyntheticEvent, reason: string) => {
    // TODO: uncomment these 2 lines if you don't want the dialog to close when clicking outside of it or pressing the escape key
    // if (reason === 'escapeKeyDown') return;
    // if (reason === 'backdropClick') return;
    dispatch(setDialog(null))
  }

  return (
    <MuiDialog
      PaperProps={{
        style: {
          right: center ? "none" : 0,
          width,
          height,
          minWidth: width,
          minHeight: height,
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
          <IconButton onClick={(e) => handleClose(e, "click")}>
            <CloseIcon style={{ color: "#fff" }} fontSize="small" />
          </IconButton>
        </StyledDialogTitle>
      )}
      <StyledDialogContent center={center}>
        {React.cloneElement(children, { onClick: handleClose })}
      </StyledDialogContent>
    </MuiDialog>
  )
}

export default Dialog
