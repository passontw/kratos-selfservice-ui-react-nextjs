import { Box } from "@mui/material"
import { VerificationFlow, UpdateVerificationFlowBody } from "@ory/client"
import { AxiosError } from "axios"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import queryString from "query-string"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import isEmpty from 'lodash/isEmpty'
import cloneDeep from 'lodash/cloneDeep'
import CmidHead from "../components/CmidHead"
import MenuFooter from "../components/MenuFooter"
import { Flow } from "../components/verification/Flow"
import ory from "../pkg/sdk"
import {
  selectSixDigitCode,
  setActiveNav,
} from "../state/store/slice/layoutSlice"
import { Navs } from "../types/enum"

import { StyledMenuWrapper } from "./../styles/share"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import LinkNav from '../components/LinkNav'

const dayjs = require("dayjs")
const utc = require("dayjs/plugin/utc")
const timezone = require("dayjs/plugin/timezone") // dependent on utc plugin

dayjs.extend(utc)
dayjs.extend(timezone)

const localStorageKey = "!@#$%^&*()data"
const registeLocalStorageKey = "!@#$%^&*()registedata"

const { NEXT_PUBLIC_REDIRECT_URI } = process.env

const getReturnToUrl = (returnTo, type, path: string) => {
  if (returnTo) return returnTo;
  if (type === 'registe') return path;
  if (type === 'continueregiste') return path
  return path;
}

