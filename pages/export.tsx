import Box from "@mui/material/Box"
import { SettingsFlow, UpdateSettingsFlowBody } from "@ory/client"
import { H3 } from "@ory/themes"
import axios from "axios"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"
import { useDispatch } from "react-redux"

import AccountLayout from "../components/Layout/AccountLayout"
import { Flow } from "../components/account/Flow"
import ProfileFlow from "../components/account/ProfileFlow"
import VerificationModal from "../components/account/VerificationModal"
import { Methods, ActionCard, Messages } from "../pkg"
import { handleFlowError } from "../pkg/errors"
import ory from "../pkg/sdk"
import Bin from "../public/images/Bin"
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
    dispatch(setActiveNav(Navs.ACCOUNT))
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
      <Box display="flex" flexDirection="column">

      </Box>
    </AccountLayout>
  )
}

export default Export
