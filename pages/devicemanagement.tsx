import { Box } from "@mui/material"
import { SettingsFlow } from "@ory/client"
import { H3 } from "@ory/themes"
import axios from "axios"
import isEmpty from "lodash/isEmpty"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import UAParser from "ua-parser-js"

import DeviceCard from "../components/DeviceCard"
import AccountLayout from "../components/Layout/AccountLayout"
import LinkNav from "../components/LinkNav"
import MenuFooter from "../components/MenuFooter"
import { Methods, ActionCard } from "../pkg"
import { handleFlowError } from "../pkg/errors"
import ory from "../pkg/sdk"
import { setActiveNav } from "../state/store/slice/layoutSlice"
import { Navs } from "../types/enum"

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
      alert(error.message)
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

  return <Box>{children}</Box>
}

const SessionList = (props) => {
  const { sessions, setSessions } = props
  if (sessions.length === 0) {
    return <div>{/* <p>無其他裝置登入資訊</p> */}</div>
  }

  return sessions.map((session) => {
    const [device] = session.devices
    const agent = new UAParser(device.user_agent)
    const agentResult = agent.getResult()
    const deviceName = agentResult.device.type
      ? agentResult.device.model
      : agentResult.os.name
    return (
      <>
        <Box key={session.id} flex={1}>
          <DeviceCard
            device={deviceName}
            location={device.location}
            browser={agentResult.browser.name}
            lastLogin={dayjs(session.authenticated_at).format()}
          />
        </Box>
        {/* <div key={session.id}>
          <p>Location: {device.location}</p>
          <p>Device: {deviceName}</p>
          <p>Browser: {agentResult.browser.name}</p>
          <p>最近登入: {dayjs(session.authenticated_at).format()}</p>
          <button onClick={() => deactiveSession(session.id, setSessions)}>
            Sign out
          </button>
        </div> */}
      </>
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
    <>
      <div key={session.id}>
        <DeviceCard
          device={deviceName}
          location={device.location}
          browser={agentResult.browser.name}
          lastLogin={dayjs(session.authenticated_at).format()}
        />
        {/* <p>Self Session: </p>
        <p>Location: {device.location}</p>
        <p>Device: {deviceName}</p>
        <p>Browser: {agentResult.browser.name}</p>
        <p>最近登入: {dayjs(session.authenticated_at).format()}</p> */}
      </div>
    </>
  )
}

const DeviceManagement: NextPage = () => {
  const dispatch = useDispatch()
  const [sessions, setSessions] = useState([])
  const [selfSession, setSelfSession] = useState({})
  const [flow, setFlow] = useState<SettingsFlow>()
  const router = useRouter()
  const { flow: flowId, return_to: returnTo } = router.query

  useEffect(() => {
    dispatch(setActiveNav(Navs.DEVICEMANAGEMENT))
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
    <AccountLayout>
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
        {/* <button
          onClick={() => {
            deacitveAllSession(sessions, setSessions)
          }}
        >
          remove all session
        </button> */}
        <SettingsCard only="profile" flow={flow}>
          <Box fontFamily="open sans">
            <Box color="#717197" fontSize="22px">
              Current Device
            </Box>
            <Box color="#A5A5A9" fontSize="14px" mt="4px" mb="12px">
              You’re signed in on these devices. There might be multiple
              activity sessions from the same device.
            </Box>
          </Box>
          <SessionListItem session={selfSession} />
          <Box
            fontFamily="open sans"
            display="flex"
            mt="36px"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box color="#717197" fontSize="22px" mb="12px">
              Other Device
            </Box>
            <Box color="#CA4AE8" fontSize="16px">
              Log out all
            </Box>
          </Box>
          <Box display="flex" flexDirection="row" gap="36px" flexWrap="wrap">
            <SessionList sessions={sessions} setSessions={setSessions} />
          </Box>
        </SettingsCard>
      </Box>
      <MenuFooter Copyright="Copyright© 2023 Cooler Master Inc. All rights reserved." />
      <LinkNav />
    </AccountLayout>
  )
}

export default DeviceManagement
