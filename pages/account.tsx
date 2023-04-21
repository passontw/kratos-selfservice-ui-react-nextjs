import Box from "@mui/material/Box"
import { SettingsFlow, UpdateSettingsFlowBody } from "@ory/client"
import { H3 } from "@ory/themes"
import axios from "axios"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import AccountLayout from "../components/Layout/AccountLayout"
import { Flow } from "../components/account/Flow"
import ProfileFlow from "../components/account/ProfileFlow"
import VerificationModal from "../components/account/VerificationModal"
import { Methods, ActionCard, Messages } from "../pkg"
import { handleFlowError } from "../pkg/errors"
import ory from "../pkg/sdk"
import Bin from "../public/images/Bin"
import {
  selectMfaModalOpen,
  selectMfaState,
  setActiveNav,
  setActiveStage,
} from "../state/store/slice/layoutSlice"
import { Navs, Stage } from "../types/enum"

interface Props {
  flow?: SettingsFlow
  only?: Methods
}

const refreshSessions = (setSessions) => {
  axios
    .get("/api/.ory/sessions", {
      headers: { withCredentials: true },
    })
    .then((resp) => {
      const { data } = resp
      setSessions(data)
    })
    .catch((error) => {
      setSessions([])
    })
}

function SettingsCard({
  flow,
  only,
  children,
}: Props & { children: ReactNode }) {
  if (!flow) {
    return null
  }

  const nodes = only
    ? flow.ui.nodes.filter(({ group }) => group === only)
    : flow.ui.nodes

  if (nodes.length === 0) {
    return null
  }

  return <Box>{children}</Box>
}

const Account: NextPage = () => {
  const dispatch = useDispatch()
  const [sessions, setSessions] = useState([])
  const [flow, setFlow] = useState<SettingsFlow>()
  const router = useRouter()
  const mfaModalOpen = useSelector(selectMfaModalOpen)
  const mfaState = useSelector(selectMfaState)

  const { flow: flowId, return_to: returnTo } = router.query

  const deleteAccount = async () => {
    const { data } = await axios.get("/api/.ory/sessions/whoami", {
      headers: { withCredentials: true },
    })
    return axios
      .delete(
        `${process.env.ORY_SDK_URL}/admin/identities/${data.identity.id}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${process.env.ORY_PAT}`,
          },
        },
      )
      .then((resp) => {
        router.replace("/")
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  const deleteAccountPromt = async () => {
    const confirmResult = confirm("是否確定刪除帳號?")
    if (confirmResult) {
      const { data } = await axios.get("/api/.ory/sessions/whoami", {
        headers: { withCredentials: true },
      })

      const { traits } = data.identity
      // return;
      return router
        .push(
          flow?.return_to ||
            `/account?flow=${flowId || flow.id}&user=${traits.email}`,
        )
        .then(() => {})
    }
  }

  const onSubmit = (values: UpdateSettingsFlowBody) => {
    return (
      router
        // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
        // his data when she/he reloads the page.
        .push(`/account?flow=${flow?.id}`, undefined, { shallow: true })
        .then(() =>
          ory
            .updateSettingsFlow({
              flow: String(flow?.id),
              updateSettingsFlowBody: values,
            })
            .then(({ data }) => {
              // The settings have been saved and the flow was updated. Let's show it to the user!
              setFlow(data)
            })
            .catch(handleFlowError(router, "account", setFlow))
            .catch(async (err: any) => {
              // If the previous handler did not catch the error it's most likely a form validation error
              if (err.response?.status === 400) {
                // Yup, it is!
                setFlow(err.response?.data)
                return
              }

              return Promise.reject(err)
            }),
        )
    )
  }
  useEffect(() => {
    dispatch(setActiveNav(Navs.ACCOUNT))
    dispatch(setActiveStage(Stage.NONE))
  }, [])

  useEffect(() => {
    refreshSessions(setSessions)
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      ory
        .getSettingsFlow({ id: String(flowId) })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleFlowError(router, "account", setFlow))
      return
    }

    // Otherwise we initialize it
    ory
      .createBrowserSettingsFlow({
        returnTo: "/account",
      })
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(handleFlowError(router, "account", setFlow))
  }, [flowId, router, router.isReady, returnTo, flow])

  return (
    <AccountLayout>
      <Box display="flex" flexDirection="column">
        <SettingsCard only="oidc" flow={flow}>
          <Box color="#717197" fontFamily="open sans" fontSize="22px" mt="48px">
            Account Linking
          </Box>
          <Box
            color="#A5A5A9"
            fontFamily="open sans"
            fontSize="14px"
            mt="4px"
            mb="12px"
          >
            Connect your account with one of these third parties to sign in
            quickly and easily.
          </Box>
          <Messages messages={flow?.ui.messages} />
          <Flow
            hideGlobalMessages
            onSubmit={onSubmit}
            only="oidc"
            flow={flow}
          />
        </SettingsCard>
        <SettingsCard only="profile" flow={flow}>
          <Box color="#717197" fontFamily="open sans" fontSize="22px" mt="36px">
            2-step Verification
          </Box>
          <Box
            color="#A5A5A9"
            fontFamily="open sans"
            fontSize="14px"
            mt="4px"
            mb="12px"
          >
            Each time you sign in to Cooler Master service, we’ll send you a
            verification code to prevent unauthorized access.
          </Box>
          <Messages messages={flow?.ui.messages} />
          <ProfileFlow
            hideGlobalMessages
            onSubmit={onSubmit}
            only="profile"
            flow={flow}
            modalOpen={mfaModalOpen}
            // mfaState={mfaState}
            dispatch={dispatch}
          />
        </SettingsCard>
        <SettingsCard only="profile" flow={flow}>
          <Box color="#717197" fontFamily="open sans" fontSize="22px" mt="36px">
            Account Management
          </Box>
          <Box
            mt="12px"
            height="74px"
            bgcolor="#272735"
            borderRadius="12px"
            display="flex"
            alignItems="center"
            pl="27px"
          >
            <Box
              display="flex"
              gap="15px"
              width="fit-content"
              onClick={deleteAccountPromt}
              sx={{
                cursor: "pointer",
              }}
            >
              <Box pt="1.5px">
                <Bin />
              </Box>
              <Box color="#F24867" fontSize="20px" fontFamily="open sans">
                Delete my account
              </Box>
            </Box>
          </Box>
          {/* <button onClick={deleteAccountPromt}>刪除帳號</button> */}
          <VerificationModal deleteAccount={deleteAccount} />
        </SettingsCard>
      </Box>
    </AccountLayout>
  )
}

export default Account
