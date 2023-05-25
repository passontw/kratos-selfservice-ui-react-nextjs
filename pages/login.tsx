import Box from "@mui/material/Box"
import { LoginFlow } from "@ory/client"
import axios from "axios"
import { AxiosError } from "axios"
import cloneDeep from "lodash/cloneDeep"
import isEmpty from "lodash/isEmpty"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import queryString from "query-string"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { api } from "../axios/api"
import AppsList from "../components/AppsList"
import CmidHead from "../components/CmidHead"
import MenuFooter from "../components/MenuFooter"
import MenuTag from "../components/MenuTag"
import { showToast } from "../components/Toast"
import { LogoutLink, Flow } from "../pkg"
import { handleGetFlowError, handleFlowError } from "../pkg/errors"
import ory from "../pkg/sdk"
import {
  selectAccountDeleted,
  setAccountDeleted,
  setActiveNav,
  setActiveStage,
  setDialog,
  setLockCodeResend,
} from "../state/store/slice/layoutSlice"
import { Navs, Stage } from "../types/enum"
import { loginFormSchema } from "../util/schemas"
import { handleYupSchema, handleYupErrors } from "../util/yupHelpers"

import { StyledMenuWrapper } from "./../styles/share"

const localStorageKey = "!@#$%^&*()data"
const registeLocalStorageKey = "!@#$%^&*()registedata"

const { NEXT_PUBLIC_REDIRECT_URI } = process.env

const getSessionData = async () => {
  try {
    return await ory.toSession()
  } catch (err) {
    return {}
  }
}

const validateLoginFlow = async (router, options) => {
  const { login_challenge, refresh, aal, setFlow } = options

  try {
    const sessionData = await getSessionData()
    if (isEmpty(sessionData)) {
      const { data } = await ory.createBrowserLoginFlow({
        refresh: Boolean(refresh),
        aal: aal ? String(aal) : undefined,
        returnTo: Boolean(login_challenge)
          ? NEXT_PUBLIC_REDIRECT_URI
          : "/profile",
      })

      if (router.query.login_challenge) {
        data.oauth2_login_challenge = router.query.login_challenge as string
      }
      setFlow(data)
    } else {
      const nextUri = "/profile"
      router.push(nextUri)
      return
    }
  } catch (error) {
    handleFlowError(router, "login", setFlow)
  }
}

