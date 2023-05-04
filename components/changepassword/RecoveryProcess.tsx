import Box from "@mui/material/Box"
import { RecoveryFlow, UpdateRecoveryFlowBody } from "@ory/client"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import cloneDeep from "lodash/cloneDeep"
import isEmpty from "lodash/isEmpty"
import { Flow } from "../../pkg"
import { handleFlowError } from "../../pkg/errors"
import ory from "../../pkg/sdk"
import {
  setActiveStage,
  selectActiveStage,
  selectSixDigitCode,
} from "../../state/store/slice/layoutSlice"
import { Stage } from "../../types/enum"
import { recoveryFormSchema } from "../../util/schemas"
import { handleYupErrors, handleYupSchema } from "../../util/yupHelpers"

const RecoveryProcess: NextPage = () => {
  // console.log(props)
  const [flow, setFlow] = useState<RecoveryFlow>()
  const [dialogMsg, setDialogMsg] = useState<string>(
    "Enter your registered email below and we’ll send you a reset link.",
  )
  const dispatch = useDispatch()
  const activeStage = useSelector(selectActiveStage)
  const sixDigitCode = useSelector(selectSixDigitCode)
  // Get ?flow=... from the URL
  const router = useRouter()
  const { flow: flowId, return_to: returnTo } = router.query

  useEffect(() => {
    dispatch(setActiveStage(Stage.FORGOT_PASSWORD))
  }, [])

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

  const onSubmit = async (values: UpdateRecoveryFlowBody) => {
    const nextFlow = cloneDeep(flow);
    try {
      await handleYupSchema(recoveryFormSchema, {
        email: values.email,
      })
    } catch(error) {
      const errors = handleYupErrors(error)
      
      if (errors.email) {
        const message = {
          id: 4000002,
          text: errors.email,
          type: "error",
        }
        nextFlow.ui.messages = [message]
      }else {
        nextFlow.ui.messages = []
      }
      setFlow(nextFlow)
      return Promise.resolve();
    }
    
    const response = await axios.get(`/api/hydra/validateIdentity?email=${values.email}`)
      if (isEmpty(response.data.data)) {
        nextFlow.ui.messages = [{
          id: 400001,
          text: 'Email account doesn’t exist',
          type: 'error'
        }]
        setFlow(nextFlow)
        return Promise.resolve();
      }
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
              dispatch(setActiveStage(Stage.VERIFY_CODE))
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
          {activeStage === Stage.FORGOT_PASSWORD && (
            <Box color="#A5A5A9" fontSize="14px" fontFamily="open sans">
              Email *
            </Box>
          )}

          <Flow
            onSubmit={onSubmit}
            flow={flow}
            code={sixDigitCode}
            hideSocialLogin
          />
        </Box>
      </Box>
    </>
  )
}

export default RecoveryProcess
