import Box from "@mui/material/Box"
import { SettingsFlow, UpdateSettingsFlowBody } from "@ory/client"
import axios from "axios"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import cloneDeep from "lodash/cloneDeep"
import AccountLayout from "../components/Layout/AccountLayout"
import { showToast } from "../components/Toast"
import { Flow } from "../components/account/Flow"
import ProfileFlow from "../components/account/ProfileFlow"
import VerificationModal from "../components/account/VerificationModal"
import { Methods, Messages } from "../pkg"
import { handleFlowError } from "../pkg/errors"
import ory from "../pkg/sdk"
import Bin from "../public/images/Bin"
import {
  selectMfaModalOpen,
  setAccountDeleted,
  setActiveNav,
  setActiveStage,
} from "../state/store/slice/layoutSlice"
import { Navs, Stage } from "../types/enum"

interface Props {
  flow?: SettingsFlow
  only?: Methods
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
  const [showModal, setShowModal] = useState(false)
  const [flow, setFlow] = useState<SettingsFlow>()
  const router = useRouter()
  const mfaModalOpen = useSelector(selectMfaModalOpen)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const { flow: flowId, return_to: returnTo } = router.query

  const handleConfirmDelete = () => {
    setConfirmDelete(true)
  }

  const handleCloseDelete = () => {
    setShowModal(false)
  }

  const deleteAccount = async () => {
    console.log("🚀 ~ file: account.tsx:70 ~ deleteAccount ~ deleteAccount:")
    const { data } = await axios.get("/api/.ory/sessions/whoami", {
      headers: { withCredentials: true },
    })
    console.log("🚀 ~ file: account.tsx:73 ~ deleteAccount ~ data:", data)

    return axios
      .delete(
        `${process.env.ORY_CUSTOM_DOMAIN}/admin/identities/${data.identity.id}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${process.env.ORY_PAT}`,
          },
        },
      )
      .then(() => {
        dispatch(setAccountDeleted(true))
        console.log("🚀 ~ file: account.tsx:87 ~ .then ~ setAccountDeleted:")
        router.push("/login")
      })
      .catch((error) => {
        console.log("🚀 ~ file: account.tsx:94 ~ deleteAccount ~ error:", error)
        showToast(error.message, false)
      })
  }

  useEffect(() => {
    const activateDeleteProcess = async () => {
      if (confirmDelete) {
        const { data } = await axios.get("/api/.ory/sessions/whoami", {
          headers: { withCredentials: true },
        })
        const { traits } = data.identity
        setShowModal(true)
        return router.push(
          `/account?flow=${flowId || flow?.id}&user=${traits.email}`,
        )
      }
    }
    activateDeleteProcess()
  }, [confirmDelete])

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
    if (flow?.ui.messages) {
      if (flow?.ui.messages[0]?.id === 4000007) {
        showToast("Account already in use. Can't be linked.", false)
      }
      //  else if (flow?.ui.messages[0]?.id === 1050001) {
      //   showToast("update success")
      // }
    }
    // alert("hello")
  }, [flow?.ui.messages])
  useEffect(() => {
    dispatch(setActiveNav(Navs.ACCOUNT))
    dispatch(setActiveStage(Stage.NONE))

    axios
      .get("/api/.ory/sessions/whoami", {
        headers: { withCredentials: true },
      })
      .catch(() => {
        window.location.replace("/login")
      })
  }, [])

  useEffect(() => {
    // refreshSessions(setSessions)
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      return ory
        .getSettingsFlow({ id: String(flowId) })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleFlowError(router, "account", setFlow))
        .catch((err: any) => {
          // If the previous handler did not catch the error it's most likely a form validation error
          if (err.response?.status === 400) {
            // Yup, it is!
            if (err && err.response) {
              setFlow(err.response?.data)
              return
            }
          } else {
            router.replace("/account")
          }
        })
    } else {
      // Otherwise we initialize it

      return ory
        .createBrowserSettingsFlow({
          returnTo: "/account",
        })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleFlowError(router, "account", setFlow))
    }
  }, [flowId, router, router.isReady, returnTo, flow])

  return (
    <AccountLayout>
      <Box display="flex" flexDirection="column">
        <SettingsCard only="oidc" flow={flow}>
          <Box
            color="#717197"
            fontFamily="open sans"
            fontSize="22px"
            marginTop={{
              sm: "48px",
              xs: "24px",
            }}
          >
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
            // handleToast={handleToast}
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
          {/* <Messages messages={flow?.ui.messages} /> */}
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
              onClick={() => {
                dispatch(setActiveStage(Stage.DELETE_ACCOUNT))
                setConfirmDelete(true)
                setShowModal(true)
              }}
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
          {showModal && (
            <Box
              position="fixed"
              bgcolor="#000"
              width="100%"
              height="100%"
              top="0"
              left="0"
              sx={{
                opacity: 0.5,
              }}
            ></Box>
          )}
          <VerificationModal
            deleteAccount={deleteAccount}
            show={showModal}
            close={handleCloseDelete}
          />
        </SettingsCard>
      </Box>
    </AccountLayout>
  )
}

export default Account
