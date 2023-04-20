import React from 'react'
import {
    StyledNav,
    StyledLink,
    StyledLine,
  } from "../../styles/share"


const LinkNav = () => {
    return (
      <StyledNav>
        <StyledLink>Terms of Service</StyledLink>
        <StyledLine />
        <StyledLink>Privacy Policy</StyledLink>
      </StyledNav>
    )
}

export default LinkNav