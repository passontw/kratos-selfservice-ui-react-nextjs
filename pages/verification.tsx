import { Box } from "@mui/material"
import { VerificationFlow, UpdateVerificationFlowBody } from "@ory/client"
import { CardTitle } from "@ory/themes"
import { AxiosError } from "axios"
import type { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import queryString from "query-string"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"

import CmidHead from "../components/CmidHead"
import { Flow } from "../components/verification/Flow"
import { ActionCard, CenterLink, MarginCard } from "../pkg"
import ory from "../pkg/sdk"
import { setActiveNav } from "../state/store/slice/layoutSlice"
import { Navs } from "../types/enum"

const Verification: NextPage = () => {
  const dispatch = useDispatch()
  const [initFlow, setInitFlow] = useState(false)
  const [flow, setFlow] = useState<VerificationFlow>()

  // Get ?flow=... from the URL
  const router = useRouter()
  const { flow: flowId, return_to: returnTo, user } = router.query

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
              const { redirect_to } = router.components.query
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

  return (
    <>
      <div className="mainWrapper">
        <div>
          <title>Verify your account - Ory NextJS Integration Example</title>
          <meta name="description" content="NextJS + React + Vercel + Ory" />
        </div>
        <CmidHead />
        <Box mt="62px" display="flex" flexDirection="column">
          <span style={{ color: "#FFF", fontSize: "36px", fontFamily: "Teko" }}>
            Verify Account
          </span>
          <span
            style={{
              color: "#A5A5A9",
              marginBottom: "48px",
              fontFamily: "open sans",
            }}
          >
            Enter the 6-digit code we sent to {email} to verify account.
          </span>
        </Box>
        <Flow onSubmit={onSubmit} flow={flow} hideGlobalMessages />
      </div>
    </>
  )
}

export default Verification
