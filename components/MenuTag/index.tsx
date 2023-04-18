import React from 'react'
import CmidMobile from "../../public/images/app_icons/CmidMobile"
import MasterControlMobile from "../../public/images/app_icons/MasterControlMobile"
import {
    StyledTags,
    StyledTagWrapper,
  } from "../../styles/share"


const MenuTag = () => {
    return (
        <StyledTagWrapper>
        <StyledTags>
          <MasterControlMobile />
          Master Control
        </StyledTags>
        <StyledTags>
          <CmidMobile />
          Stormplay
        </StyledTags>
        <StyledTags>
          <MasterControlMobile />
          Master Control
        </StyledTags>
      </StyledTagWrapper>
    )
}

export default MenuTag