import Box from "@mui/material/Box"
import { RecoveryFlow, UpdateRecoveryFlowBody } from "@ory/client"
import { CardTitle } from "@ory/themes"
import { AxiosError } from "axios"
import type { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

import { Flow, ActionCard, CenterLink, MarginCard } from "../../pkg"
import { handleFlowError } from "../../pkg/errors"
import ory from "../../pkg/sdk"
import { selectActiveNav } from "../../state/store/slice/layoutSlice"

const RecoveryProcess: NextPage = () => {
  const [flow, setFlow] = useState<RecoveryFlow>()
  const [dialogMsg, setDialogMsg] = useState<string>(
    "Enter your registered email below and we’ll send you a reset link.",
  )

  // Get ?flow=... from the URL
  const router = useRouter()
  const { flow: flowId, return_to: returnTo } = router.query

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      ory
        .getRecoveryFlow({ id: String(flowId) })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleFlowError(router, "recovery", setFlow))
      return
    }

    // Otherwise we initialize it
    ory
      .createBrowserRecoveryFlow()
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(handleFlowError(router, "recovery", setFlow))
      .catch((err: any) => {
        // If the previous handler did not catch the error it's most likely a form validation error
        if (err.response?.status === 400) {
          // Yup, it is!
          if (err && err.response) {
            setFlow(err.response?.data)
            return
          }
        }

        return Promise.reject(err)
      })
  }, [flowId, router, router.isReady, returnTo, flow])

  const onSubmit = (values: UpdateRecoveryFlowBody) => {
    return (
      router
        // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
        // his data when she/he reloads the page.
        .push(`/recovery?flow=${flow?.id}`, undefined, { shallow: true })
        .then(() =>
          ory
            .updateRecoveryFlow({
              flow: String(flow?.id),
              updateRecoveryFlowBody: values,
            })
            .then(({ data }) => {
              // Form submission was successful, show the message to the user!
              setFlow(data)
              setDialogMsg(
                "An email containing a recovery code has been sent to the email address you provided.",
              )
            })
            .catch(handleFlowError(router, "recovery", setFlow))
            .catch((err: any) => {
              // console.log("@Q@", err.response)
              if (err && err.response) {
                switch (err.response?.status) {
                  case 400:
                    // Status code 400 implies the form validation had an error
                    setFlow(err.response?.data)
                    return
                }

                throw err
              }
            }),
        )
    )
  }

  return (
    <>
      <Box>
        {/* <Head>
          <title>Recover your account - Ory NextJS Integration Example</title>
          <meta name="description" content="NextJS + React + Vercel + Ory" />
        </Head> */}
        <Box bgcolor="#272735">
          <Box
            color="#A5A5A9"
            fontSize="14px"
            fontFamily="open sans"
            mb="24px"
            lineHeight="20px"
          >
            {dialogMsg}
          </Box>
          {/* <CardTitle>Check Email</CardTitle> */}
          <Box color="#A5A5A9" fontSize="14px" fontFamily="open sans">
            Email *
          </Box>
          <Flow onSubmit={onSubmit} flow={flow} />
        </Box>
        {/* <ActionCard>
        <Link href="/" passHref>
          <CenterLink>Go back</CenterLink>
        </Link>
      </ActionCard> */}
      </Box>
    </>
  )
}

export default RecoveryProcess
