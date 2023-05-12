import Box from "@mui/material/Box"
import { useDispatch } from "react-redux"

import Desktop from "../../public/images/device_icons/Desktop"
import Phone from "../../public/images/device_icons/Phone"
import Tablet from "../../public/images/device_icons/Tablet"
import { setDialog } from "../../state/store/slice/layoutSlice"
import { formatDate } from "../../util/formatter"
import Text from "../Text"

import DeviceLogoutConfirm from "./DeviceLogoutConfirm"

interface DeviceCardProps {
  device?: string
  deviceType?: string
  location?: string
  browser?: string
  lastLogin?: string
  isCurrent?: boolean
  onLogout?: () => void
}

const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  deviceType,
  location,
  browser,
  lastLogin,
  isCurrent = false,
  onLogout,
}) => {
  const dispatch = useDispatch()

  const handleOpenLogoutModal = () => {
    dispatch(
      setDialog({
        title: "Log out on this device",
        titleHeight: "56px",
        width: 480,
        height: 218,
        center: true,
        children: <DeviceLogoutConfirm confirmLogout={onLogout} />,
      }),
    )
  }

  return (
    <Box
      minWidth="287px"
      p="24px"
      bgcolor="#272735"
      borderRadius="12px"
      display="flex"
      flexDirection="column"
      fontFamily="open sans"
      gap="14px"
    >
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" gap="9px" alignItems="center">
          {deviceType === "mobile" ||
          device?.toLowerCase().includes("phone") ? (
            <Phone />
          ) : device?.toLowerCase().includes("pad") ? (
            <Tablet />
          ) : (
            <Desktop />
          )}
          <Text color="#FFF" size="20px" lineHeight="26px">
            {device
              ? device?.toLowerCase() === "macintosh"
                ? "Mac OS"
                : device
              : "Unknown"}
          </Text>
        </Box>
        {!isCurrent && (
          <Box
            onClick={handleOpenLogoutModal}
            color="#CA4AE8"
            sx={{
              cursor: "pointer",
              "&:hover": {
                filter: "brightness(0.8)",
              },
            }}
          >
            Log out
          </Box>
        )}
      </Box>
      <Text size="16px" lineHeight="24px">
        {lastLogin && `${formatDate(lastLogin)} | ${location}`}
      </Text>
      <Text size="16px" lineHeight="20px">
        {browser === "Chrome" ? "Google Chrome" : browser}
      </Text>
    </Box>
  )
}

export default DeviceCard
