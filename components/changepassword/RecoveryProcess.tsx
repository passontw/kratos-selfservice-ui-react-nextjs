import Box from "@mui/material/Box"
import { RecoveryFlow, UpdateRecoveryFlowBody } from "@ory/client"
import axios from "axios"
import cloneDeep from "lodash/cloneDeep"
import isEmpty from "lodash/isEmpty"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { Flow } from "../../pkg/ui/ForgotPassword"
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
import { Ring } from '@uiball/loaders'

const dayjs = require("dayjs")
const utc = require("dayjs/plugin/utc")
const timezone = require("dayjs/plugin/timezone") // dependent on utc plugin

dayjs.extend(utc)
dayjs.extend(timezone)

const getNextValues = (flow, values) => {
  if (flow.state !== "sent_email") return values;
  const  {
    isResendCode,
    code,
    csrf_token,
    email,
    method,
  } = values;
  return isResendCode ? {
    email,
    csrf_token,
    method,
  } : {
    code,
    csrf_token,
    method,
  };
};

const RecoveryProcess: NextPage = (props) => {
  const { lang } = props
  const [flow, setFlow] = useState<RecoveryFlow>()
  const [dialogMsg, setDialogMsg] = useState<string>(lang?.forgotPwDesc)
  const dispatch = useDispatch()
  const activeStage = useSelector(selectActiveStage)
  const sixDigitCode = useSelector(selectSixDigitCode)
  // Get ?flow=... from the URL
  const router = useRouter()
  const { flow: flowId, return_to: returnTo } = router.query

  // relocate the validation to fit design
  useEffect(() => {
    const targetDestination = document.querySelector(".targetDestination")
    const targetErrorMsg = document.querySelector("h3")
    const submitBtn = document.querySelector(".targetDestination button")
    // move only when error msg appeared, submit button is visible,
    // and there is no query string which indicates that the flow is still on step 1
    if (
      targetErrorMsg &&
      targetDestination?.parentNode &&
      submitBtn &&
      !window.location.search
    ) {
      targetDestination.parentNode.insertBefore(
        targetErrorMsg,
        targetDestination,
      )
      // style the button to fit new ui
      submitBtn.style.margin = "33px 0px 0px"
    } else {
      // else if error msg is not present style message to fit original ui
      if (targetErrorMsg) {
        targetErrorMsg.style.display = "none"
      }
    }
  }, [flow])

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
    if (isEmpty(flow)) return true
    if (diffMinute < 5) return true

    const nextFlow = cloneDeep(flow)
    const identifierIndex = nextFlow.ui.nodes.findIndex(
      (node) => node.attributes.name === "code",
    )
    if (identifierIndex === -1) return true
    nextFlow.ui.nodes[identifierIndex].messages = [
      {
        id: 400009,
        text: "Verification code is no longer valid",
        type: "error",
      },
    ]
    setFlow(nextFlow)
    return false
  }

  const onSubmit = async (values: UpdateRecoveryFlowBody) => {
    const  {
      isResendCode,
    } = values;

    const createdTimeDayObject = dayjs(flow.issued_at)
    const diffMinute = dayjs().diff(createdTimeDayObject, "minute")
    const isValidate = validateDiffMinute(setFlow, flow, diffMinute)

    if (!isValidate) {
      const nextFlow = cloneDeep(flow)
      const identifierIndex = nextFlow.ui.nodes.findIndex(
        (node) => node.attributes.name === "code",
      )

      if (identifierIndex !== -1) {
        nextFlow.ui.messages = []
        nextFlow.ui.nodes[identifierIndex].messages = [
          {
            id: 400002,
            text: "Verification code is no longer valid, please try again.",
            type: "error",
          },
        ]
        setFlow(nextFlow)
        return
      }
    } else {
      const nextFlow = cloneDeep(flow)
      const identifierIndex = nextFlow.ui.nodes.findIndex(
        (node) => node.attributes.name === "code",
      )
      if (identifierIndex !== -1) {
        nextFlow.ui.messages = []
        nextFlow.ui.nodes[identifierIndex].messages = []
        setFlow(nextFlow)
      }
    }

    if (!isResendCode && flow.state === "sent_email") {
      const nextFlow = cloneDeep(flow)
      const identifierIndex = nextFlow.ui.nodes.findIndex(
        (node) => node.attributes.name === "code",
      )
      if (identifierIndex !== -1) {
        nextFlow.ui.messages = []
        nextFlow.ui.nodes[identifierIndex].messages = []
        setFlow(nextFlow)
      }
    }

    const nextFlow = cloneDeep(flow)
    try {
      if (flow.state === "choose_method") {
        await handleYupSchema(recoveryFormSchema, {
          email: values.email,
        })
      }

      if (!isResendCode && flow.state === "sent_email") {
        await handleYupSchema(recoveryCodeFormSchema, {
          code: values.code,
        })
      }
    } catch (error) {
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
        if (codeIndex !== -1) {
          nextFlow.ui.nodes[codeIndex].messages = []
        }
      }
      setFlow(nextFlow)
      return Promise.resolve()
    }

    if (flow.state === "choose_method") {
      const response = await axios.get(
        `/api/hydra/validateIdentity?email=${values.email}`,
      )
      if (isEmpty(response.data.data)) {
        const emailNodes = nextFlow.ui.nodes || []
        const emailIndex = emailNodes.findIndex(
          (node) => node?.attributes?.name === "email",
        )
        nextFlow.ui.messages = [
          {
            id: 400001,
            text: "Email account doesn’t exist. Please try again or sign up",
            type: "error",
          },
        ]
        nextFlow.ui.nodes[emailIndex].messages = [
          {
            id: 400001,
            text: " ",
            type: "error",
          },
        ]
        setFlow(nextFlow)
        return Promise.resolve()
      } else {
        const emailNodes = nextFlow.ui.nodes || []
        const emailIndex = emailNodes.findIndex(
          (node) => node?.attributes?.name === "email",
        )

        nextFlow.ui.messages = []
        nextFlow.ui.nodes[emailIndex].messages = []
        setFlow(nextFlow)
      }
    }
    
    
    const nextValues = getNextValues(flow, values);

    return (
      router
        // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
        // his data when she/he reloads the page.
        .push(`/recovery?flow=${flow?.id}`, undefined, { shallow: true })
        .then(() =>
          ory
            .updateRecoveryFlow({
              flow: String(flow?.id),
              updateRecoveryFlowBody: nextValues,
            })
            .then(({ data }) => {
              // Form submission was successful, show the message to the user!
              setFlow(data)
              dispatch(setActiveStage(Stage.VERIFY_CODE))
              // setDialogMsg(
              //   `Enter the 6-digit code we sent to ${values.email} to verify account.`,
              // )
              setDialogMsg(lang?.verifyAcctDesc.replace("master123@gmail.com", `${values.email}`))
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
      <Box className="targetParent">
        <Box
          position="absolute"
          top="35px"
          fontFamily="open sans"
          fontSize="20px"
          color="#FFF"
        >
          {activeStage === Stage.FORGOT_PASSWORD
            ? lang?.forgotPw
            : lang?.verifyAccount}
        </Box>
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
            <Box color="#717197" fontSize="14px" fontFamily="open sans">
              {`${lang?.email} *`}
            </Box>
          )}
          {flow ? <Flow
            onSubmit={onSubmit}
            flow={flow}
            code={sixDigitCode}
            hideSocialLogin
            lang={lang}
          /> : 
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
        </Box>
      </Box>
    </>
  )
}

export default RecoveryProcess
