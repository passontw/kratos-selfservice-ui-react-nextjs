import Box from "@mui/material/Box"
import { ReactNode } from "react"
import { useSelector } from "react-redux"

import DefaultAvatar from "../../../public/images/DefaultAvatar"
import Dropdown from "../../../public/images/Dropdown"
import Cmid from "../../../public/images/app_icons/Cmid"
import { selectActiveNav } from "../../../state/store/slice/layoutSlice"
import { Navs } from "../../../types/enum"
import AccountMenu from "../../AccountMenu"
import DropdownMenu from "../../DropdownMenu"

import { StyledWrapper, StyledContent, StyledHeader } from "./styles"

interface AccountLayoutProps {
  children: ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ children }) => {
  const activeNav = useSelector(selectActiveNav)

  const renderTitle = (activeNav: string) => {
    let title = ""
    switch (activeNav) {
      case Navs.PROFILE:
        title = "Personal Info"
        break
      case Navs.ACCOUNT:
        title = "Account Settings"
        break
      case Navs.EXPORT: 
        title = "Export User Data"
      default:
        break
    }

    return title
  }

  return (
    <StyledWrapper>
      <Box display="flex" width="100%">
        <Box
          display="flex"
          flexDirection="column"
          width="400px"
          bgcolor="#161622"
        >
          <StyledHeader>
            <Cmid />
            <div>Cooler Master ID</div>
          </StyledHeader>
          <AccountMenu />
        </Box>
        <Box px="48px" pt="48px" width="76%" position="relative">
          <Box display="flex" justifyContent="space-between">
            <Box fontFamily="Teko" fontSize="48px" color="#A2A1C6">
              {renderTitle(activeNav)}
            </Box>
            <Box>
              <DropdownMenu />
            </Box>
          </Box>
          <StyledContent>{children}</StyledContent>
        </Box>
      </Box>
    </StyledWrapper>
  )
}

export default AccountLayout
