import { SettingsFlow, UpdateSettingsFlowBody } from "@ory/client"
import { H3 } from "@ory/themes"
import axios from "axios"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"
import Flow from "./Flow"
import ProfileFlow from "./ProfileFlow"
import { Methods, ActionCard, Messages } from "../../pkg"
import { handleFlowError } from "../../pkg/errors"
import ory from "../../pkg/sdk"

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
  const [sessions, setSessions] = useState([])
  const [flow, setFlow] = useState<SettingsFlow>()
  console.log("🚀 ~ file: account.tsx:52 ~ flow:", flow)
  const router = useRouter()

  const { flow: flowId, return_to: returnTo } = router.query

  const deleteAccount = async () => {
    const confirmResult = confirm("是否確定刪除帳號?")
    if (confirmResult) {
      const { data } = await axios.get("/api/.ory/sessions/whoami", {
        headers: { withCredentials: true },
      })

      return axios
        .delete(`https://auth.passon.tw/admin/identities/${data.identity.id}`, {
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
  }

  const onSubmit = (values: UpdateSettingsFlowBody) =>
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
        returnTo: returnTo ? String(returnTo) : undefined,
      })
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(handleFlowError(router, "account", setFlow))
  }, [flowId, router, router.isReady, returnTo, flow])

  return (
    <>

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
        <button onClick={deleteAccount}>刪除帳號</button>
      </SettingsCard>

    </>
  )
}

export default Account
