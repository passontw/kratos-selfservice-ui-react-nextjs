import { Box } from "@mui/material"
import Text from "../Text"

interface DeleteAccConfirmProps {
  onClick?: () => void
  confirmDelete: () => void
}

const DeleteAccConfirm: React.FC<DeleteAccConfirmProps> = ({
  onClick: close,
  confirmDelete,
}) => {

  return (
    <Box>
      <Text my={"5px"}>
        Your account and associated data will be permanently deleted and cannot
        be restored.
      </Text>
      <Box display="flex" gap="14px" flexDirection="row-reverse">
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
          right="30px"
          mt="25px"
          sx={{
            cursor: "pointer",
            "&:hover": {
              filter: "brightness(0.9)",
            },
          }}
          onClick={confirmDelete}
        >
          Delete
        </Box>
        <Box
          width="95px"
          height="42px"
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
          mt="25px"
          sx={{
            cursor: "pointer",
            "&:hover": {
              filter: "brightness(0.9)",
            },
          }}
          onClick={(e) => {
            close?.()
            window.location.reload()
          }}
        >
          Cancel
        </Box>
      </Box>
    </Box>
  )
}

export default DeleteAccConfirm
