import { SettingsFlow } from "@ory/client"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { handleFlowError } from "../pkg/errors"
import ory from "../pkg/sdk"

const Settings: NextPage = () => {
  const [flow, setFlow] = useState<SettingsFlow>()

  // Get ?flow=... from the URL
  const router = useRouter()
  const { flow: flowId, return_to: returnTo } = router.query

  // useEffect(() => {
  //   if (flowId) {
  //     ory
  //       .getSettingsFlow({ id: String(flowId) })
  //       .then(({ data }) => {
  //         if (/recovery/.test(data.request_url)) {
  //           router.replace("/settings");
  //           return;
  //         }
  //         router.replace(`/account?flow=${flowId}`);
  //       })
  //       .catch(handleFlowError(router, "account", setFlow))
  //     return
  //   }
  // }, [flowId])

  useEffect(() => {
    if (flowId) {
      ory.getSettingsFlow({ id: String(flowId) })
        .then(({ data }) => {
          const locale = router.locale;
          let accountPath = '/account';
          let settingsPath = '/settings';
          
          if (locale && locale !== 'en') {
            accountPath = `/${locale}${accountPath}`;
            settingsPath = `/${locale}${settingsPath}`;
          }
          
          if (/recovery/.test(data.request_url)) {
            router.replace(settingsPath);
            return;
          }

          // const urlParts = data.request_url.split('/');
          // if (urlParts.includes('recovery')) {
          //     const locale = urlParts[urlParts.indexOf('recovery') - 1]
          //     let settingsPath = '/settings'

          //     if (locale && locale !== 'en') {
          //         settingsPath = `/${locale}${settingsPath}`
          //     }
          //     router.replace(settingsPath)
          //     return;
          // }
          router.replace(`${accountPath}?flow=${flowId}`);
        })
        .catch(handleFlowError(router, "account", setFlow))
      return
    }
  }, [flowId])
  
  return null;
}

export default Settings
