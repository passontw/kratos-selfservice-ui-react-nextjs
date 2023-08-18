import Box from "@mui/material/Box"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useRouter } from "next/router"
import { useEffect } from "react"

import LinkNav from "../components/LinkNav"
import MenuFooter from "../components/MenuFooter"
import Cmid from "../public/images/app_icons/Cmid"
import MasterCTRLLogo from "../public/images/app_icons/MasterCTRLLogo"

interface LaunchProps {}

const Launch: React.FC<LaunchProps> = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const query = router.query
  const { platform, refresh_token, access_token, name, email } = query as {
    platform: string
    refresh_token: string
    access_token: string
    name: string
    email: string
  }

  console.log(
    "@launch\nplatform",
    platform,
    "refresh_token",
    refresh_token,
    "access_token",
    access_token,
    "name",
    name,
    "email",
    email,
  )

  useEffect(() => {
    handleOpenClient()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOpenClient = () => {
    switch (platform) {
      case "desktop": {
        router.push(
          `mastercontrol://refresh_token=${refresh_token}:access_token=${access_token}:name=${name}:email=${email}`,
        )
      }
      case "app": {
        // TODO open IOS / Android app
        return
      }
    }
  }

  const renderClientName = (platform: string) => {
    switch (platform) {
      case "desktop": {
        return "MasterCTRL"
      }
      case "mobile": {
        return "App"
      }
    }
  }

  const func2 = async (callback: () => Promise<boolean>) => {
    console.log("@callback 3")
    const done = await callback()

    console.log("@callback 4 done:", done)
    if (done) {
      console.log("@callback func2 done!")
    }
  }
  const func1 = () => {
    console.log("@callback 1")
    return new Promise(() => {
      setTimeout(() => {
        return true
      }, 5000)
    })
    console.log("@callback 2")
    return false
  }

  func2(func1)

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
        <Cmid />
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
      <div
        style={{
          position: "absolute",
          background:
            "linear-gradient(180deg, rgba(29, 29, 40, 0.2) -23.39%, #1D1D28 50%)",
          height: "100vh",
          width: "100vw",
        }}
      ></div>
      <div className="resetWrapper">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          position="absolute"
        >
          <Box display="flex" gap="26px">
            <Box display="flex" alignItems="center">
              <MasterCTRLLogo />
            </Box>
          </Box>
          <Box
            mt="73px"
            color="#FFF"
            fontSize="48px"
            fontFamily="Teko"
            width="450px"
            textAlign="center"
          >
            {t("launching") || "Launching..."}
          </Box>
          <Box
            color="#A5A5A9"
            fontSize="14px"
            fontFamily="Open Sans"
            width="450px"
            textAlign="center"
          >
            <Box>{t("launch-hint-click_open")}</Box>
            <Box>{t("launch-hint-no_response")}</Box>
          </Box>
          <Box
            mt="48px"
            bgcolor="#A62BC3"
            width="400px"
            height="44px"
            borderRadius="8px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="#FFFFFF"
            fontFamily="open sans"
            fontSize="16px"
            onClick={handleOpenClient}
            sx={{
              cursor: "pointer",
              "&:hover": {
                filter: "brightness(0.9)",
              },
            }}
          >
            {t("launch-open")}
            {/* {renderClientName(platform)} */}
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

export default Launch

export async function getStaticProps({ locale }: any) {
  return {
    props: { ...(await serverSideTranslations(locale, ["common"])) },
  }
}
