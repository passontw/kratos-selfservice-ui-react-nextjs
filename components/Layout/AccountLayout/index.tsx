import { ReactNode } from "react"

import AccountMenu from "../../AccountMenu"

import { StyledWrapper, StyledContent, StyledHeader } from "./styles"

interface AccountLayoutProps {
  children: ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ children }) => {
  return (
    <StyledWrapper>
      <StyledHeader>Cooler Master ID</StyledHeader>
      <AccountMenu />
      <StyledContent>{children}</StyledContent>
    </StyledWrapper>
  )
}

export default AccountLayout
