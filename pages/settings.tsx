import Box from "@mui/material/Box"
import { SettingsFlow, UpdateSettingsFlowBody } from "@ory/client"
import cloneDeep from "lodash/cloneDeep"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"
import { useDispatch } from "react-redux"

import MenuFooter from "../components/MenuFooter"
import Cmid from "../public/images/app_icons/Cmid"
import Flow from "../components/changepassword/Flow"
import { ActionCard, Messages, Methods, LogoutLink } from "../pkg"
import { handleFlowError } from "../pkg/errors"
import ory from "../pkg/sdk"
import { setActiveNav, setActiveStage } from "../state/store/slice/layoutSlice"
import { Navs, Stage } from "../types/enum"
import { updateSettingsPasswordSchema } from "../util/schemas"
import { handleYupSchema, handleYupErrors } from "../util/yupHelpers"
import LinkNav from '../components/LinkNav'

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
      maxHeight="343px"
      bgcolor="#272735"
      borderRadius="12px"
      p="32px"
      position="relative"
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
    return () => {
      onLogout();
    }
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
      await handleYupSchema(updateSettingsPasswordSchema, {
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
      } else {
        const passwordNodes = nextFlow.ui.nodes || []
        const passwordIndex = passwordNodes.findIndex(
          (node) => node?.attributes?.name === "password",
        )
        nextFlow.ui.nodes[passwordIndex].messages = []
      }

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
      <Box position='absolute' display='flex' alignItems='center' justifyContent={{xs:'center', sm: 'left'}} width='100%' gap='16px' padding={{xs:'35px 0px 0px', sm:'48px 0px 0px 48px'}} >
        <Cmid />
        <Box fontFamily="Teko" fontSize={{xs:'24px', sm:'32px'}} color="#fff" lineHeight='44px' textTransform="uppercase" >Cooler Master ID</Box>
      </Box>
      <div style={{
        position: 'absolute',
        background: 'linear-gradient(180deg, rgba(29, 29, 40, 0.2) -23.39%, #1D1D28 50%);',
        height: '100vh',
        width: '100vw',
      }}></div>
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
      <MenuFooter Copyright="Copyright© 2023 Cooler Master Inc. All rights reserved." />
      <LinkNav />
    </>
  )
}

export default Settings
