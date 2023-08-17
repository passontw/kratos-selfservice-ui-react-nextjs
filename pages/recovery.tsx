import Box from "@mui/material/Box"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import styled from "styled-components"
import CmidHead from "../components/CmidHead"
import MenuFooter from "../components/MenuFooter"
import RecoveryProcess from "../components/changepassword/RecoveryProcess"
import Apple from "../public/images/login_icons/Apple"
import Google from "../public/images/login_icons/Google"
import {
  setActiveNav,
  setDialog,
} from "../state/store/slice/layoutSlice"
import { StyledMenuWrapper } from "../styles/share"
import { Navs } from "../types/enum"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import LinkNav from '../components/LinkNav'
import Head from 'next/head'

const Recovery: NextPage = (props) => {
  const { lang } = props
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setActiveNav(Navs.RECOVERY))
    dispatch(
      setDialog({
        title: " ",
        titleHeight: "58px",
        width: 480,
        center: true,
        children: <RecoveryProcess lang={lang} />,
      }),
    )

    const handleRouteChange = (url) => {
      console.log("🚀 ~ file: recovery.tsx:39 ~ handleRouteChange ~ url:", url)
    }
    
    router.events.on('routeChangeStart', handleRouteChange)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [])
  // Get ?flow=... from the URL
  const router = useRouter()

  const StyledLine = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    .text {
      position: relative;
      display: flex;
      justify-content: center;
      width: 100%;

      &:after {
        position: absolute;
        content: "";
        height: 2px;
        background-color: #a5a5a9;
        width: calc(50% - 92px - 12px);
        top: 50%;
        right: 0px;
        margin-left: 12px;
      }

      &:before {
        position: absolute;
        content: "";
        height: 2px;
        background-color: #a5a5a9;
        width: calc(50% - 92px - 12px);
        top: 50%;
        left: 0px;
        margin-right: 12px;
      }
    }
  `

  return (
    <>
      <div className="mainWrapper">
        <StyledMenuWrapper>
          <Head>
            <title>{`${lang?.forgotPw} - Master ID`}</title>
            <meta name="description" content="Master ID" />
          </Head>
          <CmidHead />
          <Box display="flex" justifyContent="center">
            <Box width={{ xs: "100%", sm: "480px"}}>
              <Box
              fontFamily="Teko"
              fontSize="36px"
              color="#717197"
              mt={{ xs: "62px", sm: "87px"}}
              mb="8px"
            >
              {lang?.welcomeBack}
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              gap="14px"
              fontSize="13px"
              fontFamily="open sans"
              color="#717197"
            >
              <Box
                height="44px"
                borderRadius="8px"
                bgcolor="#37374F"
                position="relative"
              >
                <Box width="fit-content" mt="13px" ml="16px">
                  {lang?.email}
                </Box>
              </Box>
              <Box
                height="44px"
                borderRadius="8px"
                bgcolor="#37374F"
                position="relative"
              >
                <Box width="fit-content" mt="13px" ml="16px">
                  {lang?.password}
                </Box>
              </Box>
            </Box>
            <Box mt="14px" color="#CA4AE8" fontFamily="open sans">
              {lang?.forgotPw}
            </Box>
            <Box
              height="44px"
              bgcolor="#A62BC3"
              borderRadius="8px"
              mt="36px"
              position="relative"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Box color="#FFF" fontFamily="open sans">
                {lang?.login}
              </Box>
            </Box>
            <Box
              mt="8px"
              mb="38px"
              color="#A5A5A9"
              fontSize="14px"
              display="flex"
              fontFamily="open sans"
              gap="4px"
              alignItems="center"
              justifyContent="center"
            >
              <Box>{lang?.noAccount}</Box>
              <Box
                color="#CA4AE8"
                sx={{
                  cursor: "pointer",
                }}
                onClick={() => router.push("/registration")}
              >
                {lang?.signUp}
              </Box>
            </Box>
            <Box
              color="#A5A5A9"
              fontSize="14px"
              fontFamily="open sans"
              display="flex"
              justifyContent="center"
            >
              <StyledLine>
                <span className="text">{lang?.loginDiffAccount}</span>
              </StyledLine>
            </Box>
            <Box display="flex" gap="24px" justifyContent="center" mt="24px">
              <Google />
              <Apple />
            </Box>
            </Box>
          </Box> 
        </StyledMenuWrapper>
        <MenuFooter Copyright="Copyright© 2023 Cooler Master Inc. All rights reserved." />
        <LinkNav />
      </div>
      {/* <AppsList /> */}
    </>
  )
}

export default Recovery

export async function getStaticProps({ locale } : any) {
  return {
    props: {...(await serverSideTranslations(locale, ['common']))},
  }
}