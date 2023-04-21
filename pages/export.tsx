import Box from "@mui/material/Box"
import { SettingsFlow, UpdateSettingsFlowBody } from "@ory/client"
import axios from "axios"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"

import AccountLayout from "../components/Layout/AccountLayout"
import LinkNav from "../components/LinkNav"
import MenuFooter from "../components/MenuFooter"
import { Methods, ActionCard, Messages } from "../pkg"
import { handleFlowError } from "../pkg/errors"
import ory from "../pkg/sdk"
import Cmodx from "../public/images/app_icons/Cmodx"
import MasterControl from "../public/images/app_icons/MasterControl"
import Stormplay from "../public/images/app_icons/Stormplay"
import { setActiveNav } from "../state/store/slice/layoutSlice"
import { Navs } from "../types/enum"

interface Props {
  flow?: SettingsFlow
  only?: Methods
}

const refreshSessions = (setSessions) => {
  axios
    .get("/api/.ory/sessions", {
      headers: { withCredentials: true },
    })
    .then((resp) => {
      const { data } = resp
      setSessions(data)
    })
    .catch((error) => {
      setSessions([])
    })
}

const Export: NextPage = () => {
  const dispatch = useDispatch()
  const [sessions, setSessions] = useState([])
  const [flow, setFlow] = useState<SettingsFlow>()
  const router = useRouter()

  const { flow: flowId, return_to: returnTo } = router.query

  useEffect(() => {
    dispatch(setActiveNav(Navs.EXPORT))
  }, [])

  useEffect(() => {
    refreshSessions(setSessions)
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      ory
        .getSettingsFlow({ id: String(flowId) })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleFlowError(router, "account", setFlow))
      return
    }

    // Otherwise we initialize it
    ory
      .createBrowserSettingsFlow({
        returnTo: "/account",
      })
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(handleFlowError(router, "account", setFlow))
  }, [flowId, router, router.isReady, returnTo, flow])

  return (
    <AccountLayout>
      <Box
        display="flex"
        flexDirection="column"
        position="relative"
        height="100%"
        marginTop="48px"
      >
        <p
          style={{
            color: "#717197",
            fontFamily: "Open Sans",
            fontSize: "22px",
            fontWeight: "400",
            margin: "0px 0px 12px 0px",
          }}
        >
          Service
        </p>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          color="#FFF"
          fontFamily="Open Sans"
          backgroundColor="#272735"
          padding="24px"
          borderRadius="20px"
          marginBottom="36px"
        >
          <Box display="flex" alignItems="center">
            <Stormplay />
            <span style={{ paddingLeft: "32px" }}>StormPlay</span>
          </Box>
          <Box
            backgroundColor="#A62BC3"
            padding="12px 20px"
            borderRadius="8px"
            sx={{
              "&:hover": {
                cursor: "pointer",
              },
            }}
          >
            Export
          </Box>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          color="#FFF"
          fontFamily="Open Sans"
          backgroundColor="#272735"
          padding="24px"
          borderRadius="20px"
          marginBottom="36px"
        >
          <Box display="flex" alignItems="center">
            <MasterControl />
            <span style={{ paddingLeft: "32px" }}>Master Control</span>
          </Box>
          <Box
            backgroundColor="#A62BC3"
            padding="12px 20px"
            borderRadius="8px"
            sx={{
              "&:hover": {
                cursor: "pointer",
              },
            }}
          >
            Export
          </Box>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          color="#FFF"
          fontFamily="Open Sans"
          backgroundColor="#272735"
          padding="24px"
          borderRadius="20px"
        >
          <Box display="flex" alignItems="center">
            <Cmodx />
            <span style={{ paddingLeft: "32px" }}>CMODX</span>
          </Box>
          <Box
            backgroundColor="#A62BC3"
            padding="12px 20px"
            borderRadius="8px"
            sx={{
              "&:hover": {
                cursor: "pointer",
              },
            }}
          >
            Export
          </Box>
        </Box>
      </Box>
    </AccountLayout>
  )
}

export default Export
