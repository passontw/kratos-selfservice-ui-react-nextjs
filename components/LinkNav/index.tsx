
import Link from 'next/link'
import React from 'react'
import {
    StyledNav,
    StyledLink,
    StyledLine,
  } from "../../styles/share"
import { useTranslation } from 'next-i18next'


const LinkNav = () => {
    const { t } = useTranslation()
    return (
      <StyledNav>
        <StyledLink target="_blank" href='./termsofuseagreement'>{t('terms_of_use') || 'Terms of use'}</StyledLink>
        <StyledLine />
        <StyledLink target="_blank" href='./privacypolicy'>{t('privacy_policy') || 'Privacy Policy'}</StyledLink>
      </StyledNav>
    )
}

export default LinkNav