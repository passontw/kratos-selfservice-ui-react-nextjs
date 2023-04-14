import Box from "@mui/material/Box"
import AppItem from "../AppItem"
import { StyledWrapper, StyledNav, StyledLink, StyledLine } from '../../styles/share'
import { useSelector } from "react-redux"
import styled from "styled-components"

import { selectActiveNav } from "../../state/store/slice/layoutSlice"
import { Navs } from "../../types/enum"


interface AppsListProps {}
const AppsList: React.FC<AppsListProps> = () => {

  const activeNav = useSelector(selectActiveNav)

  return (
    <>
      {activeNav !== Navs.SETTINGS &&
      activeNav !== Navs.PROFILE &&
      activeNav !== Navs.ACCOUNT ? (
        <StyledWrapper>
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
        </StyledWrapper>

      ) : null}
    </>
  )
}

export default AppsList
