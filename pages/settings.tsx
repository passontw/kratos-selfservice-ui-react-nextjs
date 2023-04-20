import Box from "@mui/material/Box"
import { SettingsFlow, UpdateSettingsFlowBody } from "@ory/client"
import { H3, P } from "@ory/themes"
import axios from "axios"
import cloneDeep from "lodash/cloneDeep"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"
import { useDispatch } from "react-redux"

import Flow from "../components/changepassword/Flow"
import { ActionCard, Messages, Methods, LogoutLink } from "../pkg"
import { handleFlowError } from "../pkg/errors"
import ory from "../pkg/sdk"
import { setActiveNav, setActiveStage } from "../state/store/slice/layoutSlice"
import { Navs, Stage } from "../types/enum"
import { updatePasswordSchema } from "../util/schemas"
import { handleYupSchema, handleYupErrors } from "../util/yupHelpers"

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

  return (
    <Box
      width="100%"
      height="100%"
      maxWidth="564px"
      maxHeight="375px"
      bgcolor="#272735"
      borderRadius="12px"
      p="32px"
    >
      {children}
    </Box>
  )
}

const Settings: NextPage = () => {
  const dispatch = useDispatch()
  const [confirmPasswordError, setConfirmPasswordError] = useState("")
  const [flow, setFlow] = useState<SettingsFlow>()

  const onLogout = LogoutLink()

  // Get ?flow=... from the URL
  const router = useRouter()
  const { flow: flowId, return_to: returnTo } = router.query

  useEffect(() => {
    dispatch(setActiveNav(Navs.SETTINGS))
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
        .catch(handleFlowError(router, "settings", setFlow))
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
      .catch(handleFlowError(router, "settings", setFlow))
  }, [flowId, router, router.isReady, returnTo, flow])

  const onSubmit = async (values: UpdateSettingsFlowBody, confirmPassword) => {
    try {
      await handleYupSchema(updatePasswordSchema, {
        confirmPassword,
        password: values.password,
      })
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
              onLogout()
              router.push("/login")
            })
            .catch(handleFlowError(router, "login", setFlow))
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
      setConfirmPasswordError("")
    } catch (error) {
      const errors = handleYupErrors(error)
      const nextFlow = cloneDeep(flow)

      if (errors.password) {
        const passwordMessage = {
          id: 4000002,
          text: errors.password,
          type: "error",
        }
        const passwordNodes = nextFlow.ui.nodes || []
        const passwordIndex = passwordNodes.findIndex(
          (node) => node?.attributes?.name === "password",
        )
        nextFlow.ui.nodes[passwordIndex].messages = [passwordMessage]
      }

      console.log("🚀 ~ file: settings.tsx:153 ~ onSubmit ~ errors:", errors)
      if (errors.confirmPassword) {
        setConfirmPasswordError(errors.confirmPassword)
      } else {
        setConfirmPasswordError("")
      }
      setFlow(nextFlow)
    }
  }

  return (
    <>
      <div className="resetWrapper">
        <SettingsCard only="password" flow={flow}>
          <Box>
            <Box fontSize="20px" fontFamily="open sans" color="#FFF" mb="24px">
              Change Password
            </Box>
            {/* <Messages messages={flow?.ui.messages} /> */}
            <Flow
              hideGlobalMessages
              confirmPasswordError={confirmPasswordError}
              onSubmit={onSubmit}
              only="password"
              flow={flow}
            />
          </Box>
        </SettingsCard>
      </div>
    </>
  )
}

export default Settings
