import Image from "next/image"

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
            src={`/images/master-control-logo-new${
              mobile ? "-mobile" : ""
            }.png`}
            width="100%"
            height="100%"
          />
        ) : (
          <Image
            src="/images/master-control-logo-new.png"
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
