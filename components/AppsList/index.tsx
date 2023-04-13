import Box from "@mui/material/Box"
import { useSelector } from "react-redux"
import styled from "styled-components"

import { selectActiveNav } from "../../state/store/slice/layoutSlice"
import { Navs } from "../../types/enum"
import AppItem from "../AppItem"

interface AppsListProps {}
const AppsList: React.FC<AppsListProps> = () => {
  const StyledNav = styled.div`
    position: absolute;
    bottom: 20px;
    right: 20px;
  `
  const StyledLink = styled.a`
    font-family: "Open Sans";
    font-size: 14px;
    line-height: 20px;
    color: #c0c0c0;
    cursor: pointer;
  `
  const StyledLine = styled.span`
    display: inline-block;
    width: 1px;
    height: 12px;
    padding-right: 16px;
    margin-right: 16px;
    border-right: 1px solid #c0c0c0;
  `

  const activeNav = useSelector(selectActiveNav)

  return (
    <>
      {activeNav !== Navs.SETTINGS &&
      activeNav !== Navs.PROFILE &&
      activeNav !== Navs.ACCOUNT ? (
        <Box
          mt="200px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          width="61.2vw"
          fontFamily="open sans"
          position="relative"
        >
          <Box fontSize="30px" color="#fff">
            Access Anywhere With Cooler Master ID
          </Box>
          <Box fontSize="20px" color="#C0C0C0" mt="6px">
            One account is all you need. Start your virtual adventure.
          </Box>
          <Box display="flex" gap="40px" mt="48px">
            <AppItem appIcon="MasterControl" appName="Master Control" />
            <AppItem appIcon="Stormplay" appName="Stormplay" />
            <AppItem appIcon="Cmodx" appName="CMODX" />
          </Box>
          <StyledNav>
            <StyledLink>Terms of Service</StyledLink>
            <StyledLine />
            <StyledLink>Privacy Policy</StyledLink>
          </StyledNav>
        </Box>
      ) : null}
    </>
  )
}

export default AppsList
