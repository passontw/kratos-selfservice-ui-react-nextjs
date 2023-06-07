import { Box } from '@mui/material'
import React from 'react'
import {
    StyledCopyright,
    StyledFooter,
    StyledLink,
    StyledLine
  } from "../../styles/share"


const MenuFooter = ({Copyright}:{Copyright:string})=>{
    return (
        <StyledFooter>
        <Box display={{xs:'flex', sm:'none'}} alignItems='center' marginBottom="12px">
        <StyledLink target="_blank" href='./termsofuseagreement'>Terms of Use</StyledLink>
            <StyledLine />
            <StyledLink target="_blank" href='./privacypolicy'>Privacy Policy</StyledLink>
        </Box>
        <StyledCopyright>
            { Copyright }
        </StyledCopyright>
    </StyledFooter>
    )
}

export default MenuFooter