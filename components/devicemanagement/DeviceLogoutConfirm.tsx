import { Box } from "@mui/material"
import { useDispatch } from "react-redux"

import { setActiveStage } from "../../state/store/slice/layoutSlice"
import { Stage } from "../../types/enum"
import Text from "../Text"

interface DeviceLogoutConfirmProps {
  onClick?: () => void
  confirmLogout?: () => void
}

const DeviceLogoutConfirm: React.FC<DeviceLogoutConfirmProps> = ({
  onClick: close,
  confirmLogout,
}) => {
  return (
    <Box>
      <Text my={"5px"}>
        This will remove access to your CMID account from the device.
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
          bgcolor="#A62BC3"
          borderRadius="8px"
          position="absolute"
          right="30px"
          mt="25px"
          sx={{
            cursor: "pointer",
            "&:hover": {
              filter: "brightness(0.9)",
            },
          }}
          onClick={() => {
            confirmLogout?.()
            close?.()
          }}
        >
          Log out
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
          mt="25px"
          sx={{
            cursor: "pointer",
            "&:hover": {
              filter: "brightness(0.9)",
            },
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

export default DeviceLogoutConfirm
