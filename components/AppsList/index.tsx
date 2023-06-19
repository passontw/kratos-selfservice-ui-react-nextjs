import Box from "@mui/material/Box"
import { useSelector } from "react-redux"
import styled from "styled-components"

import { selectActiveNav } from "../../state/store/slice/layoutSlice"
import {
  StyledWrapper,
  StyledTagPcWrapper,
  StyledTagPc,
} from "../../styles/share"
import { Navs } from "../../types/enum"
import AppItem from "../AppItem"
import LinkNav from "../LinkNav"
import { useTranslation } from "next-i18next"

interface AppsListProps {}
const AppsList: React.FC<AppsListProps> = () => {
  const { t } = useTranslation()
  const activeNav = useSelector(selectActiveNav)

  return (
    <>
      {activeNav !== Navs.SETTINGS &&
      activeNav !== Navs.PROFILE &&
      activeNav !== Navs.ACCOUNT &&
      activeNav !== Navs.EXPORT &&
      activeNav !== Navs.DEVICEMANAGEMENT &&
      activeNav !== Navs.CHANGEPASSWORD ? (
        <StyledWrapper>
          <div className="background-wrapper">
            <div className="overlay-image"></div>
          </div>
          <StyledTagPc>
            <Box fontSize="30px" color="#fff">
              {t('masterid_slogan') || 'Access Anywhere With Master ID'}
            </Box>
            <Box fontSize="20px" color="#C0C0C0" mt="6px">
            {t('masterid-desc') || 'One account is all you need. Start your virtual adventure.'}
            </Box>
            <StyledTagPcWrapper>
              <AppItem appIcon="MasterControl" appName="MasterControl" />
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
