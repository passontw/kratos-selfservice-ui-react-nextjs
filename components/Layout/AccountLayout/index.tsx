import { ReactNode } from "react"

import AccountMenu from "../../AccountMenu"

import { StyledWrapper } from "./styles"

interface AccountLayoutProps {
  children: ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = (children: ReactNode) => {
  return (
    <StyledWrapper>
      <AccountMenu />
      {children}
    </StyledWrapper>
  )
}

export default AccountLayout
