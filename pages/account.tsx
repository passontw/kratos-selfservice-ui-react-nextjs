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

const Account: NextPage = () => {
  const dispatch = useDispatch()
  const [sessions, setSessions] = useState([])
  const [flow, setFlow] = useState<SettingsFlow>()
  const router = useRouter()

  const { flow: flowId, return_to: returnTo } = router.query

  const deleteAccount = async () => {
    const { data } = await axios.get("/api/.ory/sessions/whoami", {
      headers: { withCredentials: true },
    })
    return axios
      .delete(`${process.env.ORY_SDK_URL}/admin/identities/${data.identity.id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${process.env.ORY_PAT}`,
        },
      })
      .then((resp) => {
        router.replace("/")
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  const deleteAccountPromt = async () => {
    const confirmResult = confirm("是否確定刪除帳號?")
    if (confirmResult) {
      const { data } = await axios.get("/api/.ory/sessions/whoami", {
        headers: { withCredentials: true },
      })

      const { traits } = data.identity
      // return;
      return router
        .push(
          flow?.return_to ||
            `/account?flow=${flowId || flow.id}&user=${traits.email}`,
        )
        .then(() => {})
    }
  }

  const onSubmit = (values: UpdateSettingsFlowBody) => {
    return (
      router
        // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
        // his data when she/he reloads the page.
        .push(`/account?flow=${flow?.id}`, undefined, { shallow: true })
        .then(() =>
          ory
            .updateSettingsFlow({
              flow: String(flow?.id),
              updateSettingsFlowBody: values,
            })
            .then(({ data }) => {
              // The settings have been saved and the flow was updated. Let's show it to the user!
              setFlow(data)
            })
            .catch(handleFlowError(router, "account", setFlow))
            .catch(async (err: any) => {
              // If the previous handler did not catch the error it's most likely a form validation error
              if (err.response?.status === 400) {
                // Yup, it is!
                setFlow(err.response?.data)
                return
              }

              return Promise.reject(err)
            }),
        )
    )
  }
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
      <SettingsCard only="oidc" flow={flow}>
        <H3>Manage Social Sign In</H3>

        <Messages messages={flow?.ui.messages} />
        <Flow hideGlobalMessages onSubmit={onSubmit} only="oidc" flow={flow} />
      </SettingsCard>

      <SettingsCard only="profile" flow={flow}>
        <H3>Profile Settings</H3>
        <Messages messages={flow?.ui.messages} />
        <ProfileFlow
          hideGlobalMessages
          onSubmit={onSubmit}
          only="profile"
          flow={flow}
        />
      </SettingsCard>

      <SettingsCard only="profile" flow={flow}>
        <button onClick={deleteAccountPromt}>刪除帳號</button>
        <VerificationModal deleteAccount={deleteAccount} />
      </SettingsCard>
    </AccountLayout>
  )
}

export default Account
