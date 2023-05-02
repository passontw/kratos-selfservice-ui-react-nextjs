import Box from "@mui/material/Box"
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

import { ActionCard, CenterLink, MarginCard } from "../../pkg"
import ory from "../../pkg/sdk"
import { setActiveStage } from "../../state/store/slice/layoutSlice"
import { Stage } from "../../types/enum"
import Text from "../Text"

import Flow from "./VerificationFlow"

const Verification: NextPage = (props) => {
  const dispatch = useDispatch()
  const { show, close } = props
  console.log("show", show)
  const [initFlow, setInitFlow] = useState(false)
  const [flow, setFlow] = useState<VerificationFlow>()

  // Get ?flow=... from the URL
  const router = useRouter()
  const { flow: flowId, return_to: returnTo, user } = router.query

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
              const { redirect_to } = router.query
              router
                // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
                // their data when they reload the page.
                .push(`/account?flow=${newFlowID}`, undefined, {
                  shallow: true,
                })

              ory
                .getVerificationFlow({ id: newFlowID })
                .then(({ data }) => setFlow(data))
                .catch(error => false)
              return
          }

          throw err
        })
    }
  }, [initFlow, flowId])

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
        returnTo: '/login',
      })
      .then(({ data }) => {
        setFlow(data)
        setInitFlow(true)
      })
      .catch((err: any) => {
        switch (err.response?.status) {
          case 400:
            // Status code 400 implies the user is already signed in
            return router.push("/login")
        }

        throw err
      })
  }, [flowId, router, router.isReady, returnTo, flow])

  const onSubmit = async (values: UpdateVerificationFlowBody) => {
    await router
      // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
      // their data when they reload the page.
      .push(`/account?${queryString.stringify(router.query)}`, undefined, {
        shallow: true,
      })

    ory
      .updateVerificationFlow({
        flow: String(flow?.id),
        updateVerificationFlowBody: values,
      })
      .then(({ data }) => {
        props.deleteAccount()
        // Form submission was successful, show the message to the user!
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
    <Box display={show ? "block" : "none"}>
      <Box
        width="100%"
        maxWidth="438px"
        bgcolor="#272735"
        p="0 32px 32px 32px"
        borderRadius="12px"
        position="fixed"
        top="35vh"
        left="50%"
        marginLeft="-219px"
      >
        <Head>
          <title>Verify your account - Ory NextJS Integration Example</title>
          <meta name="description" content="NextJS + React + Vercel + Ory" />
        </Head>
        <Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text size="20px" my="32px" color="#FFF">
              Delete Account
            </Text>
            {/* <Box
              color="#FFF"
              onClick={() => {
                dispatch(setActiveStage(Stage.NONE))
                router.push("/account")
                close()
              }}
            >
              X
            </Box> */}
          </Box>

          <Text>
            Enter the 6-digit code we sent to master123@gmail.com to finish the
            deletion process.
          </Text>
          <Flow onSubmit={onSubmit} flow={flow} />
        </Box>
      </Box>
    </Box>
  )
}

export default Verification
