import Box from "@mui/material/Box"
import { VerificationFlow, UpdateVerificationFlowBody } from "@ory/client"
import { AxiosError } from "axios"
import cloneDeep from "lodash/cloneDeep"
import isEmpty from "lodash/isEmpty"
import type { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import queryString from "query-string"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Ring } from '@uiball/loaders'

import ory from "../../pkg/sdk"
import {
  selectSixDigitCode,
  setDialog,
} from "../../state/store/slice/layoutSlice"
import Text from "../Text"

import DeleteAccConfirm from "./DeleteAccConfirm"
import Flow from "./VerificationFlow"

const dayjs = require("dayjs")
const utc = require("dayjs/plugin/utc")
const timezone = require("dayjs/plugin/timezone") // dependent on utc plugin

dayjs.extend(utc)
dayjs.extend(timezone)

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
    text: 'Verification code is no longer valid',
    type: 'error'
  }]
  setFlow(nextFlow)
  return false;
}

const Verification: NextPage = (props) => {
  const { show, close } = props
  const [initFlow, setInitFlow] = useState(false)
  const [flow, setFlow] = useState<VerificationFlow>()

  // Get ?flow=... from the URL
  const router = useRouter()
  const dispatch = useDispatch()
  const sixDigitCode = useSelector(selectSixDigitCode)
  const email = router.query.user as string
  const { flow: flowId, return_to: returnTo, user } = router.query

  const deleteAccountPromt = async () => {
    close()
    dispatch(
      setDialog({
        title: "Delete Account",
        titleHeight: "56px",
        width: 480,
        // height: 238,
        center: true,
        children: <DeleteAccConfirm confirmDelete={props.deleteAccount} />,
      }),
    )
  }

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
                .catch((error) => false)
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
              return router.push("/account")
            default:
              return router.push("/account")
          }

          throw err
        })
      return
    }

    // Otherwise we initialize it
    ory
      .createBrowserVerificationFlow({
        returnTo: "/login",
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
    const { user } = router.query
    const { code = "" } = values
    const nextFlow = cloneDeep(flow)

    if (isEmpty(values.email) && code.length !== 6) {
      const codeNodes = nextFlow.ui.nodes || []
      const codeIndex = codeNodes.findIndex(
        (node) => node?.attributes?.name === "code",
      )
      nextFlow.ui.nodes[codeIndex].messages = [
        {
          id: 4000002,
          type: "error",
          text: "This field is required, please fill it out.",
        },
      ]
      setFlow(nextFlow)
      return
    }

    const createdTimeDayObject = dayjs(nextFlow.issued_at)
    const diffMinute = dayjs().diff(createdTimeDayObject, "minute")
    const isValidate = validateDiffMinute(setFlow, nextFlow, diffMinute);
    if (!isValidate) {
      const nextFlow = cloneDeep(flow);
      const identifierIndex = nextFlow.ui.nodes.findIndex(
        (node) => node.attributes.name === "code",
      )
      if (identifierIndex !== -1) {
        nextFlow.ui.messages = [];
        nextFlow.ui.nodes[identifierIndex].messages = [{
          id: 400002,
          text: "Verification code is no longer valid, please try again.",
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

    await router
      // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
      // their data when they reload the page.
      .push(`/account?${queryString.stringify(router.query)}`, undefined, {
        shallow: true,
      })

    return ory
      .updateVerificationFlow({
        flow: String(flow?.id),
        updateVerificationFlowBody: { ...values, email: user },
      })
      .then(({ data }) => {
        const nextFlow = cloneDeep(data);
        const [message] = nextFlow.ui.messages;
        if (message.text.includes("The verification code is invalid")) {
          nextFlow.ui.messages = [];
          const codeNodes = nextFlow.ui.nodes || []
          const codeIndex = codeNodes.findIndex(
            (node) => node?.attributes?.name === "code",
          )
          nextFlow.ui.nodes[codeIndex].messages = [
            {
              id: 4000005,
              type: "error",
              text: "Verification code is incorrect, please check and try again.",
            },
          ]
          setFlow(nextFlow)
          return
        } else {
          const codeNodes = nextFlow.ui.nodes || []
          const codeIndex = codeNodes.findIndex(
            (node) => node?.attributes?.name === "code",
          )
          if (codeIndex !== -1) {
            nextFlow.ui.nodes[codeIndex].messages = []
          }
        }
        // Form submission was successful, show the message to the user!
        setFlow(nextFlow)
        if (nextFlow.state === "passed_challenge") {
          deleteAccountPromt()
          // props.deleteAccount()
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
    <Box display={show ? "block" : "none"}>
      <Box
        width="100%"
        maxWidth="438px"
        bgcolor="#272735"
        p="0 32px 32px 32px"
        borderRadius="12px"
        position="fixed"
        top="25vh"
        left="50%"
        marginLeft="-250px"
        zIndex={2}
        sx={{
          "@media screen and (max-width: 530px)": {
            left: "20px",
            marginLeft: "0",
            width: "78%",
          },
          "@media screen and (max-width: 460px)": {
            left: "20px",
            marginLeft: "0",
            width: "76%",
          },
          "@media screen and (max-width: 390px)": {
            left: "20px",
            marginLeft: "0",
            width: "73%",
          },
        }}
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
          </Box>
          { console.log('flow', flow?.state) }
          {flow?.state === 'sent_email' ? 
            <Box>
              <Text>
                Enter the 6-digit code we sent to <span>{email}</span> to finish the
                deletion process.
              </Text>
              <Flow
                onSubmit={onSubmit}
                flow={flow}
                hideGlobalMessages={isEmpty(flow?.ui?.messages)}
                code={sixDigitCode}
              />
            </Box> : 
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
            {flow?.state === 'sent_email' && 
            <Box position="relative" display="flex" justifyContent="end" marginRight="120px">
              <Box
                width="95px"
                height="42px"
                bgcolor="transparent"
                border="1px solid #C0C0C0"
                borderRadius="8px"
                display="flex"
                justifyContent="center"
                alignItems="center"
                color="#C0C0C0"
                fontFamily="open sans"
                fontSize="16px"
                right="140px"
                mt="50px"
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    filter: "brightness(0.9)",
                  },
                }}
                onClick={(e) => {
                  close()
                  window.location.reload()
                }}
              >
              Cancel
              </Box>
            </Box>}
        </Box>
      </Box>
    </Box>
  )
}

export default Verification
