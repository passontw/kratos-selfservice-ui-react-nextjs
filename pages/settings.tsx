import axios from "axios"
import Box from "@mui/material/Box"
import { SettingsFlow, UpdateSettingsFlowBody } from "@ory/client"
import cloneDeep from "lodash/cloneDeep"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"
import { useDispatch } from "react-redux"

import LinkNav from "../components/LinkNav"
import MenuFooter from "../components/MenuFooter"
import Flow from "../components/changepassword/Flow"
import { Methods, LogoutLink } from "../pkg"
import { handleFlowError } from "../pkg/errors"
import ory from "../pkg/sdk"
import Cmid from "../public/images/app_icons/Cmid"
import { setActiveNav, setActiveStage } from "../state/store/slice/layoutSlice"
import { Navs, Stage } from "../types/enum"
import { updateSettingsPasswordSchema } from "../util/schemas"
import { handleYupSchema, handleYupErrors } from "../util/yupHelpers"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import Head from 'next/head'

interface Props {
  flow?: SettingsFlow
  only?: Methods
}

function SettingsCard({
  flow,
  only,
  children
}: Props & { children: ReactNode }) {
  console.log("🚀 ~ file: settings.tsx:35 ~ global?.window?.history:", global?.window?.history)
  useEffect(() => {

    global.window.addEventListener('popstate', env => {
      console.log("🚀 ~ file: settings.tsx:40 ~ unlisten ~ action:")
    })
    // const unlisten = global.window.history.listen((location, action) => {
    //   if (action === 'POP') {
    //     console.log("🚀 ~ file: settings.tsx:40 ~ unlisten ~ action:", action)
    //     // do something when the user clicks the back button
    //   }
    // });
    return () => {
      global.window.removeEventListener('popstate', () => false);
    }
  }, [global?.window?.history]);
  
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

const handleRouteChange = (url) => {
  console.log("🚀 ~ file: settings.tsx:80 ~ handleRouteChange ~ url:", url)
}

const Settings: NextPage = (props) => {
  const { lang } = props
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
    axios.get("/api/.ory/sessions/whoami", {
      headers: { withCredentials: true },
    }).then(resp => {
      const { authentication_methods } = resp.data;

      const [authenticationMethod] = authentication_methods;

      if (authenticationMethod.method !== "code_recovery") {
        ory.createBrowserLogoutFlow()
          .then(({ data }) => {
            return ory.updateLogoutFlow({ token: data.logout_token })
              .then(() => router.push("/login"))
              .then(() => router.reload())
          }).catch(error => router.push("/login"))
      }
      return Promise.resolve();
    }).catch(error => router.replace("/login"))

    router.events.on('routeChangeStart', handleRouteChange)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [])

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      ory.getSettingsFlow({ id: String(flowId) })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleFlowError(router, "settings", setFlow))
        .catch(error => false)
      return
    }

    // Otherwise we initialize it
    ory.createBrowserSettingsFlow({
        returnTo: returnTo ? String(returnTo) : undefined,
      })
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(handleFlowError(router, "settings", setFlow))
      .catch(error => false)
  }, [flowId, router, router.isReady, returnTo, flow])

  const onSubmit = async (values: UpdateSettingsFlowBody, confirmPassword) => {
    try {
      await handleYupSchema(updateSettingsPasswordSchema, {
        confirmPassword,
        password: values.password === "" ? undefined : values.password,
      })

      const locale = router.locale
      let settingsPath = '/settings'
      let loginPath = '/login'

      if (locale && locale !== 'en') {
        settingsPath = `/${locale}${settingsPath}`
        loginPath = `/${locale}${loginPath}`
      }

      // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
      // his data when she/he reloads the page.
      // .push(`/settings?flow=${flow?.id}`, undefined, { shallow: true })
      router.push(`${settingsPath}?flow=${flow?.id}`, undefined, { shallow: true })
        .then(() =>
          ory.updateSettingsFlow({
              flow: String(flow?.id),
              updateSettingsFlowBody: values,
            })
            .then(({ data }) => {
              // The settings have been saved and the flow was updated. Let's show it to the user!
              setFlow(data)
              onLogout()
              // router.push("/login")
              router.push(loginPath)
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
      <Box
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent={{ xs: "center", sm: "left" }}
        width="100%"
        gap="16px"
        padding={{ xs: "35px 0px 0px", sm: "48px 0px 0px 48px" }}
        zIndex={1}
      >
        <Head>
          <title>{`${lang?.changePw} - Master ID`}</title>
          <meta name="description" content="Master ID" />
        </Head>
        <Cmid />
        <Box
          fontFamily="Teko"
          fontSize={{ xs: "24px", sm: "32px" }}
          color="#fff"
          lineHeight="44px"
          textTransform="uppercase"
        >
          Master ID
        </Box>
      </Box>
      <div
        style={{
          position: "absolute",
          background:
            "linear-gradient(180deg, rgba(29, 29, 40, 0.2) -23.39%, #1D1D28 50%);",
          height: "100vh",
          width: "100vw",
        }}
      ></div>
      <div className="resetWrapper">
        <SettingsCard only="password" flow={flow}>
          <Box>
            <Box fontSize="20px" fontFamily="open sans" color="#FFF" mb="24px">
              {lang?.changePw}
            </Box>
            {/* <Messages messages={flow?.ui.messages} /> */}
            <Flow
              hideGlobalMessages
              confirmPasswordError={confirmPasswordError}
              onSubmit={onSubmit}
              only="password"
              flow={flow}
              lang={lang}
            />
          </Box>
        </SettingsCard>
      </div>
      <MenuFooter Copyright="Copyright© 2023 Cooler Master Inc. All rights reserved." />
      <LinkNav />
      <div className="background-wrapper">
        <div className="overlay-image"></div>
      </div>
    </>
  )
}

export default Settings

export async function getStaticProps({ locale }: any) {
  return {
    props: { ...(await serverSideTranslations(locale, ['common'])) },
  }
}
