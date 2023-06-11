
import Link from 'next/link'
import React from 'react'
import {
    StyledNav,
    StyledLink,
    StyledLine,
  } from "../../styles/share"


const LinkNav = () => {
    return (
      <StyledNav>
        <StyledLink target="_blank" href='./termsofuseagreement'>Terms of Use</StyledLink>
        <StyledLine />
        <StyledLink target="_blank" href='./privacypolicy'>Privacy Policy</StyledLink>
      </StyledNav>
    )
}

export default LinkNav