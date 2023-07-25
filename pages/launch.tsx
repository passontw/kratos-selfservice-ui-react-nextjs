import Box from "@mui/material/Box"
import { useRouter } from "next/router"
import { useEffect } from "react"

import LinkNav from "../components/LinkNav"
import MenuFooter from "../components/MenuFooter"
import Cmid from "../public/images/app_icons/Cmid"
import Dana from "../public/images/app_icons/Dana"

interface LaunchProps {}

const Launch: React.FC<LaunchProps> = () => {
  const router = useRouter()

  const platform = "desktop"
  const refresh_token = "refresh_token"
  const access_token = "access_token"
  const name = "name"
  const email = "email"

  useEffect(() => {
    router.push("dana://token=login")
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
        return "MasterControl"
      }
      case "mobile": {
        return "App"
      }
    }
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
              <Dana />
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
            Launching...
          </Box>
          <Box
            color="#A5A5A9"
            fontSize="14px"
            fontFamily="Open Sans"
            width="450px"
            textAlign="center"
          >
            <Box>Click “Open” on browser alert to continue using.</Box>
            <Box>
              If your application didn’t response, please click below button.
            </Box>
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
            Open {renderClientName(platform)}
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
