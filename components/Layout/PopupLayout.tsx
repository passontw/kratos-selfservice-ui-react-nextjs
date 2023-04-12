import React, { ReactNode } from "react"
import { useSelector } from "react-redux"

import {
  selectDialog,
  selectDialog2,
} from "../../state/store/slice/layoutSlice"
import Dialog from "../Dialog"
import SubDialog from "../Dialog/SubDialog"

interface PopupLayoutProps {
  children: ReactNode
}

const PopupLayout: React.FC<PopupLayoutProps> = ({ children }) => {
  const dialog = useSelector(selectDialog)
  const dialog2 = useSelector(selectDialog2)
  return (
    <>
      {children}
      {dialog && (
        <Dialog
          width={dialog.width}
          height={dialog.height}
          center={dialog.center}
          title={dialog.title}
          titleHeight={dialog.titleHeight}
        >
          {dialog.children}
        </Dialog>
      )}
      {dialog2 && (
        <SubDialog
          width={dialog2.width}
          height={dialog2.height}
          center={dialog2.center}
          title={dialog2.title}
          titleHeight={dialog2.titleHeight}
        >
          {dialog2.children}
        </SubDialog>
      )}
    </>
  )
}

export default PopupLayout
