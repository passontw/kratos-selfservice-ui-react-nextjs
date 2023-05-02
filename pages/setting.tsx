import { SettingsFlow, UpdateSettingsFlowBody } from "@ory/client"
import { CardTitle, H3, P } from "@ory/themes"
import axios from "axios"
import type { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"
import UAParser from "ua-parser-js"

import { Flow, Methods, Messages, ActionCard, CenterLink } from "../pkg"
import { handleFlowError } from "../pkg/errors"
import ory from "../pkg/sdk"

interface Props {
  flow?: SettingsFlow
  only?: Methods
}

function SettingsCard({
  flow,
  only,
  children,
}: Props & { children: ReactNode }) {
  if (!flow) {
    return null
  }

  const nodes = only
    ? flow.ui.nodes.filter(({ group }) => group === only)
    : flow.ui.nodes

  if (nodes.length === 0) {
    return null
  }

  return <ActionCard wide>{children}</ActionCard>
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

const deactiveSession = (sessionId, setSessions) => {
  return axios
    .delete(`/api/.ory/sessions/${sessionId}`, {
      headers: { withCredentials: true },
    })
    .then((resp) => {
      refreshSessions(setSessions)
    })
    .catch((error) => {
      alert(error.message)
    })
}

const Settings: NextPage = () => {
  const [flow, setFlow] = useState<SettingsFlow>()

  // Get ?flow=... from the URL
  const router = useRouter()
  const { flow: flowId, return_to: returnTo } = router.query

  useEffect(() => {
    if (flowId) {
      ory
        .getSettingsFlow({ id: String(flowId) })
        .then(({ data }) => {
          router.replace(`/account?flow=${flowId}`);
        })
        .catch(handleFlowError(router, "account", setFlow))
      return
    }
  }, [])
  
  return null;
}

export default Settings
