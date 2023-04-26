import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect } from "react"

import { LogoutLink } from "../../pkg"

import Export from "../../public/images/Menu/Export"
import Lock from "../../public/images/Menu/Lock"
import ServiceManagement from "../../public/images/Menu/ServiceManagement"
import Tool from "../../public/images/Menu/Tool"
import User from "../../public/images/Menu/User"
import Vercel from "../../public/images/Menu/Vector"
import LogOut from "../../public/images/Menu/LogOut"

import {
  StyledWrapper,
  StyledMenuItem,
  StyledVercelWrapper,
  StyledLine,
  StyledMobile
} from "./styles"
import { useDispatch } from 'react-redux'
import { setDialog } from '../../state/store/slice/layoutSlice'
import { Box } from '@mui/material'

interface AccountMenuProps {}

const AccountMenu: React.FC<AccountMenuProps> = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const onLogout = LogoutLink()

  const accountMenuData = [
    { name: "Personal Info", path: "/profile", icon: "User" },
    { name: "Account Settings", path: "/account", icon: "Tool" },
    { name: "Change Password", path: "/changepassword", icon: "Lock" },
    {
      name: "Device Management",
      path: "/devicemanagement",
      icon: "ServiceManagement",
    },
    { name: "Export User Data", path: "/export", icon: "Export" },
  ]

  const Component = ({
    name,
    active,
    icon,
  }: {
    name: string
    active: boolean
    icon: string
  }) => {
    const color = active ? "#CA4AE8" : "#FFFFFF"
    const appIconMapping = {
      User: User,
      Tool: Tool,
      Lock: Lock,
      ServiceManagement: ServiceManagement,
      Export: Export,
      LogOut: LogOut
    }
    const IconComponent = appIconMapping[icon]
    return (
      <>
        {active && (
          <StyledVercelWrapper>
            <Vercel color={color} />
          </StyledVercelWrapper>
        )}
        <IconComponent color={color} />
        {name}
      </>
    )
  }
  return (
    <StyledWrapper>
      {accountMenuData.map((item, index) => (
        <Box key={`account-menu-${index}`} onClick={()=> {
          dispatch(setDialog(null))
        }}>
        <Link key={item.name} href={item.path} passHref>
          <StyledMenuItem active={item.path === router.pathname}>
            <Component
              name={item.name}
              active={item.path === router.pathname}
              icon={item.icon}
            />
          </StyledMenuItem>
        </Link>          
        </Box>

      ))}
      
      <StyledMobile>
        <StyledLine />
        <StyledMenuItem onClick={onLogout}>
          <LogOut />
          Log out
        </StyledMenuItem>
      </StyledMobile>
    </StyledWrapper>
  )
}

export default AccountMenu
