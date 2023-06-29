import { FlowError } from "@ory/client"
import { CardTitle, CodeBox } from "@ory/themes"
import { AxiosError } from "axios"
import type { NextPage } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import { ActionCard, CenterLink, MarginCard } from "../pkg"
import ory from "../pkg/sdk"
import { useTranslation } from 'next-i18next'

const Login: NextPage = () => {
  const [error, setError] = useState<FlowError | string>()
  const { t } = useTranslation()

  // Get ?id=... from the URL
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    // If the router is not ready yet, or we already have an error, do nothing.
    if (!router.isReady || error) {
      return
    }

    ory
      .getFlowError({ id: String(id) })
      .then(({ data }) => {
        if (data?.error?.message === "no resumable session found") {
          const locale = router.locale
          let path = '/login'
          if (locale && locale !== 'en') {
            path = `/${locale}${path}`
          }
          const errorMsg = t('error-email-unexisted')
          window.location.replace(`${path}?error=${errorMsg}`);
          // window.location.replace("/login?error=email not exists or did not link 3rd party.");
        }

        setError(data)
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 404:
          // The error id could not be found. Let's just redirect home!
          case 403:
          // The error id could not be fetched due to e.g. a CSRF issue. Let's just redirect home!
          case 410:
            // The error id expired. Let's just redirect home!
            return router.push("/")
        }

        return Promise.reject(err)
      })
  }, [id, router, router.isReady, error])

  if (!error) {
    return null
  }

  return (
    <>
      <MarginCard wide>
        <CardTitle>An error occurred</CardTitle>
        <CodeBox code={JSON.stringify(error, null, 2)} />
      </MarginCard>
      <ActionCard wide>
        <Link href="/" passHref>
          <CenterLink>Go back</CenterLink>
        </Link>
      </ActionCard>
    </>
  )
}

export default Login
