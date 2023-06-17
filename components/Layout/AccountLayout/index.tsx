import Box from "@mui/material/Box"
import { ReactNode } from "react"
import { useSelector, useDispatch } from "react-redux"

import DefaultAvatar from "../../../public/images/DefaultAvatar"
import Dropdown from "../../../public/images/Dropdown"
import Hambuger from "../../../public/images/Menu/Hambuger"
import Cmid from "../../../public/images/app_icons/Cmid"
import { selectActiveNav } from "../../../state/store/slice/layoutSlice"
import {
  setDialog,
  setMfaModalOpen,
} from "../../../state/store/slice/layoutSlice"
import { Navs, Icon } from "../../../types/enum"
import AccountMenu from "../../AccountMenu"
import DropdownMenu from "../../DropdownMenu"
import LinkNav from "../../LinkNav"
import MenuFooter from "../../MenuFooter"
import MfaModal from "../../account/MfaModal"

import {
  StyledWrapper,
  StyledContent,
  StyledHeader,
  StyledMenuWrapper,
  StyledDropdownMenu,
  StyledMobieHeaderWrapper,
  StyledContentWrapper,
} from "./styles"

interface AccountLayoutProps {
  children: ReactNode
  lang?: any
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ children, lang }) => {
  const activeNav = useSelector(selectActiveNav)
  const dispatch = useDispatch()

  const renderTitle = (activeNav: string) => {
    let title = ""
    switch (activeNav) {
      case Navs.PROFILE:
        title = lang?.personalInfo || "Personal Info"
        break
      case Navs.ACCOUNT:
        title = lang?.acctSettings || "Account Settings"
        break
      case Navs.EXPORT:
        title = lang?.exportUserData || "Export User Data"
        break
      case Navs.DEVICEMANAGEMENT:
        title = lang?.deviceMgmt || "Device Management"
        break
      case Navs.CHANGEPASSWORD:
        title = lang?.changePw || "Change Password"
        break
      default:
        break
    }

    return title
  }

  const handleModal = () => {
    dispatch(
      setDialog({
        title: `Master ID`,
        titleHeight: "MENU",
        width: "100vw",
        height: "100%",
        center: true,
        padding: "0px",
        icon: Icon.MENU,
        children: <AccountMenu lang={lang} />,
      }),
    )
  }

  return (
    <StyledWrapper>
      <Box display="flex" width="100%">
        <StyledMenuWrapper>
          <StyledHeader>
            <Cmid />
            <div>Master ID</div>
          </StyledHeader>
          <AccountMenu lang={lang} />
        </StyledMenuWrapper>

        <StyledContentWrapper>
          <StyledMobieHeaderWrapper>
            <StyledHeader>
              <Cmid />
              <div>Master ID</div>
            </StyledHeader>
            <Box
              sx={{
                "&:hover": {
                  cursor: "pointer",
                },
              }}
              onClick={handleModal}
            >
              <Hambuger />
            </Box>
          </StyledMobieHeaderWrapper>

          <Box display="flex" justifyContent="space-between">
            <Box
              fontFamily="Teko"
              color="#A2A1C6"
              fontSize={{
                sm: "48px",
                xs: "32px",
              }}
              display={{
                sm: "inline-block",
                xs: activeNav === Navs.PROFILE ? "none" : "inline-block",
              }}
            >
              {renderTitle(activeNav)}
            </Box>
            <StyledDropdownMenu>
              <DropdownMenu lang={lang} />
            </StyledDropdownMenu>
          </Box>
          <StyledContent>{children}</StyledContent>
          <MenuFooter Copyright="Copyright© 2023 Cooler Master Inc. All rights reserved." />
          <LinkNav />
        </StyledContentWrapper>
      </Box>
    </StyledWrapper>
  )
}

export default AccountLayout
