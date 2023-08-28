import {
  StyledArrow,
  StyledAvatar,
  StyledContinueSection,
  StyledLoginSection,
  StyledMainContent,
  StyledName,
  StyledEmail,
  StyledNameEmailWrap,
  StyledTitle,
  StyledUserIcon,
  StyledUserIconWrap,
} from "../styles/pages/sso.styles"
import { Box } from "@mui/material"
import isEmpty from "lodash/isEmpty"
import { NextPage } from "next"
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router"
import queryString from "query-string"
import { useEffect, useState } from "react"

import LinkNav from "../components/LinkNav"
import MenuFooter from "../components/MenuFooter"
import { LogoutLink } from "../pkg"
import ory from "../pkg/sdk"
import Cmid from "../public/images/app_icons/Cmid"
import MasterCTRLLogo from "../public/images/app_icons/MasterCTRLLogo"
import ArrowRight from "../public/images/sso_icons/ArrowRight"
import UserCircle from "../public/images/sso_icons/UserCircle"
import UserIcon from "../public/images/sso_icons/UserIcon"

const { NEXT_PUBLIC_REDIRECT_URI } = process.env

const deactiveSession = (qs, router, onLogout) => {
  onLogout()
  const nextUri = isEmpty(qs) ? "/login" : `/login?${qs}`

  router.push(nextUri)
}
const Sso: NextPage = () => {
  const router = useRouter()
  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()

  const qs = queryString.stringify(router.query)
  const onLogout = LogoutLink()

  useEffect(() => {
    ory
      .toSession()
      .then(({ data }) => {
        setUser(data?.identity?.traits || {})
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
      })
  }, [])

  if (loading && isEmpty(user)) {
    return <p>載入中........</p>
  }

  if (!loading && isEmpty(user)) {
    const nextUri = isEmpty(qs) ? "/login" : `/login?${qs}`
    return <a href={nextUri}>登入</a>
  }

  return (
    <>
      <Box
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent={{ xs: "center", sm: "left" }}
        width="100%"
        gap="16px"
        zIndex={1}
        padding={{ xs: "35px 0px 0px", sm: "48px 0px 0px 48px" }}
      >
        <Box
          fontFamily="Teko"
          fontSize={{ xs: "24px", sm: "32px" }}
          color="#fff"
          lineHeight="44px"
          textTransform="uppercase"
        >
          Master ID
        </Box>
      </Box>

      <StyledMainContent>
        <StyledTitle>Continue using MasterCTRL with</StyledTitle>
        {/* complete original functionality */}

        <StyledContinueSection
          onClick={() => {
            router.push("/profile")
          }}
        >
          <StyledAvatar>
            <img src={user.avatar} />
          </StyledAvatar>

          <StyledNameEmailWrap>
            <StyledName>{user.name}</StyledName>

            <StyledEmail>{user.email}</StyledEmail>
          </StyledNameEmailWrap>

          <StyledArrow>
            <ArrowRight />
          </StyledArrow>
        </StyledContinueSection>

        <StyledLoginSection
          onClick={() => {
            deactiveSession(qs, router, onLogout)
          }}
        >
          <StyledUserIconWrap>
            <UserCircle />
            <StyledUserIcon>
              <UserIcon />
            </StyledUserIcon>
          </StyledUserIconWrap>
          Log in with a different account
        </StyledLoginSection>
      </StyledMainContent>

      <div className="resetWrapper">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          position="absolute"
        >
          <Box display="flex" gap="26px">
            <Box display="flex" alignItems="center"></Box>
          </Box>
        </Box>
      </div>

      <MenuFooter Copyright="Copyright© 2023 Cooler Master Inc. All rights reserved." />
      <LinkNav />
      <div className="background-wrapper">
        <div className="overlay-image"></div>
      </div>
    </>
  )
}

export default Sso
