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
      <Box display="flex" flexDirection="column">
        <StyledHeader>Cooler Master ID</StyledHeader>
        <AccountMenu />
      </Box>
      <StyledContent>{children}</StyledContent>
    </StyledWrapper>
  )
}

export default AccountLayout
