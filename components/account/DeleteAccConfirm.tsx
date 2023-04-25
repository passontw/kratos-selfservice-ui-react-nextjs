import { Box } from "@mui/material"
import { useDispatch } from "react-redux"

import { setActiveStage } from "../../state/store/slice/layoutSlice"
import { Stage } from "../../types/enum"
import Text from "../Text"

interface DeleteAccConfirmProps {
  onClick?: () => void
  confirmDelete: () => void
}

const DeleteAccConfirm: React.FC<DeleteAccConfirmProps> = ({
  onClick: close,
  confirmDelete,
}) => {
  const dispatch = useDispatch()

  return (
    <Box>
      <Text my={"5px"}>
        Your account and associated data will be permanently deleted and cannot
        be restored.
      </Text>
      <Box>
        <Box
          width="95px"
          height="44px"
          color="#FFF"
          fontSize="16px"
          fontFamily="open sans"
          display="flex"
          justifyContent="center"
          alignItems="center"
          bgcolor="#F24867"
          borderRadius="8px"
          position="absolute"
          right="30px"
          mt="30px"
          sx={{
            cursor: "pointer",
          }}
          onClick={() => {
            confirmDelete()
            dispatch(setActiveStage(Stage.DELETE_ACCOUNT))
            close?.()
          }}
        >
          Delete
        </Box>
        <Box
          width="95px"
          height="42px"
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
            close?.()
          }}
        >
          Cancel
        </Box>
      </Box>
    </Box>
  )
}

export default DeleteAccConfirm
