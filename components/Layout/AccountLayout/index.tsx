import Box from "@mui/material/Box"
import { ReactNode } from "react"
import { useSelector } from "react-redux"

import Cmid from "../../../public/images/app_icons/Cmid"
import { selectActiveNav } from "../../../state/store/slice/layoutSlice"
import { Navs } from "../../../types/enum"
import AccountMenu from "../../AccountMenu"
import LoginMenu from '../../LoginMenu'
import RegistrationMenu from '../../RegistrationMenu'

import { StyledWrapper, StyledContent, StyledHeader, StyledContentWrapper } from "./styles"

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
      default:
        break
    }

    return title
  }

  const renderSideContent = () => {
    if ( activeNav === "LOGIN" ) {
      return <LoginMenu />
    }
    if (activeNav === 'REGISTER') {
      return <RegistrationMenu />
    }
    return <AccountMenu />
  }
  return (
    <StyledWrapper>
        <Box
          display="flex"
          flexDirection="column"
          bgcolor="#161622"
        >
          <StyledHeader>
            <Cmid />
            <div>Cooler Master ID</div>
          </StyledHeader>
            {renderSideContent()}
        </Box>
        <StyledContentWrapper>
          <Box display="flex">
            <Box fontFamily="Teko" fontSize="48px" color="#A2A1C6">
              {renderTitle(activeNav)}
            </Box>
            {/* <Box>logout</Box> */}
          </Box>
          <StyledContent>{children}</StyledContent>
        </StyledContentWrapper>
    </StyledWrapper>
  )
}

export default AccountLayout
