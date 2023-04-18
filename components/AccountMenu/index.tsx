import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect } from "react"

import { StyledWrapper, StyledMenuItem, StyledVercelWrapper, StyledImg } from "./styles"
import User from "../../public/images/Menu/User"
import Tool from '../../public/images/Menu/Tool'
import ServiceManagement from '../../public/images/Menu/ServiceManagement'
import Export from '../../public/images/Menu/Export'
import Lock from '../../public/images/Menu/Lock'
import Vercel from '../../public/images/Menu/Vector'

interface AccountMenuProps {}

const AccountMenu: React.FC<AccountMenuProps> = () => {
  const router = useRouter()

  const accountMenuData = [
    { name: "Personal Info", path: "/profile", icon: "User" },
    { name: "Account Settings", path: "/account", icon: "Tool" },
    { name: "Change Password", path: "/changepassword", icon: "Lock" },
    { name: "Service Management", path: "/", icon: "ServiceManagement" },
    { name: "Export User Data", path: "/export", icon: "Export" },
  ]

  const Component = ({name, active, icon}: {name: string, active: boolean, icon: string}) => {
    const color = active ? "#CA4AE8" : "#FFFFFF"
    const appIconMapping = {
      User: User,
      Tool: Tool,
      Lock: Lock,
      ServiceManagement: ServiceManagement,
      Export: Export
    }
    const IconComponent = appIconMapping[icon]
    return (
      <>
        {active &&  (
          <StyledVercelWrapper>
            <Vercel color={color} />
          </StyledVercelWrapper>)}
        <IconComponent color={color}/>
        {name}
      </>
    )
  }
  return (
    <StyledWrapper>
      {accountMenuData.map((item) => (
        <Link key={item.name} href={item.path} passHref>
          <StyledMenuItem active={item.path === router.pathname}>
            <Component name={item.name} active={item.path === router.pathname} icon={item.icon} />
          </StyledMenuItem>
        </Link>
      ))}
    </StyledWrapper>
  )
}

export default AccountMenu
