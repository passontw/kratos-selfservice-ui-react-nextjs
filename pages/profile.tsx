import { NextPage } from "next"
import { H3 } from "@ory/themes"
import { Messages } from "../components/profile/Messages"
import Flow from "../components/profile/Flow"
import { ActionCard, Methods } from "../pkg"
import { RegistrationFlow, SettingsFlow, UpdateSettingsFlowBody } from "@ory/client"
import { useState } from "react"
import { useRouter } from "next/router"
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

const Profile: NextPage = () => {
  const [flow, setFlow] = useState<RegistrationFlow>()
  const router = useRouter()

  const onSubmit = (values: UpdateSettingsFlowBody) =>
    router
      // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
      // his data when she/he reloads the page.
      .push(`/settings?flow=${flow?.id}`, undefined, { shallow: true })
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
          .catch(handleFlowError(router, "settings", setFlow))
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

  return (
    <>
      <SettingsCard only="profile" flow={flow}>
        <H3>Profile Settings</H3>
        <Messages messages={flow?.ui.messages} />
        <Flow
          hideGlobalMessages
          onSubmit={onSubmit}
          only="profile"
          flow={flow}
        />
      </SettingsCard>
    </>
  )
}

export default Profile
