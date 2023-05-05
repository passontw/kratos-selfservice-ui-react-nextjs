import { SettingsFlow } from "@ory/client"
import { H3 } from "@ory/themes"
import axios from "axios"
import isEmpty from "lodash/isEmpty"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"
import UAParser from "ua-parser-js"

import { Methods, ActionCard } from "../pkg"
import { handleFlowError } from "../pkg/errors"
import ory from "../pkg/sdk"

const dayjs = require("dayjs")
var utc = require("dayjs/plugin/utc")
var timezone = require("dayjs/plugin/timezone") // dependent on utc plugin

dayjs.extend(utc)
dayjs.extend(timezone)

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

const deacitveAllSession = async (sessions, setSessions) => {
  const promisesResult = sessions.map((session) => {
    return axios.delete(`/api/.ory/sessions/${session.id}`, {
      headers: { withCredentials: true },
    })
  })

  await Promise.all(promisesResult)
  refreshSessions(setSessions)
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
      // alert(error.message);
      showToast(error.message, false)
    })
}

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

const SessionList = (props) => {
  const { sessions, setSessions } = props
  if (sessions.length === 0) {
    return (
      <div>
        <p>無其他裝置登入資訊</p>
      </div>
    )
  }

  return sessions.map((session) => {
    const [device] = session.devices
    const agent = new UAParser(device.user_agent)
    const agentResult = agent.getResult()
    const deviceName = agentResult.device.type
      ? agentResult.device.model
      : agentResult.os.name
    return (
      <div key={session.id}>
        <p>Location: {device.location}</p>
        <p>Device: {deviceName}</p>
        <p>Browser: {agentResult.browser.name}</p>
        <p>最近登入: {dayjs(session.authenticated_at).format()}</p>
        <button onClick={() => deactiveSession(session.id, setSessions)}>
          Sign out
        </button>
      </div>
    )
  })
}

const SessionListItem = (props) => {
  const { session } = props
  if (isEmpty(session)) return null

  const [device] = session.devices
  const agent = new UAParser(device.user_agent)
  const agentResult = agent.getResult()
  const deviceName = agentResult.device.type || agentResult.device.model
  return (
    <div key={session.id}>
      <p>Self Session: </p>
      <p>Location: {device.location}</p>
      <p>Device: {deviceName}</p>
      <p>Browser: {agentResult.browser.name}</p>
      <p>最近登入: {dayjs(session.authenticated_at).format()}</p>
    </div>
  )
}

const Services: NextPage = () => {
  const [sessions, setSessions] = useState([])
  const [selfSession, setSelfSession] = useState({})
  const [flow, setFlow] = useState<SettingsFlow>()
  const router = useRouter()
  const { flow: flowId, return_to: returnTo } = router.query

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
        .catch(handleFlowError(router, "settings", setFlow))
      return
    }

    axios
      .get("/api/.ory/sessions/whoami", {
        headers: { withCredentials: true },
      })
      .then(({ data }) => {
        setSelfSession(data)
      })
    // Otherwise we initialize it
    ory
      .createBrowserSettingsFlow({
        returnTo: returnTo ? String(returnTo) : undefined,
      })
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(handleFlowError(router, "settings", setFlow))
  }, [flowId, router, router.isReady, returnTo, flow])

  return (
    <>
      <button
        onClick={() => {
          deacitveAllSession(sessions, setSessions)
        }}
      >
        remove all session
      </button>
      <SettingsCard only="profile" flow={flow}>
        <H3>Session Management</H3>
        <SessionListItem session={selfSession} />
        <SessionList sessions={sessions} setSessions={setSessions} />
      </SettingsCard>
    </>
  )
}

export default Services