const Login: NextPage = () => {
  const [flow, setFlow] = useState<LoginFlow>()
  const dispatch = useDispatch()
  const accountDeleted = useSelector(selectAccountDeleted)

  useEffect(() => {
    if (accountDeleted) {
      showToast("Account deleted")
    }
    dispatch(setActiveNav(Navs.LOGIN))
    dispatch(setActiveStage(Stage.NONE))
    dispatch(setDialog(null))
    dispatch(setLockCodeResend(false))
    dispatch(setAccountDeleted(false))
  }, [])

  // Get ?flow=... from the URL
  const router = useRouter()
  const {
    login_challenge,
    return_to: returnTo,
    flow: flowId,
    // Refresh means we want to refresh the session. This is needed, for example, when we want to update the password
    // of a user.
    refresh,
    // AAL = Authorization Assurance Level. This implies that we want to upgrade the AAL, meaning that we want
    // to perform two-factor authentication/verification.
    aal,
  } = router.query

  // This might be confusing, but we want to show the user an option
  // to sign out if they are performing two-factor authentication!
  const onLogout = LogoutLink([aal, refresh])

  const hydraLoginService = async () => {
    if (login_challenge) {
      const response = await fetch(
        "/api/hydra/login?login_challenge=" + login_challenge,
        {
          method: "GET",
        },
      )
      return response
    }
  }

  useEffect(() => {
    localStorage.removeItem(localStorageKey)
    hydraLoginService()
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      ory
        .getLoginFlow({ id: String(flowId) })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleGetFlowError(router, "login", setFlow))
      return
    }
    const options = {
      login_challenge,
      refresh,
      aal,
      returnTo,
      setFlow,
    }

    validateLoginFlow(router, options)

    // Otherwise we initialize it
    // ory
    //   .createBrowserLoginFlow({
    //     refresh: Boolean(refresh),
    //     aal: aal ? String(aal) : undefined,
    //     returnTo: returnTo ? String(returnTo) : undefined,
    //   })
    //   .then(({ data }) => {
    //     if (router.query.login_challenge) {
    //       data.oauth2_login_challenge = router.query.login_challenge as string
    //     }
    //     setFlow(data)
    //   })
    //   .catch(handleFlowError(router, "login", setFlow))
  }, [flowId, router, router.isReady, aal, refresh, returnTo, flow])

  const doConsentProcess = async (login_challenge: string, subject: string) => {
    // new OAuth2.0 flow with hydra
    const response = await api
      .post("/api/hydra/login", {
        login_challenge,
        subject,
      })
      .then((res) => {
        // login response was successful re-route to consent-page
        if (res.status === 200) {
          // redirect with challenge:
          router.push(res.data?.redirect_to)
        }
      })
      .catch((err: AxiosError) => {
        console.log("[@post-api-hydra] POST hydra/login error", err)
      })
  }

  // const onSubmit = async (values: UpdateLoginFlowBody) => {
  const onSubmit = async (values: any) => {
    const login_challenge = router.query.login_challenge
    // TODO - this is temp method to add subject, need to get subject from account
    let subject = ""
    if (values?.identifier) {
      subject = values.identifier
    }

    try {
      const isEmailSignin = isEmpty(values.provider)
      if (isEmailSignin) {
        await handleYupSchema(loginFormSchema, values)
      }
      if (isEmailSignin) {
        const response = await axios.get(
          `/api/hydra/validateIdentity?email=${values.identifier}`,
        )
        if (isEmpty(response.data.data)) {
          const nextFlow = {
            ...flow,
            ui: {
              ...flow.ui,
              messages: [
                {
                  id: 400001,
                  text: "Email account doesn’t exist. Please try again or sign up",
                  type: "error",
                },
              ],
            },
          }
          setFlow(nextFlow)
          return
        }
      }
      return (
        ory
          .updateLoginFlow({
            flow: String(flow?.id),
            updateLoginFlowBody: values,
          })

          // We logged in successfully! Let's bring the user home.
          .then((loginResult) => {
            return axios
              .get("/api/.ory/sessions/whoami", {
                headers: { withCredentials: true },
              })
              .then((result) => {
                return [loginResult, result.data]
              })
          })
          .then(([loginResult, myResult]) => {
            console.log("ttt", myResult.identity.traits)
            if (myResult.identity.traits.email === "cmctc.sw@gmail.com") {
              router.push("/launch")
              return
            }
            const { session } = loginResult.data
            const { traits } = session.identity
            const { verifiable_addresses = [] } = myResult.identity

            const [verifiable_address] = verifiable_addresses
            if (isEmpty(verifiable_address) || !verifiable_address.verified) {
              return ory
                .createBrowserLogoutFlow()
                .then(({ data: logoutFlow }) => {
                  return ory.updateLogoutFlow({
                    token: logoutFlow.logout_token,
                  })
                })
                .then(() => {
                  // alert("please continue registe flow")
                  localStorage.setItem(localStorageKey, JSON.stringify(values))
                  window.location.href = `/verification?${queryString.stringify(
                    router.query,
                  )}&user=${values.identifier}&type=continueregiste`
                  return
                })
            }

            if (isEmailSignin && traits.loginVerification) {
              return ory
                .createBrowserLogoutFlow()
                .then(({ data: logoutFlow }) => {
                  return ory.updateLogoutFlow({
                    token: logoutFlow.logout_token,
                  })
                })
                .then(() => {
                  localStorage.setItem(localStorageKey, JSON.stringify(values))
                  window.location.href = `/verification?${queryString.stringify(
                    router.query,
                  )}&user=${traits.email}&csrf=${values.csrf_token}&type=login`
                  return
                })
            }

            // new flow
            if (login_challenge) {
              doConsentProcess(login_challenge as string, subject)
            } else {
              // Original Kratos flow
              if (flow?.return_to) {
                window.location.href = flow?.return_to
                return
              }
              router.push("/profile")
            }
          })
          .catch(handleFlowError(router, "login", setFlow))
          .catch((err: any) => {
            // If the previous handler did not catch the error it's most likely a form validation error
            if (err.response?.status === 400) {
              // Yup, it is!
              if (err && err.response) {
                const nextFlow = err.response?.data
                const [message = { text: "" }] = nextFlow.ui.messages
                if (
                  message.text.includes(
                    "check for spelling mistakes in your password or username, email address, or phone number.",
                  )
                ) {
                  const identifierIndex = nextFlow.ui.nodes.findIndex(
                    (node) => node.attributes.name === "password",
                  )
                  nextFlow.ui.nodes[identifierIndex].messages = [
                    {
                      id: 400007,
                      text: "",
                      type: "error",
                    },
                  ]
                }
                setFlow(nextFlow)
              }
              return
            }
            return Promise.reject(err)
          })
      )
    } catch (error) {
      const errors = handleYupErrors(error)
      if (flow) {
        const nextFlow = cloneDeep(flow)
        if (errors.identifier) {
          const message = {
            id: 4000002,
            text: errors.identifier,
            type: "error",
          }
          const idNodes = nextFlow?.ui?.nodes || []
          const identifierIndex = idNodes.findIndex(
            (node) => node?.attributes?.name === "identifier",
          )
          nextFlow.ui.nodes[identifierIndex].messages = [message]
        } else {
          const idNodes = nextFlow?.ui?.nodes || []
          const identifierIndex = idNodes.findIndex(
            (node) => node?.attributes?.name === "identifier",
          )
          nextFlow.ui.nodes[identifierIndex].messages = nextFlow.ui.nodes[
            identifierIndex
          ].messages.filter((msg) => msg.id !== 4000002)
        }

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
          const idNodes = nextFlow?.ui?.nodes || []
          const identifierIndex = idNodes.findIndex(
            (node) => node?.attributes?.name === "password",
          )
          nextFlow.ui.nodes[identifierIndex].messages = nextFlow.ui.nodes[
            identifierIndex
          ].messages.filter((msg) => msg.id !== 4000002)
        }
        setFlow(nextFlow)
      }

      return false
    }
  }

  if (isEmpty(flow?.ui) || isEmpty(flow?.ui?.action)) return null

  return (
    <>
      <div className="mainWrapper">
        <StyledMenuWrapper>
          <div>
            <title>Sign in - Ory NextJS Integration Example</title>
            <meta name="description" content="NextJS + React + Vercel + Ory" />
          </div>
          <Box display="flex" justifyContent={{ xs: "center", sm: "left" }}>
            <CmidHead />
          </Box>
          <Box fontFamily="Teko" fontSize="36px" color="#717197" mt="62px">
            Welcome back
          </Box>
          {router.query.error && (
            <p style={{ color: "red" }}>{router.query.error}</p>
          )}
          <Flow onSubmit={onSubmit} flow={flow} router={router} />
          <MenuTag />
        </StyledMenuWrapper>
        <MenuFooter Copyright="Copyright© 2023 Cooler Master Inc. All rights reserved." />
      </div>
      <AppsList />
    </>
  )
}

export default Login
