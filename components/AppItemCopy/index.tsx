import Box from "@mui/material/Box"

import Cmodx from "../../public/images/app_icons/Cmodx"
import MasterControl from "../../public/images/app_icons/MasterControl"
import Stormplay from "../../public/images/app_icons/Stormplay"

import { StyledAppItem } from "./styles"

interface AppItemProps {
  appIcon: keyof typeof appIconMapping
  appName: string
}
interface AppIconMappingI {
  Cmodx: React.FC
  MasterControl: React.FC
  Stormplay: React.FC
}

const appIconMapping: AppIconMappingI = {
  Cmodx: Cmodx,
  MasterControl: MasterControl,
  Stormplay: Stormplay,
}

const AppItemCopy: React.FC<AppItemProps> = ({ appIcon, appName }) => {
  const IconComponent = appIconMapping[appIcon]
  return (
    <StyledAppItem>
      <Box>
        BITCH PLEASE
        <IconComponent />
      </Box>
      <Box fontSize="18px" color="#fff" mt="10px">
        {appName}
      </Box>
    </StyledAppItem>
  )
}

export default AppItemCopy
