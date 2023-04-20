import { StyledProfileArea } from "../styles/pages/profile.styles"
import Box from "@mui/material/Box"
import {
  RegistrationFlow,
  SettingsFlow,
  UpdateSettingsFlowBody,
} from "@ory/client"
import { H3 } from "@ory/themes"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { ReactNode, useState, useEffect } from "react"
import { useDispatch } from "react-redux"

import AccountLayout from "../components/Layout/AccountLayout"
import { showToast } from "../components/Toast"
import Flow from "../components/profile/Flow"
import { Messages } from "../components/profile/Messages"
import { ActionCard, Methods } from "../pkg"
import { handleFlowError } from "../pkg/errors"
import ory from "../pkg/sdk"
import { setActiveNav, setActiveStage } from "../state/store/slice/layoutSlice"
import { Navs, Stage } from "../types/enum"

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

  return <Box bgcolor="transparent">{children}</Box>
}

const Profile: NextPage = () => {
  const dispatch = useDispatch()
  const [flow, setFlow] = useState<RegistrationFlow>()
  const router = useRouter()

  const { flow: flowId, return_to: returnTo } = router.query

  useEffect(() => {
    dispatch(setActiveNav(Navs.PROFILE))
    dispatch(setActiveStage(Stage.NONE))
  }, [])

  useEffect(() => {
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
        .catch(handleFlowError(router, "profile", setFlow))
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
      .catch(handleFlowError(router, "profile", setFlow))
  }, [flowId, router, router.isReady, returnTo, flow])

  const onSubmit = (values: UpdateSettingsFlowBody) =>
    router
      // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
      // his data when she/he reloads the page.
      .push(`/profile?flow=${flow?.id}`, undefined, { shallow: true })
      .then(() =>
        ory
          .updateSettingsFlow({
            flow: String(flow?.id),
            updateSettingsFlowBody: values,
          })
          .then(({ data }) => {
            // The settings have been saved and the flow was updated. Let's show it to the user!
            if (data.state === "success") {
              console.log("settings have been updated", data)
              showToast("Profile updated successfully")
            }
            setFlow(data)
          })
          .catch(handleFlowError(router, "profile", setFlow))
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
    <AccountLayout>
      <StyledProfileArea paddingRight="0">
        <SettingsCard only="profile" flow={flow}>
          {/* <H3>Profile Settings</H3> */}
          {/* <Messages messages={flow?.ui.messages} /> */}
          <Flow
            hideGlobalMessages
            onSubmit={onSubmit}
            only="profile"
            flow={flow}
          />
        </SettingsCard>
      </StyledProfileArea>
    </AccountLayout>
  )
}

export default Profile
