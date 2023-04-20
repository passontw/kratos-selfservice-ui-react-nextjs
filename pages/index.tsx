import { Card, CardTitle, P, H2, H3, CodeBox } from "@ory/themes"
import { AxiosError } from "axios"
import type { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"

import { showToast } from "../components/Toast"
import RecoveryProcess from "../components/changepassword/RecoveryProcess"
import { DocsButton, MarginCard, LogoutLink } from "../pkg"
import ory from "../pkg/sdk"
import { setDialog } from "../state/store/slice/layoutSlice"

const Home: NextPage = () => {
  const [session, setSession] = useState<string>(
    "No valid Ory Session was found.\nPlease sign in to receive one.",
  )
  const [hasSession, setHasSession] = useState<boolean>(false)
  const router = useRouter()
  const onLogout = LogoutLink()
  const dispatch = useDispatch()

  useEffect(() => {
    ory
      .toSession()
      .then(({ data }) => {
        setSession(JSON.stringify(data, null, 2))
        setHasSession(true)
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 403:
          // This is a legacy error code thrown. See code 422 for
          // more details.
          case 422:
            // This status code is returned when we are trying to
            // validate a session which has not yet completed
            // its second factor
            return router.push("/login?aal=aal2")
          case 401:
            // do nothing, the user is not logged in
            return
        }

        // Something else happened!
        return Promise.reject(err)
      })
  }, [router])

  const openDialog = () => {
    dispatch(
      setDialog({
        title: "Modal Name",
        titleHeight: "30px",
        width: 480,
        height: 358,
        center: true,
        children: <RecoveryProcess />,
      }),
    )
  }

  return (
    <div className={"container-fluid"}>
      <Head>
        <title>Ory NextJS Integration Example</title>
        <meta name="description" content="NextJS + React + Vercel + Ory" />
      </Head>

      <MarginCard wide>
        <CardTitle>Welcome to Ory! - Cooler Master</CardTitle>
        <div className="row">
          <div className="col-md-8 col-xs-12">
            <div className="box">
              <H3>Session Information</H3>
              <P>
                Below you will find the decoded Ory Session if you are logged
                in.
              </P>
              <CodeBox data-testid="session-content" code={session} />
            </div>
          </div>
        </div>
      </MarginCard>

      <Card wide>
        <div className={"row"}>
          <button onClick={() => openDialog()}>open modal</button>
          <button onClick={() => showToast("Password changed")}>
            show toast
          </button>
          <DocsButton
            unresponsive
            testid="login"
            href="/login"
            disabled={hasSession}
            title={"Login"}
          />
          <DocsButton
            unresponsive
            testid="sign-up"
            href="/registration"
            disabled={hasSession}
            title={"Sign Up"}
          />
          <DocsButton
            unresponsive
            testid="recover-account"
            href="/recovery"
            disabled={hasSession}
            title="Recover Account"
          />
          <DocsButton
            unresponsive
            testid="verify-account"
            href="/verification"
            title="Verify Account"
          />
          <DocsButton
            unresponsive
            testid="account-settings"
            href="/settings"
            disabled={!hasSession}
            title={"Account Settings"}
          />
          <DocsButton
            unresponsive
            testid="logout"
            onClick={onLogout}
            disabled={!hasSession}
            title={"Logout"}
          />
        </div>
      </Card>
    </div>
  )
}

export default Home
