import Box from "@mui/material/Box"
import { useSelector } from "react-redux"
import styled from "styled-components"

import { selectActiveNav } from "../../state/store/slice/layoutSlice"
import {
  StyledWrapper,
  StyledTagPcWrapper,
  StyledTagPc
} from "../../styles/share"
import { Navs } from "../../types/enum"
import AppItem from "../AppItem"
import LinkNav from "../LinkNav"

interface AppsListProps {}
const AppsList: React.FC<AppsListProps> = () => {
  const activeNav = useSelector(selectActiveNav)

  return (
    <>
      {activeNav !== Navs.SETTINGS &&
      activeNav !== Navs.PROFILE &&
      activeNav !== Navs.ACCOUNT && 
      activeNav !== Navs.EXPORT ?
      (
        <StyledWrapper>
          <StyledTagPc>
            <Box fontSize="30px" color="#fff">
              Access Anywhere With Cooler Master ID
            </Box>
            <Box fontSize="20px" color="#C0C0C0" mt="6px">
              One account is all you need. Start your virtual adventure.
            </Box>
            <StyledTagPcWrapper>
              <AppItem appIcon="MasterControl" appName="Master Control" />
              <AppItem appIcon="Stormplay" appName="Stormplay" />
              <AppItem appIcon="Cmodx" appName="CMODX" />
            </StyledTagPcWrapper>
          </StyledTagPc>
          <LinkNav />
        </StyledWrapper>
      ) : null}
    </>
  )
}

export default AppsList
