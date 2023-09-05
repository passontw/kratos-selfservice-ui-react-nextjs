import Box from "@mui/material/Box"
import { RegistrationFlow } from "@ory/client"
import cloneDeep from "lodash/cloneDeep"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import parse from 'html-react-parser';

import CmidHead from "../components/CmidHead"
import MenuFooter from "../components/MenuFooter"
import { Flow } from "../pkg"
import { handleFlowError } from "../pkg/errors"
// Import the SDK
import ory from "../pkg/sdk"
import {
  setActiveNav,
  setLockCodeResend,
} from "../state/store/slice/layoutSlice"
import { StyledMenuWrapper } from "../styles/share"
import { Navs } from "../types/enum"
import { registrationFormSchema } from "../util/schemas"
import { handleYupSchema, handleYupErrors } from "../util/yupHelpers"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import queryString from "query-string"
import LinkNav from '../components/LinkNav'
import { Ring } from '@uiball/loaders'
import Head from 'next/head'

const localStorageKey = "!@#$%^&*()registedata"

const getTraitsSource = (method: string, provider: string) =>  {
  if (method === "password") return 0;
  if (provider === "google") return 1;
  return 2;
}

const getNextFlow = (flow) => {
  if (!flow) return flow
  if (!flow?.ui?.nodes) return flow

  const nextNodes = flow.ui.nodes.filter((node) => {
    if (node.attributes.name === "traits.avatar") return false
    if (node.attributes.name === "traits.loginVerification") return false
    if (node.attributes.name === "traits.location") return false
    return true
  })

  return {
    ...flow,
    ui: {
      ...flow.ui,
      nodes: nextNodes,
    },
  }
}

