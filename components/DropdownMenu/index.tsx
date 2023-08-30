import { StyledProfileImage } from "../../styles/pages/profile.styles"
import Box from "@mui/material/Box"
import { useRouter } from "next/router"
import { useState, useRef, useEffect } from "react"

import { LogoutLink } from "../../pkg"
import ory from "../../pkg/sdk"
import DefaultAvatar from "../../public/images/DefaultAvatar"
import Dropdown from "../../public/images/Dropdown"
import Logout from "../../public/images/Logout"

function DropdownComponent({ lang }) {
  const [isOpen, setIsOpen] = useState(false)
  const [pic, setPic] = useState("")
  const ref = useRef(null)
  const onLogout = LogoutLink()
  const router = useRouter()

  useEffect(() => {
    // add event listener to document to close dropdown when clicked outside
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref])

  useEffect(() => {
    ory.toSession().then(async ({ data }) => {
      console.log("@data", data)
      const user = data?.identity?.traits || {}

      try {
        if (!user) return
        const responseJson = await fetch("/api/image/get", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
          }),
        })
        const response = await responseJson.json()
        if (response) {
          // console.log("File get successfully", response)
          // if (response.file === nextState.pic) return
          setPic(response.file)
        } else {
          console.error("File get failed")
        }
      } catch (error) {
        console.error("Error get file:", error)
      }
    })
  }, [])

  return (
    <Box ref={ref} position="relative">
      <Box
        width="80px"
        height="44px"
        pt="3px"
        borderRadius="22px"
        bgcolor="#272735"
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap="17px"
        sx={{
          cursor: "pointer",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Box
          sx={{
            width: 36,
            borderRadius: "50%",
            overflow: "hidden",
          }}
        >
          {pic ? <img src={pic} width="100%" /> : <DefaultAvatar />}

          {/* <img src={"/images/profile-demo.jpg"} style={{
                height: "36px",
                width: "36px",
                borderRadius: "50%",
              }}/> */}
        </Box>
        <Box sx={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
          <Dropdown isOpen={isOpen} />
        </Box>
      </Box>
      {isOpen && (
        <Box
          minWidth="100px"
          padding="0 15px"
          height="60px"
          bgcolor="#37374F"
          position="absolute"
          top="60px"
          right="0"
          display="flex"
          borderRadius="12px"
          justifyContent="center"
          alignItems="center"
          gap="10px"
          zIndex={1}
          onClick={() => {
            onLogout()
          }}
          sx={{
            cursor: "pointer",
            ":hover": {
              filter: "brightness(0.9)",
            },
          }}
        >
          <Box mt="5px">
            <Logout />
          </Box>
          <Box
            width="max-content"
            fontSize="16px"
            color="#FFF"
            fontFamily="open sans"
            fontWeight="600"
            onClick={() => {
              onLogout()
            }}
          >
            {lang?.logout}
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default DropdownComponent
