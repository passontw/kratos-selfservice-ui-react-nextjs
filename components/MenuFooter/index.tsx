import { Box } from '@mui/material'
import React from 'react'
import {
    StyledCopyright,
    StyledFooter,
    StyledLink,
    StyledLine
  } from "../../styles/share"
import LanguageSelector from '../LanguageSelector'

interface MenuFooterProps {
    Copyright: string
    lang?: any
}

const MenuFooter: React.FC<MenuFooterProps> = ({Copyright, lang}) => {
    return (
        <StyledFooter>
            <Box position="absolute" bottom="50px" right="20px"><LanguageSelector /></Box>
            <Box display={{xs:'flex', sm:'none'}} alignItems='center' marginBottom="12px">
                <StyledLink target="_blank" href='./termsofuseagreement'>{lang?.termsOfUse}</StyledLink>
                <StyledLink target="_blank" href='./privacypolicy'>{lang?.privacyPolicy}</StyledLink>
            </Box>
            <StyledCopyright>{ Copyright }</StyledCopyright>
        </StyledFooter>
    )
}

export default MenuFooter