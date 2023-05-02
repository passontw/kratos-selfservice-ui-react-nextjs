import Box from "@mui/material/Box"

import Phone from "../../public/images/device_icons/Phone"
import Tablet from "../../public/images/device_icons/Tablet"
import Desktop from "../../public/images/device_icons/desktop"
import { formatDate } from "../../util/formatter"
import Text from "../Text"

interface DeviceCardProps {
  device?: string
  location?: string
  browser?: string
  lastLogin?: string
}

const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  location,
  browser,
  lastLogin,
}) => {
  return (
    <Box
      minWidth="335px"
      p="24px"
      bgcolor="#272735"
      borderRadius="12px"
      display="flex"
      flexDirection="column"
      fontFamily="open sans"
      gap="14px"
    >
      <Box display="flex" gap="9px" alignItems="center">
        {device?.toLowerCase().includes("phone") ? (
          <Phone />
        ) : device?.toLowerCase().includes("pad") ? (
          <Tablet />
        ) : (
          <Desktop />
        )}
        <Text color="#FFF" size="20px" lineHeight="26px">
          {device ? device : "Unknown"}
        </Text>
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
