import Box from "@mui/material/Box"
import { SettingsFlow, UpdateSettingsFlowBody } from "@ory/client"
import axios from "axios"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import isEmpty from "lodash/isEmpty"
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
  selectMfaState,
  setAccountDeleted,
  setActiveNav,
  setActiveStage,
} from "../state/store/slice/layoutSlice"
import { Navs, Stage } from "../types/enum"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { Ring } from '@uiball/loaders'

const linkAttributesNamesKey = "!@#$%^linkAttributesNamesKey";

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

const Account: NextPage = (props) => {
  const { lang } = props
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false)
  const [flow, setFlow] = useState<SettingsFlow>()
  const router = useRouter()
  const mfaModalOpen = useSelector(selectMfaModalOpen)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const mfaState = useSelector(selectMfaState)

  const { flow: flowId, return_to: returnTo } = router.query

  const handleCloseDelete = () => {
    setShowModal(false)
  }

  const deleteAccount = async () => {
    const { data } = await axios.get("/api/.ory/sessions/whoami", {
      headers: { withCredentials: true },
    })

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
        const locale = router.locale
        let path = '/login'
        if (locale && locale !== 'en') {
          path = `/${locale}${path}`
        }
        // router.push("/login")
        router.push(path)
      })
      .catch((error) => {
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
        // return router.push(
        //   `/account?flow=${flowId || flow?.id}&user=${traits.email}`,
        // )
        const locale = router.locale
        let path = '/account'
        if (locale && locale !== 'en') {
          path = `/${locale}${path}`
        }
        return router.push(
          `${path}?flow=${flowId || flow?.id}&user=${traits.email}`,
        )
      }
    }
    activateDeleteProcess()
  }, [confirmDelete])

  const onSubmit = (values: UpdateSettingsFlowBody) => {
    const locale = router.locale
    let path = '/account'
    if (locale && locale !== 'en') {
      path = `/${locale}${path}`
    }
    return (
      router
        // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
        // his data when she/he reloads the page.
        // .push(`/account?flow=${flow?.id}`, undefined, { shallow: true })
        .push(`${path}?flow=${flow?.id}`, undefined, { shallow: true })
        .then(() =>
          ory
            .updateSettingsFlow({
              flow: String(flow?.id),
              updateSettingsFlowBody: values,
            })
            .then(({ data }) => {
              const googleNode = data.ui.nodes.find(node => {
                return node.attributes.value === "google"
              })
              const appleNode = data.ui.nodes.find(node => {
                return node.attributes.value === "apple"
              })
              const linkAttributesNames = JSON.parse(localStorage.getItem(linkAttributesNamesKey) || '{}');
              const locale = localStorage.getItem('lang')
              console.log('zzz1', locale)
              const googleAttributesName = googleNode?.attributes.name;
              const appleAttributesName = appleNode?.attributes.name;
              if (!isEmpty(linkAttributesNames)) {
                if (linkAttributesNames.googleAttributesName !== googleAttributesName) {
                  if (googleAttributesName === "unlink") {
                    // alert("google linked");
                    showToast(`Google ${lang?.linked}`)
                  } else {
                    // alert("google unlinked");
                    showToast(`Google ${lang?.unlinked}`)
                  }
                }

                if (linkAttributesNames.appleAttributesName !== appleAttributesName) {
                  if (appleAttributesName === "unlink") {
                    // alert("apple linked");
                    showToast(`Apple ${lang?.linked}`)
                  } else {
                    // alert("apple unlinked");
                    showToast(`Apple ${lang?.unlinked}`)
                  }
                }
              }

              localStorage.setItem(linkAttributesNamesKey, JSON.stringify({
                googleAttributesName: googleNode?.attributes.name,
                appleAttributesName: appleNode?.attributes.name,
              }));
              // The settings have been saved and the flow was updated. Let's show it to the user!
              setFlow(data)
              // if (data.state === "success") window.location.replace("/account")
              if (data.state === "success") {
                setTimeout(() => {
                  window.location.replace(path)
                }, 1000)
              }
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
        showToast(lang?.cannotLinkAcc || "Account already in use. Can't be linked.", false)
      }
      //  else if (flow?.ui.messages[0]?.id === 1050001) {
      //   showToast("update success")
      // }
    }
  }, [flow?.ui.messages])

  useEffect(() => {
    dispatch(setActiveNav(Navs.ACCOUNT))
    dispatch(setActiveStage(Stage.NONE))

    axios
      .get("/api/.ory/sessions/whoami", {
        headers: { withCredentials: true },
      })
      .catch(() => {
        const locale = router.locale
        let path = '/login'
        if (locale && locale !== 'en') {
          path = `/${locale}${path}`
        }
        // window.location.replace("/login")
        window.location.replace(path)
      });
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
            const locale = router.locale
            let path = '/login'
            if (locale && locale !== 'en') {
              path = `/${locale}${path}`
            }
            // router.replace("/account")
            router.replace(path)
          }
        })
    } else {
      // Otherwise we initialize it
      const locale = router.locale
      let path = '/account'
      if (locale && locale !== 'en') {
        path = `/${locale}${path}`
      }

      return ory
        .createBrowserSettingsFlow({
          returnTo: path,
        })
        .then(({ data }) => {
          const googleNode = data.ui.nodes.find(node => {
            return node.attributes.value === "google"
          })

          if (!isEmpty(googleNode)) {
            const linkAttributesNames = JSON.parse(localStorage.getItem(linkAttributesNamesKey) || '{}');
            const googleNode = data.ui.nodes.find(node => {
              return node.attributes.value === "google"
            })
            const appleNode = data.ui.nodes.find(node => {
              return node.attributes.value === "apple"
            })
            const googleAttributesName = googleNode?.attributes.name;
            const appleAttributesName = appleNode?.attributes.name;
            const locale = localStorage.getItem('lang')
            console.log('zzz2', locale)
            if (!isEmpty(linkAttributesNames)) {
              if (linkAttributesNames.googleAttributesName !== googleAttributesName) {
                if (googleAttributesName === "unlink") {
                  showToast(`Google ${lang?.linked}`)
                } else {
                  showToast(`Google ${lang?.unlinked}`)
                }
              }

              if (linkAttributesNames.appleAttributesName !== appleAttributesName) {
                if (appleAttributesName === "unlink") {
                  // alert("apple linked");
                  showToast(`Apple ${lang?.linked}`)
                } else {
                  // alert("apple unlinked");
                  showToast(`Apple ${lang?.unlinked}`)
                }
              }
            }

            localStorage.setItem(linkAttributesNamesKey, JSON.stringify({
              googleAttributesName: googleNode?.attributes.name,
              appleAttributesName: appleNode?.attributes.name,
            }));
          }
          setFlow(data);
        })
        .catch(handleFlowError(router, "account", setFlow))
    }
  }, [flowId, router, router.isReady, returnTo, flow])

  return (
    <AccountLayout lang={lang}>
      {flow ? <Box display="flex" flexDirection="column">
        <SettingsCard only="oidc" flow={flow}>
          <Box
            color="#717197"
            fontFamily="open sans"
            fontSize={{
              sm: "22px",
              xs: "18px",
            }}
            marginTop={{
              sm: "48px",
              xs: "24px",
            }}
          >
            {lang?.accountLinking}
          </Box>
          <Box
            color="#A5A5A9"
            fontFamily="open sans"
            fontSize="14px"
            mt="4px"
            mb="12px"
          >
             {lang?.accountLinkingDesc}
          </Box>
          {/* <Messages messages={flow?.ui.messages} /> */}
          <Flow
            hideGlobalMessages
            onSubmit={onSubmit}
            only="oidc"
            flow={flow}
            lang={lang}
          // handleToast={handleToast}
          />
        </SettingsCard>
        <SettingsCard only="profile" flow={flow}>
          <Box color="#717197" fontFamily="open sans" fontSize={{
              sm: "22px",
              xs: "18px",
            }} mt="36px">
            {lang?.twoStepVerify}
          </Box>
          <Box
            color="#A5A5A9"
            fontFamily="open sans"
            fontSize="14px"
            mt="4px"
            mb="12px"
          >
            {lang?.twoStepVerifyDesc}
          </Box>
          {/* <Messages messages={flow?.ui.messages} /> */}
          <ProfileFlow
            hideGlobalMessages
            onSubmit={onSubmit}
            only="profile"
            flow={flow}
            modalOpen={mfaModalOpen}
            mfaState={mfaState}
            dispatch={dispatch}
            lang={lang}
          />
        </SettingsCard>
        <SettingsCard only="profile" flow={flow}>
          <Box color="#717197" fontFamily="open sans" fontSize={{
              sm: "22px",
              xs: "18px",
            }} mt="36px">
            {lang?.accountManagement}
          </Box>
          <Box
            mt="12px"
            height={{ xs: "64px", md: "74px" }}
            bgcolor="#272735"
            borderRadius="12px"
            display="flex"
            alignItems="center"
            pl="27px"
          >
            <Box
              display="flex"
              alignItems="center"
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
              <Box color="#F24867" fontSize={{
                  sm: "20px",
                  xs: "16px",
                }} fontFamily="open sans">
                {lang?.deleteMyAccount}
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
            lang={lang}
          />
        </SettingsCard>
      </Box> :
      <Box 
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh">
        <Ring 
          size={40}
          lineWeight={5}
          speed={2} 
          color="#A62BC3" 
        />
      </Box>}
    </AccountLayout>
  )
}

export default Account

export async function getStaticProps({ locale } : any) {
  return {
    props: {...(await serverSideTranslations(locale, ['common']))},
  }
}