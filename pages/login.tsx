import Box from "@mui/material/Box"
import { LoginFlow } from "@ory/client"
import { Checkbox } from "@ory/themes"
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
import CmidHead from "../components/CmidHead"
import MenuFooter from "../components/MenuFooter"
import MenuTag from "../components/MenuTag"
import { LogoutLink, Flow } from "../pkg"
import { handleGetFlowError, handleFlowError } from "../pkg/errors"
import ory from "../pkg/sdk"
import { selectActiveNav, setActiveNav } from "../state/store/slice/layoutSlice"
import { Navs } from "../types/enum"
import { loginFormSchema } from "../util/schemas"
import { handleYupSchema, handleYupErrors } from "../util/yupHelpers"

import { StyledMenuWrapper } from "./../styles/share"

const localStorageKey = "!@#$%^&*()data"

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
          : undefined,
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

  useEffect(() => {
    dispatch(setActiveNav(Navs.LOGIN))
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

      return (
        ory
          .updateLoginFlow({
            flow: String(flow?.id),
            updateLoginFlowBody: values,
          })

          // We logged in successfully! Let's bring the user home.
          .then((result) => {
            const { session } = result.data
            const { traits } = session.identity
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
              // console.log("data", data)
              // console.log("flow", flow)
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
                setFlow(err.response?.data)
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

      // setErrors(errors);
      return false
    }
  }

  if (isEmpty(flow?.ui)) return null

  return (
    <>
      {/* CUSTOMIZE UI BASED ON CLIENT ID */}
      {/* <Head>
        <title>Sign in - Ory NextJS Integration Example</title>
        <meta name="description" content="NextJS + React + Vercel + Ory" />
      </Head> */}
      <div className="mainWrapper">
        <StyledMenuWrapper>
          <div>
            <title>Sign in - Ory NextJS Integration Example</title>
            <meta name="description" content="NextJS + React + Vercel + Ory" />
          </div>
          {/* <MarginCard> */}
          {/* <CardTitle>
        {(() => {
          if (flow?.refresh) {
            return "Confirm Action"
          } else if (flow?.requested_aal === "aal2") {
            return "Two-Factor Authentication"
          }
          return "Sign In (ID can be Email or Username)"
        })()}
        </CardTitle> */}
          <CmidHead />
          <Box fontFamily="Teko" fontSize="36px" color="#717197" mt="62px">
            Welcome back
          </Box>
          {/* <Box>
            <label className="customSwitch">
              <Checkbox
                style={{ display: "block" }}
                name={"check"}
                defaultChecked={false}
                onChange={(e) => {}}
                disabled={false}
                state={undefined}
                // subtitle={"123"}
              />
              <span className="customSwitchSlider round"></span>
            </label>
          </Box> */}

          <Flow onSubmit={onSubmit} flow={flow} router={router} />

          <MenuTag />
        </StyledMenuWrapper>
        <MenuFooter Copyright="Copyright© 2023 Cooler Master Inc. All rights reserved." />
      </div>
    </>
  )
}

export default Login
