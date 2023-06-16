import Box from "@mui/material/Box"
import { useRouter } from "next/router"
import { useState, useRef, useEffect } from "react"

import { LogoutLink } from "../../pkg"
import DefaultAvatar from "../../public/images/DefaultAvatar"
import Dropdown from "../../public/images/Dropdown"
import Logout from "../../public/images/Logout"

function DropdownComponent() {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)
  const onLogout = LogoutLink()
  const router = useRouter();

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
        <Box>
          {/* <DefaultAvatar /> */}
          <img src={"/images/profile-demo.jpg"} style={{
                height: "36px",
                width: "36px",
                borderRadius: "50%",
              }}/>
        </Box>
        <Box sx={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
          <Dropdown isOpen={isOpen} />
        </Box>
      </Box>
      {isOpen && (
        <Box
          width="125px"
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
            onLogout();
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
            fontSize="16px"
            color="#FFF"
            fontFamily="open sans"
            fontWeight="600"
            onClick={() => {
              onLogout();
            }}
          >
            Log Out
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default DropdownComponent
