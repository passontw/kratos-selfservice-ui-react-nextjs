import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect } from "react"

import { StyledWrapper, StyledMenuItem, StyledImg } from "./styles"

interface AccountMenuProps {}

const AccountMenu: React.FC<AccountMenuProps> = () => {
  const router = useRouter()

  const accountMenuData = [
    { name: "Personal Info", path: "/profile" },
    { name: "Account Settings", path: "/account" },
    { name: "Change Password", path: "/" },
    { name: "Service Management", path: "/" },
    { name: "Export User Data", path: "/" },
  ]
  return (
    <StyledWrapper>
      {accountMenuData.map((item) => (
        <Link key={item.name} href={item.path} passHref>
          <StyledMenuItem active={item.path === router.pathname}>
            {/* <StyledImg src="/images/app_icons/menu-start.png" /> */}
            {item.name}
          </StyledMenuItem>
        </Link>
      ))}
    </StyledWrapper>
  )
}

export default AccountMenu
