import axios from 'axios'
import { NextRouter } from "next/router"
import queryString from "query-string"
import { Dispatch, SetStateAction } from "react"
import { showToast } from '../components/Toast'

const deleteAccount = async (router, data) => {
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
      const locale = router.locale
      let path = "/registration"
      if (locale && locale !== "en") {
        path = `/${locale}${path}`
      }
      router.push(path)
    })
    .catch((error) => false)
}

// A small function to help us deal with errors coming from fetching a flow.
export function handleGetFlowError<S>(
  router: NextRouter,
  flowType: "login" | "registration" | "settings" | "recovery" | "verification",
  resetFlow: Dispatch<SetStateAction<S | undefined>>,
  lang?: any
) {
  console.log("error handler init")
  return async (err: any) => {
    console.log("error handler within", JSON.stringify(err.response?.data))
    switch (err.response?.data.error?.id) {
      case "session_aal2_required":
        console.log("reached 1")
        // 2FA is enabled and enforced, but user did not perform 2fa yet!
        window.location.href = err.response?.data.redirect_browser_to
        return
      case "session_already_available":
        console.log("reached 2")
        try {
          const resp = await axios.get("/api/.ory/sessions/whoami", {
            headers: { withCredentials: true },
          })
          const { identity } = resp.data;
          const { traits, verifiable_addresses } = identity;
    
          if (traits.source === '0') {
            const [verifiableAddress] = verifiable_addresses;
            if (!verifiableAddress.verified) {
              await deleteAccount(router, resp.data);
              return;
            }
          }
        } catch(error) {}
        
    
        // User is already signed in, let's redirect them home!
        // await router.push("/profile")
        return
      case "session_refresh_required":
        console.log("reached 3")
        // We need to re-authenticate to perform this action
        window.location.href = err.response?.data.redirect_browser_to
        return
      case "self_service_flow_return_to_forbidden":
        console.log("reached 4")
        // The flow expired, let's request a new one.
        // toast.error("The return_to address is not allowed.")
        showToast(lang?.oryAddressNoAllowed || "The return_to address is not allowed." , false)
        resetFlow(undefined)
        await router.push("/" + flowType)
        return
      case "self_service_flow_expired":
        console.log("reached 5")
        // The flow expired, let's request a new one.
        // toast.error("Your interaction expired, please fill out the form again.")
        showToast(lang?.oryInteractionExpired || "Your interaction expired, please fill out the form again." , false)
        resetFlow(undefined)
        await router.push("/" + flowType)
        return
      case "security_csrf_violation":
        console.log("reached 6")
        // A CSRF violation occurred. Best to just refresh the flow!
        // toast.error(
        //   "A security violation was detected, please fill out the form again.",
        // )
        showToast(lang?.orySecurityViolation || "A security violation was detected, please fill out the form again." , false)
        resetFlow(undefined)
        await router.push("/" + flowType)
        return
      case "security_identity_mismatch":
        console.log("reached 7")
        // The requested item was intended for someone else. Let's request a new flow...
        resetFlow(undefined)
        await router.push("/" + flowType)
        return
      case "browser_location_change_required":
        const query = queryString.parse(window.location.search.replace("?", ""));
        // Ory Kratos asked us to point the user to this URL.
        // alert("debug: stay on this page to read errors before redirecting")
        // if (query && query.return_to) {
        //   window.location.href = 'https://google.com';
        //   return;
        // }
        window.location.href = err.response.data.redirect_browser_to
        // console.log("", err.response.data)
        // setTimeout(() => {
        //   window.location.href = err.response.data.redirect_browser_to
        // }, 30000)
        return
    }

    // original Kratos handling flow expiry
    // switch (err.response?.status) {
    //   case 410:
    //     // The flow expired, let's request a new one.
    //     resetFlow(undefined)
    //     await router.push("/" + flowType)
    //     return
    // }

    // We are not able to handle the error? Return it.
    return Promise.reject(err)
  }
}

// A small function to help us deal with errors coming from initializing a flow.
export const handleFlowError = handleGetFlowError
