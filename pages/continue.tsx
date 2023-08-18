import { Box } from "@mui/material"
import { NextPage } from "next"

import LinkNav from "../components/LinkNav"
import MenuFooter from "../components/MenuFooter"

const Continue: NextPage = () => {
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

      <Box display="flex" justifyContent={"center"} alignItems={"center"}>
        Continue using MasterCTRL with
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

export default Continue
