import Backdrop from "@mui/material/Backdrop"
import Box from "@mui/material/Box"
import Fade from "@mui/material/Fade"
import Modal from "@mui/material/Modal"
import { useState, useEffect, CSSProperties } from "react"

import CloseIcon from "../../public/images/crop_icons/CloseIcon"
import EditIcon from "../../public/images/crop_icons/EditIcon"

import ButtonCircleIcon from "./ButtonCircleIcon"
import { StyledBox, StyledBoxHeader } from "./styles"

const PRIMARY_GREY = "#78787E"

interface StickyNoteModalProps {
  children: React.ReactNode
  open: boolean
  handleClose: (e?: any, reason?: string) => void
  title: string
  editable?: boolean
  editNameOpen?: boolean
  handleEditName?: (arg0: string) => void
  handleEditNameOpenClose?: () => void
  headerEndNode?: React.ReactNode
  wrapperStyles?: CSSProperties
  headerStyles?: CSSProperties
  modalStyle?: CSSProperties
}

const StickyNoteModal: React.FC<StickyNoteModalProps> = ({
  open,
  children,
  handleClose,
  title = "title",
  editNameOpen,
  handleEditName,
  handleEditNameOpenClose,
  editable,
  headerEndNode,
  wrapperStyles,
  headerStyles,
  modalStyle,
}) => {
  const [tempInputValue, setTempInputValue] = useState("") // 用來input change時顯示
  const [isEditName, setIsEditName] = useState(false)
  const [errorState, setErrorState] = useState<null | {
    error: boolean
    msg: string
  }>(null)

  const handleSetEditName = () => {
    setIsEditName(true)
  }

  const checkInputIsValid = (
    value: string,
  ): {
    error: boolean
    msg: string
  } | null => {
    let error: {
      error: boolean
      msg: string
    } | null = null

    if (value === "") {
      error = { error: true, msg: "error" }
      setErrorState(error)
      return error
    }
    if (value.length > 64) {
      error = { error: true, msg: "Exceeded character limit." }
      setErrorState(error)
      return error
    }

    setErrorState(error)
    return error
  }

  // enter or blur時才做
  const handleEditNameConfirm = (
    e:
      | React.FocusEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (
      e.type === "keyup" &&
      (e as React.KeyboardEvent<HTMLInputElement>).key !== "Enter"
    ) {
      return
    }

    if (e.target instanceof HTMLInputElement) {
      const error = checkInputIsValid(e.target.value)
      if (error) {
        e.target.focus()
        return
      }

      if (e.target.value !== title) handleEditName?.(e.target.value)
      setIsEditName(false)
    }
  }
  // 改變值時先即時暫存
  const handleEditNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    checkInputIsValid(e.target.value)
    setTempInputValue(e.target.value)
  }

  const handleClear = () => {
    checkInputIsValid("")
    setTempInputValue("")
  }

  const init = () => {
    setIsEditName(false)
    setTempInputValue(title)
    setErrorState(null)
  }

  useEffect(() => {
    setTempInputValue(title || "")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title])

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          style: { background: "rgba(0,0,0,0.8)" },
        },
      }}
      style={modalStyle}
      disableEnforceFocus
    >
      <Fade in={open}>
        <StyledBox style={wrapperStyles}>
          <StyledBoxHeader style={headerStyles}>
            <Box sx={{ display: "flex" }}>
              {editable &&
                handleEditName &&
                handleEditNameOpenClose &&
                !isEditName && (
                  <>
                    <ButtonCircleIcon
                      icon={<EditIcon color={PRIMARY_GREY} />}
                      // handleClick={handleEditNameOpenClose}
                      handleClick={handleSetEditName}
                    />

                    {/* <EditNameModal
                    title={title}
                    editNameOpen={editNameOpen}
                    handleEditName={handleEditName}
                    handleEditNameOpenClose={handleEditNameOpenClose}
                  /> */}
                  </>
                )}
            </Box>
            <Box sx={{ display: "flex", gap: "12px" }}>
              {headerEndNode && headerEndNode}
              <ButtonCircleIcon
                icon={<CloseIcon size="18px" color={PRIMARY_GREY} />}
                handleClick={(e) => {
                  init()
                  handleClose(e)
                }}
              />
            </Box>
          </StyledBoxHeader>
          {children}
        </StyledBox>
      </Fade>
    </Modal>
  )
}

export default StickyNoteModal