// Renders the registration page
const Registration: NextPage = (props) => {
  const { lang } = props
  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    localStorage.removeItem(localStorageKey)
    dispatch(setActiveNav(Navs.REGISTER))
    dispatch(setLockCodeResend(false))
  }, [])

  // The "flow" represents a registration process and contains
  // information about the form we need to render (e.g. username + password)
  const [flow, setFlow] = useState<RegistrationFlow>()

  // Get ?flow=... from the URL
  const { flow: flowId, return_to: returnTo } = router.query

  // In this effect we either initiate a new registration flow, or we fetch an existing registration flow.
  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      ory.getRegistrationFlow({ id: String(flowId) })
        .then(({ data }) => {
          // We received the flow - let's use its data and render the form!
          setFlow(data)
        })
        .catch(handleFlowError(router, "login", setFlow))
      return
    }

    const locale = router.locale
    let path = "/profile"
    if (locale && locale !== "en") {
      path = `/${locale}${path}`
    }

    // Otherwise we initialize it
    ory.createBrowserRegistrationFlow({
        returnTo: returnTo ? String(returnTo) : path,
      })
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(handleFlowError(router, "registration", setFlow))
  }, [flowId, router, router.isReady, returnTo, flow])

  
  const onSubmit = async (values: any) => {
    try {
      if (!values.provider) {
        await handleYupSchema(registrationFormSchema, values)
      }
      console.log("handleYupSchema success")
      values["traits.source"] = getTraitsSource(values.method, values.provider);
      console.log("getTraitsSource success")
      return (
        // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
        // his data when she/he reloads the page.
        router.push(`/registration?flow=${flow?.id}`, undefined, { shallow: true })
          .then(() =>
            ory.updateRegistrationFlow({
                flow: String(flow?.id),
                updateRegistrationFlowBody: values,
              })
              // .then(({data}) => {
              //   return ory
              //     .createBrowserLogoutFlow()
              //     .then(({ data: logoutFlow }) => {
              //       return ory.updateLogoutFlow({
              //         token: logoutFlow.logout_token,
              //       })
              //     }).then(() => ({data}));
              // })
              .then( async ({ data }) => {
                localStorage.setItem(localStorageKey, JSON.stringify(values));
                if (data.continue_with) {
                  for (const item of data.continue_with) {
                    switch (item.action) {
                      case "show_verification_ui":
                        const nextQuery = {
                          flow: item.flow.id,
                          return_to: returnTo,
                          type: "registe",
                        };

                        if (values.method === "password") {
                          nextQuery.email = values["traits.email"]
                        }
                        await router.push(`/verification?${queryString.stringify(nextQuery)}`)
                        return
                    }
                  }
                }
        
                // If continue_with did not contain anything, we can just return to the home page.
                await router.push(returnTo || "/")
              })
              .catch(handleFlowError(router, "registration", setFlow))
              .catch((err: any) => {
                // if (err) {
                // If the previous handler did not catch the error it's most likely a form validation error
                if (err.response?.status === 400) {
                  // Yup, it is!
                  const nextFlow = err.response?.data
                  const [message = { text: "" }] = nextFlow.ui.messages
                  if (
                    message.text.includes("An account with the same identifier")
                  ) {
                    const identifierIndex = nextFlow.ui.nodes.findIndex(
                      (node) => node.attributes.name === "traits.email",
                    )
                    nextFlow.ui.nodes[identifierIndex].messages = [
                      {
                        id: 400007,
                        text: "",
                        type: "error",
                      },
                    ]
                    
                    nextFlow.ui.messages = [{
                      id: 400007,
                      text: lang?.emailAlreadyExists || "Email account already existed.Please try login or forgot password.",
                      type: "error",
                    }];
                  } else {
                    const identifierIndex = nextFlow.ui.nodes.findIndex(
                      (node) => node.attributes.name === "traits.email",
                    )
                    nextFlow.ui.nodes[identifierIndex].messages = []
                    
                    nextFlow.ui.messages = [];
                  }
                  setFlow(err.response?.data)
                  return
                }

                return Promise.reject(err)
                // }
              }),
          )
      )
    } catch (error) {
      const errors = handleYupErrors(error)
      const nextFlow = cloneDeep(flow)
      nextFlow.ui.messages = []
      console.log("handleYupErrors", JSON.stringify(errors))

      if (errors['["traits.name"]']) {
        const message = {
          id: 4000002,
          text: errors['["traits.name"]'],
          type: "error",
        }
        const identifierIndex = nextFlow.ui.nodes.findIndex(
          (node) => node.attributes.name === "traits.name",
        )

        const errorMessage = nextFlow.ui.nodes[identifierIndex].messages.find(
          (msg) => msg.id === message.id,
        )

        if (!errorMessage) {
          const preMessages = nextFlow.ui.nodes[identifierIndex].messages
          nextFlow.ui.nodes[identifierIndex].messages = [
            ...preMessages,
            message,
          ]
        }
      } else {
        const identifierIndex = nextFlow.ui.nodes.findIndex(
          (node) => node.attributes.name === "traits.name",
        )
        const nextMessages = nextFlow.ui.nodes[identifierIndex].messages.filter(
          (message) => message.type !== "error",
        )
        nextFlow.ui.nodes[identifierIndex].messages = nextMessages
      }

      const emailKey = errors['["traits.email"]']
        ? '["traits.email"]'
        : "[traits.email]"
      if (errors[emailKey]) {
        const message = {
          id: 4000002,
          text: errors[emailKey],
          type: "error",
        }

        const identifierIndex = nextFlow.ui.nodes.findIndex(
          (node) => node.attributes.name === "traits.email",
        )

        const errorMessage = nextFlow.ui.nodes[identifierIndex].messages.find(
          (msg) => msg.id === message.id,
        )

        nextFlow.ui.nodes[identifierIndex].messages = [message]
      } else {
        const identifierIndex = nextFlow.ui.nodes.findIndex(
          (node) => node.attributes.name === "traits.email",
        )
        const nextMessages = nextFlow.ui.nodes[identifierIndex].messages.filter(
          (message) => message.type !== "error",
        )
        nextFlow.ui.nodes[identifierIndex].messages = nextMessages
      }

      if (errors.password) {
        const passwordMessage = {
          id: 4000002,
          text: errors.password,
          type: "error",
        }
        const passwordIndex = nextFlow.ui.nodes.findIndex(
          (node) => node.attributes.name === "password",
        )
        nextFlow.ui.nodes[passwordIndex].messages = [passwordMessage]
      } else {
        const passwordIndex = nextFlow.ui.nodes.findIndex(
          (node) => node.attributes.name === "password",
        )
        nextFlow.ui.nodes[passwordIndex].messages = []
      }

      setFlow(nextFlow)
      // setErrors(errors);
      return false
    }
  }

  const nextFlow = getNextFlow(flow)

  const replaceTermsAndPolicy = (text) => {
    const lang = router.locale === "en" ? " ": "/" + router.locale
    const replacedText = text
      .replace(/#(.*?)#/g, `<a href="${lang}/termsofuseagreement" target="_blank" class="link">$1</a>`)
      .replace(/@(.*?)@/g, `<a href="${lang}/privacypolicy" target="_blank" class="link">$1</a>`);
    return replacedText;
  };

  const formattedHint = replaceTermsAndPolicy(lang?.agreePolicyHint)?.replace(/\n/g, '<br/>');

  return (
    <>
      <div className="mainWrapper">
        <StyledMenuWrapper>
          <Head>
            <title>{`${lang?.signUp} - Master ID`}</title>
            <meta name="description" content={lang?.masterIdDesc 
              || "One account is all you need. Start your virtual adventure."} />
          </Head>
          {/* <MarginCard> */}
          {/* <CardTitle>Create account</CardTitle> */}
          <CmidHead />
          <Box display="flex" justifyContent="center">
            <Box width={{ xs: "100%", sm: "480px"}}>
              <Box fontFamily="Teko" fontSize="36px" color="#FFF" mt="62px">
                {lang?.joinUs}
              </Box>
              {flow ? 
                  <Flow onSubmit={onSubmit} flow={nextFlow} router={router} lang={lang} /> :
                  <Box 
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="90px">
                    <Ring 
                      size={40}
                      lineWeight={5}
                      speed={2} 
                      color="#A62BC3" 
                    />
                  </Box>}
                  {/* Moblie Terms Start */}
                  <Box
                    mt="30px"
                    color="#A5A5A9"
                    fontSize="14px"
                    fontFamily="open sans"
                    justifyContent="center"
                    display={{ xs: "flex", md: "none" }}
                    flexWrap="wrap"
                    // whiteSpace="nowrap"
                    textAlign="center"
                  >
                  <Box />
                  <div>{parse(formattedHint)}</div>
              </Box>
              {/* Mobile Terms End */}
              {/* <StyledAppItemWrap>
                <AppItem appIcon="MasterControl" appName="Master Control" mobile />
                <AppItem appIcon="Stormplay" appName="Stormplay" mobile />
                <AppItem appIcon="Cmodx" appName="CMODX" mobile />
              </StyledAppItemWrap> */}
              {/* Desktop Terms Start */}
              <Box
                mt="30px"
                color="#A5A5A9"
                fontSize="14px"
                fontFamily="open sans"
                justifyContent="center"
                flexWrap="wrap"
                paddingBottom="86px"
                whiteSpace="nowrap"
                textAlign="center"
                display={{ xs: "none", md: "flex" }}
              >
                <Box />
                  <div dangerouslySetInnerHTML={{ __html: formattedHint }} />
                </Box>
                {/* Desktop Terms End */}
            </Box>
          </Box>        
        </StyledMenuWrapper>
        <MenuFooter Copyright="Copyright© 2023 Cooler Master Inc. All rights reserved." />
        <LinkNav />
      </div>
      {/* <AppsList /> */}
    </>
  )
}

export default Registration

export async function getStaticProps({ locale } : any) {
  return {
    props: {...(await serverSideTranslations(locale, ['common']))},
  }
}