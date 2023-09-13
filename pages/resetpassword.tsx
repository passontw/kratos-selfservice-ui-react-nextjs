import Box from "@mui/material/Box"
import { RecoveryFlow, UpdateRecoveryFlowBody } from "@ory/client"
import { CardTitle } from "@ory/themes"
import type { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import ChangePassword from "../components/resetpassword/ChangePassword"
import { Flow, ActionCard, CenterLink, MarginCard } from "../pkg"
import { handleFlowError } from "../pkg/errors"
import ory from "../pkg/sdk"

const ResetPassword: NextPage = () => {
  const [flow, setFlow] = useState<RecoveryFlow>()

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
      ory.getRecoveryFlow({ id: String(flowId) })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleFlowError(router, "resetpassword", setFlow))
      return
    }

    // Otherwise we initialize it
    ory.createBrowserRecoveryFlow({
        returnTo: "/changepassword",
      })
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(handleFlowError(router, "resetpassword", setFlow))
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

  const onSubmit = (values: UpdateRecoveryFlowBody) =>
    router
      // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
      // his data when she/he reloads the page.
      .push(`/resetpassword?flow=${flow?.id}`, undefined, { shallow: true })
      .then(() =>
        ory.updateRecoveryFlow({
            flow: String(flow?.id),
            updateRecoveryFlowBody: values,
          })
          .then(({ data }) => {
            // Form submission was successful, show the message to the user!
            setFlow(data)
          })
          .catch(handleFlowError(router, "resetpassword", setFlow))
          .catch((err: any) => {
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

  return (
    <div className="resetWrapper">
      {/* <ChangePassword /> */}
      {/* <Head>
        <title>Reset Password - Master ID</title>
        <meta name="description" content="Master ID" />
      </Head> */}
      <Box
        width="100%"
        height="100%"
        maxWidth="564px"
        maxHeight="375px"
        bgcolor="#272735"
        borderRadius="12px"
        p="32px"
      >
        <Box fontSize="20px" fontFamily="open sans" color="#FFF">
          Change Password
        </Box>
        <Flow onSubmit={onSubmit} flow={flow} />
      </Box>
      {/* <ActionCard>
        <Link href="/" passHref>
          <CenterLink>Go back</CenterLink>
        </Link>
      </ActionCard> */}
    </div>
  )
}

export default ResetPassword
