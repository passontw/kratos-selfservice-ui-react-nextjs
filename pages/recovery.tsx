import Box from "@mui/material/Box"
import { LoginFlow } from "@ory/client"
import axios from "axios"
import { AxiosError } from "axios"
import cloneDeep from "lodash/cloneDeep"
import isEmpty from "lodash/isEmpty"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import queryString from "query-string"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import styled from "styled-components"

import { api } from "../axios/api"
import CmidHead from "../components/CmidHead"
import { LogoutLink, Flow } from "../pkg"
import { handleGetFlowError, handleFlowError } from "../pkg/errors"
import ory from "../pkg/sdk"
import { setActiveNav } from "../state/store/slice/layoutSlice"
import { Navs } from "../types/enum"
import { loginFormSchema } from "../util/schemas"
import { handleYupSchema, handleYupErrors } from "../util/yupHelpers"

const { NEXT_PUBLIC_REDIRECT_URI } = process.env

const getSessionData = async () => {
  try {
    return await ory.toSession()
  } catch (err) {
    return {}
  }
}

const Recovery: NextPage = () => {
  const [flow, setFlow] = useState<LoginFlow>()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setActiveNav(Navs.RECOVERY))
  }, [])
  // Get ?flow=... from the URL
  const router = useRouter()
  const {
    login_challenge,
    return_to: returnTo,
    flow: flowId,
    // Refresh means we want to refresh the session. This is needed, for example, when we want to update the password
    // of a user.
    refresh,
    // AAL = Authorization Assurance Level. This implies that we want to upgrade the AAL, meaning that we want
    // to perform two-factor authentication/verification.
    aal,
  } = router.query

  const StyledLine = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    .text {
      position: relative;
      display: flex;
      justify-content: center;
      width: 100%;

      &:after {
        position: absolute;
        content: "";
        height: 2px;
        background-color: #a5a5a9;
        width: calc(50% - 92px - 12px);
        top: 50%;
        right: 0px;
        margin-left: 12px;
      }

      &:before {
        position: absolute;
        content: "";
        height: 2px;
        background-color: #a5a5a9;
        width: calc(50% - 92px - 12px);
        top: 50%;
        left: 0px;
        margin-right: 12px;
      }
    }
  `

  return (
    <>
      <div className="loginWrapper">
        <div>
          <title>Sign in - Ory NextJS Integration Example</title>
          <meta name="description" content="NextJS + React + Vercel + Ory" />
        </div>
        <CmidHead />
        <Box fontFamily="Teko" fontSize="36px" color="#717197" mt="62px">
          Welcome back
        </Box>
        {/* <Flow onSubmit={onSubmit} flow={flow} /> */}
        <Box
          mt="8px"
          mb="38px"
          // textAlign="center"
          color="#A5A5A9"
          fontSize="14px"
          fontFamily="open sans"
          display="flex"
          justifyContent="center"
          gap="4px"
        >
          <Box>Don’t have an account?</Box>
          <Box
            color="#CA4AE8"
            sx={{
              cursor: "pointer",
            }}
            onClick={() => router.push("/registration")}
          >
            Sign up
          </Box>
        </Box>
        <Box
          color="#A5A5A9"
          fontSize="14px"
          fontFamily="open sans"
          display="flex"
          justifyContent="center"
        >
          <StyledLine>
            <span className="text">Or login with other accounts</span>
          </StyledLine>
        </Box>
      </div>
    </>
  )
}

export default Recovery
