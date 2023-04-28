import Box from "@mui/material/Box"
import Image from "next/image"

import Cmodx from "../../public/images/app_icons/Cmodx"
import MasterControl, {
  MasterControlProps,
} from "../../public/images/app_icons/MasterControl"
import Stormplay from "../../public/images/app_icons/Stormplay"

import { StyledAppIcon, StyledAppItem, StyledAppTitle } from "./styles"

interface AppItemProps {
  appIcon: string
  appName: string
  mobile?: boolean
}

const AppItem: React.FC<AppItemProps> = ({ appIcon, appName, mobile }) => {
  return (
    <StyledAppItem>
      <StyledAppIcon>
        {appIcon === "Cmodx" ? (
          <Image
            src={`/images/cmodx-logo${mobile ? "-mobile" : ""}.png`}
            width="100%"
            height="100%"
          />
        ) : appIcon === "Stormplay" ? (
          <Image
            src={`/images/stormplay-logo${mobile ? "-mobile" : ""}.png`}
            width="100%"
            height="100%"
          />
        ) : appIcon === "MasterControl" ? (
          <Image
            src={`/images/master-control-logo${mobile ? "-mobile" : ""}.png`}
            width="100%"
            height="100%"
          />
        ) : (
          <Image
            src="/images/master-control-logo.png"
            width="100%"
            height="100%"
          />
        )}
      </StyledAppIcon>
      <StyledAppTitle>{appName}</StyledAppTitle>
    </StyledAppItem>
  )
}

export default AppItem
