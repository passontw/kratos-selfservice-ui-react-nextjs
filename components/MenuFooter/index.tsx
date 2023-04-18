import React from 'react'
import {
    StyledCopyright,
    StyledFooter,
    StyledNav,
    StyledLink,
    StyledLine
  } from "../../styles/share"


const MenuFooter = ({Copyright}:{Copyright:string})=>{
    return (
        <StyledFooter>
        <StyledNav className="mobie">
        <StyledLink>Terms of Service</StyledLink>
        <StyledLine />
        <StyledLink>Privacy Policy</StyledLink>
        </StyledNav>
        <StyledCopyright>
            { Copyright }
        </StyledCopyright>
    </StyledFooter>
    )
}

export default MenuFooter