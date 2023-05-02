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

  useEffect(() => {
    if (flowId) {
      ory
        .getSettingsFlow({ id: String(flowId) })
        .then(({ data }) => {
          router.replace(`/account?flow=${flowId}`);
        })
        .catch(handleFlowError(router, "account", setFlow))
      return
    }
  }, [flowId])
  
  return null;
}

export default Settings