const Verification: NextPage = (props: any) => {
  const { lang } = props
  const dispatch = useDispatch()
  const sixDigitCode = useSelector(selectSixDigitCode)
  const [initFlow, setInitFlow] = useState(false)
  const [flow, setFlow] = useState<VerificationFlow>()
  const [verifySuccess, setVerifySuccess] = useState(false)

  // Get ?flow=... from the URL
  const router = useRouter()
  const locale = router.locale
  let path ='/profile'

  if (locale && locale !== 'en') {
    path =`/${locale}${path}`
  }
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
    user,
    type,
  } = router.query

  const email = router.query.user as string
  const returnToUrl = getReturnToUrl(returnTo, type, path);

  useEffect(() => {
    dispatch(setActiveNav(Navs.VERIFICATION))
  }, [])

  // directly initializing verifcation flow by entering user's email carried here from previous step
  useEffect(() => {
    // pull the generated csrf token provided by kratos from the hidden input field
    const csrf = document.querySelector(
      'input[name="csrf_token"]',
    ) as HTMLInputElement
    const csrf_token = csrf?.value
    // if user email was attached then this followed from the correct previous step
    if (user && flow) {
      ory
        .updateVerificationFlow({
          flow: String(flow?.id),
          updateVerificationFlowBody: {
            csrf_token: csrf_token,
            email: typeof user === "string" ? user : "",
            method: "code",
          },
        })
        .then(({ data }) => {
          // Form submission was successful, show the message to the user!
          setFlow(data)
        })
        .catch((err: any) => {
          switch (err.response?.status) {
            case 400:
              // Status code 400 implies the form validation had an error
              setFlow(err.response?.data)
              return
            case 410:
              const newFlowID = err.response.data.use_flow_id
              const nextQuery = {
                flow: newFlowID,
                return_to: returnTo,
              };
              router
                // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
                // their data when they reload the page.
                .push(`/verification?${queryString.stringify(nextQuery)}`, undefined, {
                  shallow: true,
                })

              ory
                .getVerificationFlow({ id: newFlowID })
                .then(({ data }) => setFlow(data))
              return
          }

          throw err
        })
    }
  }, [initFlow])

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      ory
        .getVerificationFlow({ id: String(flowId) })
        .then(({ data }) => {
          setFlow(data)
          setInitFlow(true)
        })
        .catch((err: AxiosError) => {
          switch (err.response?.status) {
            case 410:
            // Status code 410 means the request has expired - so let's load a fresh flow!
            case 403:
              // Status code 403 implies some other issue (e.g. CSRF) - let's reload!
              const nextQuery = {
                return_to: returnTo,
              };
              return router.push(`/verification?${queryString.stringify(nextQuery)}`)
          }

          throw err
        })
      return
    }

    
    // Otherwise we initialize it
    ory
      .createBrowserVerificationFlow({
        returnTo: returnToUrl,
      })
      .then(({ data }) => {
        setFlow(data)
        setInitFlow(true)
      })
      .catch((err: any) => {
        switch (err.response?.status) {
          case 400:
            // Status code 400 implies the user is already signed in
            return router.push("/")
        }

        throw err
      })
  }, [flowId, router, router.isReady, returnTo, flow])

  const validateDiffMinute = (setFlow, flow, diffMinute) => {
    if (isEmpty(flow)) return false;
    if (diffMinute < 5) return true;

    const nextFlow = cloneDeep(flow);
    const identifierIndex = nextFlow.ui.nodes.findIndex(
      (node) => node.attributes.name === "code",
    )
    if (identifierIndex === -1) return true;
    nextFlow.ui.nodes[identifierIndex].messages = [{
      id: 400009,
      text: lang?.verifyCodeInvalid || 'Verification code is no longer valid, please try again.',
      type: 'error'
    }]
    setFlow(nextFlow)
    return false;
  }

  const onSubmit = async (values: UpdateVerificationFlowBody, isResendCode) => {
    const {
      code,
      email,
      csrf_token,
      method,
    } = values;
    
    if (flow.state === "sent_email" && isEmpty(values.code) && isEmpty(values.email)) {
      return null;
    }

    const nextValues = isResendCode ? {
      email,
      csrf_token,
      method,
    } : {
      code,
      csrf_token,
      method,
    };

    if (!isResendCode) {
      const createdTimeDayObject = dayjs(flow.issued_at)
      const diffMinute = dayjs().diff(createdTimeDayObject, "minute")
      
      const isValidate = validateDiffMinute(setFlow, flow, diffMinute);
      if (!isValidate) {
        const nextFlow = cloneDeep(flow);
        const identifierIndex = nextFlow.ui.nodes.findIndex(
          (node) => node.attributes.name === "code",
        )
        if (identifierIndex !== -1) {
          nextFlow.ui.messages = [];
          nextFlow.ui.nodes[identifierIndex].messages = [{
            id: 400002,
            text: lang?.verifyCodeInvalid || "Verification code is no longer valid, please try again.",
            type: "error",
          }]
          setFlow(nextFlow)
          return;
        }
      } else {
        const nextFlow = cloneDeep(flow);
        const identifierIndex = nextFlow.ui.nodes.findIndex(
          (node) => node.attributes.name === "code",
        )
        if (identifierIndex !== -1) {
          nextFlow.ui.messages = [];
          nextFlow.ui.nodes[identifierIndex].messages = []
          setFlow(nextFlow)
        }
      }
    }

    await router
      // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
      // their data when they reload the page.
      .push(
        `/verification?${queryString.stringify({
          ...router.query,
          flow: flow?.id,
        })}`,
        undefined,
        { shallow: true },
      )

    return  await ory
      .updateVerificationFlow({
        flow: String(flow?.id),
        updateVerificationFlowBody: nextValues,
      })
      .then(({ data }) => {
        // Form submission was successful, show the message to the user!
        setVerifySuccess(data.state === "passed_challenge")

        const [message = {text: ''}] = data.ui.messages;
        const nextFlow = cloneDeep(data);

        if (message.text.includes("The verification code is invalid or has already been used")) {
          
          const identifierIndex = nextFlow.ui.nodes.findIndex(
            (node) => node.attributes.name === "code",
          )

          if (identifierIndex !== -1) {
            nextFlow.ui.nodes[identifierIndex].messages = [message]
            nextFlow.ui.messages = []
          }
        }
        setFlow(nextFlow)
        
        if (data.state === "passed_challenge" && ['login', 'registe'].includes(type)) {
          const key = type === 'registe' ? registeLocalStorageKey: localStorageKey
          const values = JSON.parse(localStorage.getItem(key))

          return ory.createBrowserLoginFlow({
            refresh: Boolean(refresh),
            aal: aal ? String(aal) : undefined,
            returnTo: Boolean(login_challenge)
              ? NEXT_PUBLIC_REDIRECT_URI
              : returnToUrl,
          }).then(({ data }) => {
            const csrfNode = data.ui.nodes.find(node => node.attributes.name === "csrf_token")
            const nextValues = type === 'registe'
            ? {
              identifier: values['traits.email'],
              method: 'password',
              password: values.password,
            }
            : values
            return ory
              .updateLoginFlow({
                flow: String(data?.id),
                updateLoginFlowBody: { ...nextValues, csrf_token: csrfNode?.attributes.value },
              }).then(() => flow)
          }).then(flow => {
            if (type !== 'registe') {
              router.replace(returnToUrl)
              return;
            }
            if (type === 'registe') {
              setTimeout(() => router.replace(returnToUrl), 2000)
              return;
            }

          }).catch(error => {
            console.log(error)
          })
          return;
        }
      })
      .catch((err: any) => {
        switch (err.response?.status) {
          case 400:
            // Status code 400 implies the form validation had an error
            setFlow(err.response?.data)
            return
          case 410:
            const newFlowID = err.response.data.use_flow_id
            router
              // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
              // their data when they reload the page.
              .push(`/verification?${queryString.stringify({flow: newFlowID})}`, undefined, {
                shallow: true,
              })

            ory
              .getVerificationFlow({ id: newFlowID })
              .then(({ data }) => setFlow(data))
            return
        }

        throw err
      })
  }

  return (
    <>
      <div className="mainWrapper">
        <StyledMenuWrapper>
          <div>
            <title>Verify your account - Master ID</title>
            <meta name="description" content="Master ID" />
          </div>
          <CmidHead />
          <Box display="flex" justifyContent="center">
            <Box width={{ xs: "100%", sm: "400px"}}>
              <Box mt="62px" display="flex" flexDirection="column">
              <span style={{ color: "#FFF", fontSize: "36px", fontFamily: "Teko" }}>
                {verifySuccess ? lang?.verifySucess || "Verified Success" : 
                  lang?.verifyAccount || "Verify Account"}
              </span>
              <span
                style={{
                  color: "#A5A5A9",
                  marginBottom: "48px",
                  fontFamily: "open sans",
                  fontSize: "14px",
                }}
              >
                {verifySuccess
                  ? lang?.verifySucessDesc || "Congratulation, your account is approved. You will be automatically redirected to %service% in 5 seconds."
                  : lang?.verifyAcctDesc.replace("master123@gmail.com", `${!isEmpty(email) ? email : ''}`) || `Enter the 6-digit code we sent to ${!isEmpty(email) ? email : ''} to verify account.`}
              </span>
            </Box>
            <Flow
              onSubmit={onSubmit}
              flow={flow}
              code={sixDigitCode}
              lang={lang}
              returnTo={returnTo}
              type={type}
              // hideGlobalMessages
            />
            </Box>
          </Box>        
          <MenuFooter Copyright="Copyright© 2023 Cooler Master Inc. All rights reserved." />
          <LinkNav />
        </StyledMenuWrapper>
      </div>
      {/* <AppsList /> */}
    </>
  )
}

export default Verification

export async function getStaticProps({ locale } : any) {
  return {
    props: {...(await serverSideTranslations(locale, ['common']))},
  }
}
