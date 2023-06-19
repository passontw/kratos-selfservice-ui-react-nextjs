import { Box } from '@mui/material'
import React from 'react'
import {
    StyledCopyright,
    StyledFooter,
    StyledLink,
    StyledLine
  } from "../../styles/share"
import LanguageSelector from '../LanguageSelector'
import { useTranslation } from 'next-i18next'

interface MenuFooterProps {
    Copyright: string
}

const MenuFooter: React.FC<MenuFooterProps> = ({Copyright}) => {
    const { t } = useTranslation()
    return (
        <StyledFooter>
            <Box position="absolute" bottom="50px" right="20px"><LanguageSelector /></Box>
            <Box display={{xs:'flex', sm:'none'}} alignItems='center' marginBottom="12px">
                <StyledLink target="_blank" href='./termsofuseagreement'>{t('terms_of_use') || 'Terms of use'}</StyledLink>
                <StyledLink target="_blank" href='./privacypolicy'>{t('privacy_policy') || 'Privacy Policy'}</StyledLink>
            </Box>
            <StyledCopyright>{ Copyright }</StyledCopyright>
        </StyledFooter>
    )
}

export default MenuFooter