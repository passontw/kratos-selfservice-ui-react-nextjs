import Box from "@mui/material/Box"
import MuiDialogActions from "@mui/material/DialogActions"

import { StyledEditNameButton } from "../styles"

interface DialogActionsProps {
  onConfirm?: () => void
  onCancel?: () => void
  confirmText?: string
}

const DialogActions: React.FC<DialogActionsProps> = ({
  onCancel,
  onConfirm,
  confirmText = "Save",
}) => {
  return (
    <MuiDialogActions
      sx={{
        height: "72px",
        // position: 'absolute',
        bottom: "0px",
        right: "0px",
        paddingRight: "28px",
        width: "100%",
        borderTop: `1px solid #000`,
      }}
    >
      <Box margin="32px -14px 10px auto" width="fit-content">
        {onCancel && (
          <StyledEditNameButton
            variant="outlined"
            disableElevation
            disableRipple
            onClick={() => onCancel()}
            color="primary"
          >
            Cancel
          </StyledEditNameButton>
        )}
        {onConfirm && (
          <StyledEditNameButton
            variant="contained"
            disableElevation
            disableRipple
            onClick={() => onConfirm()}
            color="primary"
          >
            {confirmText}
          </StyledEditNameButton>
        )}
      </Box>
      {/* <Box width={252} display="flex" justifyContent="end" gap="15px">
        {onCancel && (
          // <Button
          //   mode="secondary"
          //   label="Cancel"
          //   onClick={() => onCancel()}
          //   width={120}
          // />
          <div onClick={() => onCancel()}>Cancel</div>
        )}
        {onConfirm && (
          <div onClick={() => onConfirm()}>Save</div>
          // <Button label="Save" width={120} onClick={() => onConfirm()} />
        )}
      </Box> */}
    </MuiDialogActions>
  )
}

export default DialogActions
