import { ReactNode } from "react"

import AccountMenu from "../../AccountMenu"

import { StyledWrapper, StyledContent } from "./styles"

interface AccountLayoutProps {
  children: ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ children }) => {
  return (
    <StyledWrapper>
      <AccountMenu />
      <StyledContent>{children}</StyledContent>
    </StyledWrapper>
  )
}

export default AccountLayout
