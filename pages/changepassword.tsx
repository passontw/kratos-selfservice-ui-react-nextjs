import axios from "axios"
import {
  StyledChangePasswordArea,
  StyledSection,
  StyledAccount,
  StyledEmail,
  StyledChangePasswordDeco,
} from "../styles/pages/changepassword.styles"
import { SettingsFlow, UpdateSettingsFlowBody } from "@ory/client"
import cloneDeep from "lodash/cloneDeep"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"
import { useDispatch } from "react-redux"

import AccountLayout from "../components/Layout/AccountLayout"
import Flow from "../components/changepassword/Flow"
import { Methods, ActionCard } from "../pkg"
import { handleFlowError } from "../pkg/errors"
import ory from "../pkg/sdk"
import { setActiveNav, setActiveStage } from "../state/store/slice/layoutSlice"
import { Navs, Stage } from "../types/enum"
import { changePasswordSchema } from "../util/schemas"
import { handleYupSchema, handleYupErrors } from "../util/yupHelpers"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

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

const ChangePassword: NextPage = (props) => {
  const { lang } = props
  const [confirmPasswordError, setConfirmPasswordError] = useState("")
  const [flow, setFlow] = useState<SettingsFlow>()
  const dispatch = useDispatch()
  const email = flow?.identity.traits?.email

  // Get ?flow=... from the URL
  const router = useRouter()
  const { flow: flowId, return_to: returnTo } = router.query

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return
    }

    ory
      .createBrowserSettingsFlow({
        returnTo: returnTo ? String(returnTo) : undefined,
      })
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(handleFlowError(router, "settings", setFlow))
  }, [])

  useEffect(() => {
    dispatch(setActiveNav(Navs.CHANGEPASSWORD))
    dispatch(setActiveStage(Stage.NONE))

    axios.get("/api/.ory/sessions/whoami", {
      headers: { withCredentials: true },
    }).catch(() => {
      window.location.replace("/login");
    })
  }, [])

  const onSubmit = async (values: UpdateSettingsFlowBody, confirmPassword) => {
    try {
      await handleYupSchema(changePasswordSchema, {
        confirmPassword,
        password: values.password,
      })
      return router
        // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
        // his data when she/he reloads the page.
        .push(`/changepassword?flow=${flow?.id}`, undefined, { shallow: true })
        .then(() =>
          ory
            .updateSettingsFlow({
              flow: String(flow?.id),
              updateSettingsFlowBody: values,
            })
            .then(({ data }) => {
              // The settings have been saved and the flow was updated. Let's show it to the user!
              setFlow(data)
              setConfirmPasswordError("")
            })
            .catch(handleFlowError(router, "changepassword", setFlow))
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
    <AccountLayout lang={lang}>
      <StyledChangePasswordArea marginTop="48px">
        <StyledChangePasswordDeco src={"/images/change-password-deco.png"} />
        <StyledSection>
          <StyledAccount>{lang?.account || 'Account'}</StyledAccount>
          <StyledEmail>{email}</StyledEmail>
        </StyledSection>
      </StyledChangePasswordArea>
      <StyledChangePasswordArea>
        <SettingsCard only="password" flow={flow}>
          {/* <Messages messages={flow?.ui.messages} /> */}
          <Flow
            hideGlobalMessages
            confirmPasswordError={confirmPasswordError}
            onSubmit={onSubmit}
            only="password"
            flow={flow}
            lang={lang}
          />
        </SettingsCard>
      </StyledChangePasswordArea>
    </AccountLayout>
  )
}

export default ChangePassword

export async function getStaticProps({ locale } : any) {
  return {
    props: {...(await serverSideTranslations(locale, ['common']))},
  }
}