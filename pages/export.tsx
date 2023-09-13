import Box from "@mui/material/Box"
import { SettingsFlow } from "@ory/client"
import axios from "axios"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"

import AccountLayout from "../components/Layout/AccountLayout"
import { handleFlowError } from "../pkg/errors"
import ory from "../pkg/sdk"
import Cmodx from "../public/images/app_icons/Cmodx"
import MasterControlNew from "../public/images/app_icons/MasterControlNew"
import Stormplay from "../public/images/app_icons/Stormplay"
import { setActiveNav } from "../state/store/slice/layoutSlice"
import { Navs } from "../types/enum"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

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

const Export: NextPage = (props) => {
  const { lang } = props
  const dispatch = useDispatch()
  const [sessions, setSessions] = useState([])
  const [flow, setFlow] = useState<SettingsFlow>()
  const router = useRouter()

  const { flow: flowId, return_to: returnTo } = router.query

  useEffect(() => {
    dispatch(setActiveNav(Navs.EXPORT))
    axios.get("/api/.ory/sessions/whoami", {
      headers: { withCredentials: true },
    }).catch(() => {
      window.location.replace("/login");
    })
  }, [])

  useEffect(() => {
    refreshSessions(setSessions)
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      ory.getSettingsFlow({ id: String(flowId) })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleFlowError(router, "account", setFlow))
      return
    }

    // Otherwise we initialize it
    ory.createBrowserSettingsFlow({
        returnTo: "/account",
      })
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(handleFlowError(router, "account", setFlow))
  }, [flowId, router, router.isReady, returnTo, flow])

  return (
    <AccountLayout lang={lang}>
      <Box
        display="flex"
        flexDirection="column"
        position="relative"
        height="100%"
        marginTop={{
          sm: "48px",
          xs: "24px",
        }}
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
            <MasterControlNew />
            <span style={{ paddingLeft: "32px" }}>MasterControl</span>
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

export async function getStaticProps({ locale } : any) {
  return {
    props: {...(await serverSideTranslations(locale, ['common']))},
  }
}