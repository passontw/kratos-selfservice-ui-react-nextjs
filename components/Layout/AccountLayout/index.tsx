import Box from "@mui/material/Box"
import { ReactNode } from "react"
import { useSelector } from "react-redux"

import Cmid from "../../../public/images/app_icons/Cmid"
import { selectActiveNav } from "../../../state/store/slice/layoutSlice"
import { Navs } from "../../../types/enum"
import AccountMenu from "../../AccountMenu"

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
      default:
        break
    }

    return title
  }

  return (
    <StyledWrapper>
      <Box display="flex">
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
        <Box px="48px" pt="48px">
          <Box display="flex">
            <Box fontFamily="Teko" fontSize="48px" color="#A2A1C6">
              {renderTitle(activeNav)}
            </Box>
            {/* <Box>logout</Box> */}
          </Box>
          <StyledContent>{children}</StyledContent>
        </Box>
      </Box>
    </StyledWrapper>
  )
}

export default AccountLayout
