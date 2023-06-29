import axios from "axios"
import isNull from "lodash/isNull"
import { StyledProfileArea } from "../styles/pages/profile.styles"
import Box from "@mui/material/Box"
import {
  RegistrationFlow,
  SettingsFlow,
  UpdateSettingsFlowBody,
} from "@ory/client"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { ReactNode, useState, useEffect } from "react"
import { useDispatch } from "react-redux"

import AccountLayout from "../components/Layout/AccountLayout"
import { showToast } from "../components/Toast"
import Flow from "../components/profile/Flow"
import { handleFlowError } from "../pkg/errors"
import ory from "../pkg/sdk"
import { setActiveNav, setActiveStage } from "../state/store/slice/layoutSlice"
import { Navs, Stage } from "../types/enum"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import cityJson from "../city.json"
import { Ring } from '@uiball/loaders'

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

  return <Box bgcolor="transparent">{children}</Box>
}

const getCityName = () => {
  return new Promise(resolve => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude = null, longitude = null } = position?.coords || {};
        if (isNull(latitude) || isNull(longitude)) return resolve('Unknow');

        axios.get(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`)
          .then(response => {
            const { country_code, city, suburb } = response.data.address;
            const key = `${city}${suburb}`;
            const resultCity = cityJson.find(city => {
              return city['欄位2'] === key;
            })
            const result = `${resultCity['欄位3'].split(',')[1]},${country_code.toUpperCase()}`;
            resolve(result);
          }).catch(() => resolve('Unknow'));
      });
    } else {
      resolve('Unknow');
    }
  });
}

const Profile: NextPage = (props) => {
  const { lang } = props
  const dispatch = useDispatch()
  const [flow, setFlow] = useState<RegistrationFlow>()
  const router = useRouter()

  const { flow: flowId, return_to: returnTo } = router.query

  useEffect(() => {
    dispatch(setActiveNav(Navs.PROFILE))
    dispatch(setActiveStage(Stage.NONE))

    axios.get("/api/.ory/sessions/whoami", {
      headers: { withCredentials: true },
    }).catch(() => {
      window.location.replace("/login");
    })

    ory
    .createBrowserSettingsFlow({
      returnTo: returnTo ? String(returnTo) : undefined,
    }).then(async ({data}) => {
      const filteredNodes = data.ui.nodes.filter(node => {
        if (node.attributes.name === 'link') return false;
        if (node.attributes.name === 'method') return false;
        if (node.attributes.name === 'password') return false;
        return true;
      });
      const cityName = await getCityName();
      const values = filteredNodes.reduce((result, node) => {
        if (node.attributes.name === 'traits.location') {
          result[node.attributes.name] = cityName;
        } else {
          result[node.attributes.name] = node.attributes.value;
        }
        return result;
      }, {method: 'profile'})
      return ory.updateSettingsFlow({
        flow: String(data?.id),
        updateSettingsFlowBody: values,
      });
    })
  }, [])

  useEffect(() => {
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
        .catch(handleFlowError(router, "profile", setFlow))
      return
    }

    // Otherwise we initialize it
    ory
      .createBrowserSettingsFlow({
        returnTo: returnTo ? String(returnTo) : undefined,
      })
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(handleFlowError(router, "profile", setFlow))
  }, [flowId, router, router.isReady, returnTo, flow])

  const onSubmit = (values: UpdateSettingsFlowBody) => {
    return router
    // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
    // his data when she/he reloads the page.
    .push(`/profile?flow=${flow?.id}`, undefined, { shallow: true })
    .then(() =>
      ory
        .updateSettingsFlow({
          flow: String(flow?.id),
          updateSettingsFlowBody: values,
        })
        .then(({ data }) => {
          // The settings have been saved and the flow was updated. Let's show it to the user!
          if (data.state === "success") {
            showToast(lang?.profileUpdated || "Profile updated successfully")
          }
          setFlow(data)
        })
        .catch(handleFlowError(router, "profile", setFlow))
        .catch(async (err: any) => {
          // If the previous handler did not catch the error it's most likely a form validation error
          if (err.response?.status === 400) {
            // Yup, it is!
            setFlow(err.response?.data)
            return
          }

          return Promise.reject(err)
        }),
    );
  }
    

  return (
    <AccountLayout lang={lang}>
      {flow ? 
      <StyledProfileArea paddingRight="0">
        <SettingsCard only="profile" flow={flow}>
          <Flow
            hideGlobalMessages
            onSubmit={onSubmit}
            only="profile"
            flow={flow}
            lang={lang}
          />
        </SettingsCard>
      </StyledProfileArea> :
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

export default Profile

export async function getStaticProps({ locale }: any) {
  return {
    props: { ...(await serverSideTranslations(locale, ['common'])) },
  }
}