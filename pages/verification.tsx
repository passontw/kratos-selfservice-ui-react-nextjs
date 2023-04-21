import { Box } from "@mui/material"
import { VerificationFlow, UpdateVerificationFlowBody } from "@ory/client"
import { AxiosError } from "axios"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import queryString from "query-string"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import CmidHead from "../components/CmidHead"
import { Flow } from "../components/verification/Flow"
import ory from "../pkg/sdk"
import {
  selectSixDigitCode,
  setActiveNav,
} from "../state/store/slice/layoutSlice"
import { Navs } from "../types/enum"

import { StyledMenuWrapper } from "./../styles/share"

const localStorageKey = "!@#$%^&*()data"

const { NEXT_PUBLIC_REDIRECT_URI } = process.env

const Verification: NextPage = () => {
  const dispatch = useDispatch()
  const sixDigitCode = useSelector(selectSixDigitCode)
  const [initFlow, setInitFlow] = useState(false)
  const [flow, setFlow] = useState<VerificationFlow>()
  const [verifySuccess, setVerifySuccess] = useState(false)

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
    user,
    type,
  } = router.query

  const email = router.query.user as string

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
              router
                // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
                // their data when they reload the page.
                .push(`/verification?flow=${newFlowID}`, undefined, {
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
              return router.push("/verification")
          }

          throw err
        })
      return
    }

    // Otherwise we initialize it
    ory
      .createBrowserVerificationFlow({
        returnTo: returnTo ? String(returnTo) : undefined,
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

  const onSubmit = async (values: UpdateVerificationFlowBody) => {
    await router
      // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
      // their data when they reload the page.
      .push(
        `/verification?${queryString.stringify(router.query)}&flow=${flow?.id}`,
        undefined,
        { shallow: true },
      )

    ory
      .updateVerificationFlow({
        flow: String(flow?.id),
        updateVerificationFlowBody: values,
      })
      .then(({ data }) => {
        // Form submission was successful, show the message to the user!
        console.log("data", data)
        setVerifySuccess(data.state === "passed_challenge")
        setFlow(data)
        if (type === "login") {
          const values = JSON.parse(localStorage.getItem(localStorageKey))
          ory
            .createBrowserLoginFlow({
              refresh: Boolean(refresh),
              aal: aal ? String(aal) : undefined,
              returnTo: Boolean(login_challenge)
                ? NEXT_PUBLIC_REDIRECT_URI
                : undefined,
            })
            .then(({ data }) => {
              const csrfNode = data.ui.nodes.find(
                (node) => node.attributes.name === "csrf_token",
              )

              return ory
                .updateLoginFlow({
                  flow: String(data?.id),
                  updateLoginFlowBody: {
                    ...values,
                    csrf_token: csrfNode?.attributes.value,
                  },
                })
                .then(() => flow)
            })
            .then((flow) => {
              if (flow?.return_to) {
                window.location.href = flow?.return_to
                return
              }
              router.push("/profile")
            })
            .catch((error) => {
              console.log(error)
            })
          return
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
              .push(`/verification?flow=${newFlowID}`, undefined, {
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
            <title>Verify your account - Ory NextJS Integration Example</title>
            <meta name="description" content="NextJS + React + Vercel + Ory" />
          </div>
          <CmidHead />
          <Box mt="62px" display="flex" flexDirection="column">
            <span
              style={{ color: "#FFF", fontSize: "36px", fontFamily: "Teko" }}
            >
              {verifySuccess ? "Verified Success" : "Verify Account"}
            </span>
            <span
              style={{
                color: "#A5A5A9",
                marginBottom: "48px",
                fontFamily: "open sans",
              }}
            >
              {verifySuccess
                ? "Congratulation, your account is approved"
                : `Enter the 6-digit code we sent to ${email} to verify account.`}
            </span>
          </Box>
          <Flow
            onSubmit={onSubmit}
            flow={flow}
            code={sixDigitCode}
            // hideGlobalMessages
          />
        </StyledMenuWrapper>
      </div>
    </>
  )
}

export default Verification
