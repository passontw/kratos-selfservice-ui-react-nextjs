import Box from "@mui/material/Box"
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
      <Box display="flex">
        <AccountMenu />
        <StyledContent>{children}</StyledContent>
      </Box>
    </StyledWrapper>
  )
}

export default AccountLayout
