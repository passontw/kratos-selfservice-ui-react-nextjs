import { SettingsFlow, UpdateSettingsFlowBody } from "@ory/client"
import { CardTitle, H3, P } from "@ory/themes"
import type { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"
import axios from "axios";

import { ActionCard, CenterLink, Flow, Messages, Methods } from "../pkg"
import { handleFlowError } from "../pkg/errors"
import ory from "../pkg/sdk"
import UAParser from 'ua-parser-js';

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

  return <ActionCard wide>{children}</ActionCard>
}

const refreshSessions = (setSessions) => {
  axios.get('/api/.ory/sessions', {
    headers: { withCredentials: true },
  }).then(resp => {
    const {data} = resp;
    setSessions(data);
  }).catch(error => {
    setSessions([]);
  });
}

const deactiveSession = (sessionId, setSessions) => {
  return axios.delete(`/api/.ory/sessions/${sessionId}`, {
    headers: { withCredentials: true },
  }).then(resp => {
    refreshSessions(setSessions);
  }).catch(error => {
    alert(error.message);
  });
}

const SessionList = (props) => {
  const {sessions, setSessions} = props;
  if (sessions.length === 0) {
    return (
      <div>
        <p>無其他裝置登入資訊</p>
      </div>
    );
  }

  return sessions.map(session => {
    const [device] = session.devices;
    const agent = new UAParser(device.user_agent);
    const agentResult = agent.getResult();
    const deviceName = agentResult.device.type
      ? agentResult.device.model
      : agentResult.os.name;
    return (
      <div key={session.id}>
        
        <p>Location: {device.location}</p>
        <p>Device: {deviceName}</p>
        <p>Browser: {agentResult.browser.name}</p>
        <p>最近登入: {session.authenticated_at}</p>
        <button onClick={() => deactiveSession(session.id, setSessions)}>Sign out</button>
      </div>
    );
  })
}

const Settings: NextPage = () => {
  const [sessions, setSessions] = useState([])
  const [flow, setFlow] = useState<SettingsFlow>()


  // Get ?flow=... from the URL
  const router = useRouter()
  const { flow: flowId, return_to: returnTo } = router.query

  useEffect(() => {
    refreshSessions(setSessions);
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
        .catch(handleFlowError(router, "settings", setFlow))
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
      .catch(handleFlowError(router, "settings", setFlow))
  }, [flowId, router, router.isReady, returnTo, flow])

  const onSubmit = (values: UpdateSettingsFlowBody) =>
    router
      // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
      // his data when she/he reloads the page.
      .push(`/settings?flow=${flow?.id}`, undefined, { shallow: true })
      .then(() =>
        ory
          .updateSettingsFlow({
            flow: String(flow?.id),
            updateSettingsFlowBody: values,
          })
          .then(({ data }) => {
            // The settings have been saved and the flow was updated. Let's show it to the user!
            setFlow(data)

            // continue_with is a list of actions that the user might need to take before the settings update is complete.
            // It could, for example, contain a link to the verification form.
            if (data.continue_with) {
              for (const item of data.continue_with) {
                switch (item.action) {
                  case "show_verification_ui":
                    router.push("/verification?flow=" + item.flow.id)
                    return
                }
              }
            }
          })
          .catch(handleFlowError(router, "settings", setFlow))
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

      const deleteAccount = async () => {
        const confirmResult = confirm('是否確定刪除帳號?');
        if (confirmResult) {
          const {data} = await axios.get('/api/.ory/sessions/whoami', {
            headers: { withCredentials: true },
          })

          return axios.delete(`https://auth.passon.tw/admin/identities/${data.identity.id}`, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${process.env.ORY_PAT}`
            },
          }).then(resp => {
            router.replace('/');
          }).catch(error => {
            alert(error.message);
          });
        }
      };
  return (
    <>
      <Head>
        <title>
          Profile Management and Security Settings - Ory NextJS Integration
          Example
        </title>
        <meta name="description" content="NextJS + React + Vercel + Ory" />
      </Head>
      <CardTitle style={{ marginTop: 80 }}>
        Profile Management and Security Settings
      </CardTitle>
      <SettingsCard only="profile" flow={flow}>
         <button onClick={deleteAccount}>刪除帳號</button>
      </SettingsCard>
      <SettingsCard only="profile" flow={flow}>
        <H3>Session Management</H3>
        <SessionList sessions={sessions} setSessions={setSessions} />
      </SettingsCard>
      
      <SettingsCard only="profile" flow={flow}>
        <H3>Profile Settings</H3>
        <Messages messages={flow?.ui.messages} />
        <Flow
          hideGlobalMessages
          onSubmit={onSubmit}
          only="profile"
          flow={flow}
        />
      </SettingsCard>
      <SettingsCard only="password" flow={flow}>
        <H3>Change Password</H3>

        <Messages messages={flow?.ui.messages} />
        <Flow
          hideGlobalMessages
          onSubmit={onSubmit}
          only="password"
          flow={flow}
        />
      </SettingsCard>
      <SettingsCard only="oidc" flow={flow}>
        <H3>Manage Social Sign In</H3>

        <Messages messages={flow?.ui.messages} />
        <Flow hideGlobalMessages onSubmit={onSubmit} only="oidc" flow={flow} />
      </SettingsCard>
      <SettingsCard only="lookup_secret" flow={flow}>
        <H3>Manage 2FA Backup Recovery Codes</H3>
        <Messages messages={flow?.ui.messages} />
        <P>
          Recovery codes can be used in panic situations where you have lost
          access to your 2FA device.
        </P>

        <Flow
          hideGlobalMessages
          onSubmit={onSubmit}
          only="lookup_secret"
          flow={flow}
        />
      </SettingsCard>
      <SettingsCard only="totp" flow={flow}>
        <H3>Manage 2FA TOTP Authenticator App</H3>
        <P>
          Add a TOTP Authenticator App to your account to improve your account
          security. Popular Authenticator Apps are{" "}
          <a href="https://www.lastpass.com" rel="noreferrer" target="_blank">
            LastPass
          </a>{" "}
          and Google Authenticator (
          <a
            href="https://apps.apple.com/us/app/google-authenticator/id388497605"
            target="_blank"
            rel="noreferrer"
          >
            iOS
          </a>
          ,{" "}
          <a
            href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US"
            target="_blank"
            rel="noreferrer"
          >
            Android
          </a>
          ).
        </P>
        <Messages messages={flow?.ui.messages} />
        <Flow hideGlobalMessages onSubmit={onSubmit} only="totp" flow={flow} />
      </SettingsCard>
      <SettingsCard only="webauthn" flow={flow}>
        <H3>Manage Hardware Tokens and Biometrics</H3>
        <Messages messages={flow?.ui.messages} />
        <P>
          Use Hardware Tokens (e.g. YubiKey) or Biometrics (e.g. FaceID,
          TouchID) to enhance your account security.
        </P>
        <Flow
          hideGlobalMessages
          onSubmit={onSubmit}
          only="webauthn"
          flow={flow}
        />
      </SettingsCard>
      <ActionCard wide>
        <Link href="/" passHref>
          <CenterLink>Go back</CenterLink>
        </Link>
      </ActionCard>
    </>
  )
}

export default Settings
