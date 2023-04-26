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
            <StyledLink>Terms of Service</StyledLink>
            <StyledLine />
            <StyledLink>Privacy Policy</StyledLink>
        </Box>
        <StyledCopyright>
            { Copyright }
        </StyledCopyright>
    </StyledFooter>
    )
}

export default MenuFooter