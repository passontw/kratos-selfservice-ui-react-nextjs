import Box from "@mui/material/Box"
import { RecoveryFlow, UpdateRecoveryFlowBody } from "@ory/client"
import axios from "axios"
import cloneDeep from "lodash/cloneDeep"
import isEmpty from "lodash/isEmpty"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { Flow } from "../../pkg"
import { handleFlowError } from "../../pkg/errors"
import ory from "../../pkg/sdk"
import {
  setActiveStage,
  selectActiveStage,
  selectSixDigitCode,
} from "../../state/store/slice/layoutSlice"
import { Stage } from "../../types/enum"
import { recoveryFormSchema, recoveryCodeFormSchema } from "../../util/schemas"
import { handleYupErrors, handleYupSchema } from "../../util/yupHelpers"

const dayjs = require("dayjs")
const utc = require("dayjs/plugin/utc")
const timezone = require("dayjs/plugin/timezone") // dependent on utc plugin

dayjs.extend(utc)
dayjs.extend(timezone)

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

  const validateDiffMinute = (setFlow, flow, diffMinute) => {
    if (isEmpty(flow)) return true;
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

  const onSubmit = async (values: UpdateRecoveryFlowBody) => {
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

    if (flow.state === "sent_email") {
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

    const nextFlow = cloneDeep(flow);
    try {
      if (flow.state === "choose_method") {
        await handleYupSchema(recoveryFormSchema, {
          email: values.email,
        })
      }

      if (flow.state === "sent_email") {
        await handleYupSchema(recoveryCodeFormSchema, {
          code: values.code,
        })
      }

    } catch(error) {
      const errors = handleYupErrors(error)

      if (errors.email) {
        const message = {
          id: 4000002,
          text: errors.email,
          type: "error",
        }
        const emailNodes = nextFlow.ui.nodes || []
        const emailIndex = emailNodes.findIndex(
          (node) => node?.attributes?.name === "email",
        )
        nextFlow.ui.nodes[emailIndex].messages = [message]
      } else {
        const emailNodes = nextFlow.ui.nodes || []
        const emailIndex = emailNodes.findIndex(
          (node) => node?.attributes?.name === "email",
        )
        nextFlow.ui.nodes[emailIndex].messages = []
      }

      if (errors.code) {
        const message = {
          id: 4000002,
          text: errors.code,
          type: "error",
        }
        const codeNodes = nextFlow.ui.nodes || []
        const codeIndex = codeNodes.findIndex(
          (node) => node?.attributes?.name === "code",
        )

        nextFlow.ui.nodes[codeIndex].messages = [message]
      } else {
        const codeNodes = nextFlow.ui.nodes || []
        const codeIndex = codeNodes.findIndex(
          (node) => node?.attributes?.name === "code",
        )
        nextFlow.ui.nodes[codeIndex].messages = []
      }
      setFlow(nextFlow)
      return Promise.resolve()
    }

    if (flow.state === "choose_method") {
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
    }

    const nextValue = flow.state === "choose_method"
      ? values
      : {...values, email: undefined};

    return (
      router
        // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
        // his data when she/he reloads the page.
        .push(`/recovery?flow=${flow?.id}`, undefined, { shallow: true })
        .then(() =>
          ory
            .updateRecoveryFlow({
              flow: String(flow?.id),
              updateRecoveryFlowBody: nextValue,
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
