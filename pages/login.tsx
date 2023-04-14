import type { NextPage } from "next"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import {  setActiveNav } from "../state/store/slice/layoutSlice"
import { Navs } from "../types/enum"
import AccountLayout from '../components/Layout/AccountLayout'
import AppsList from '../components/AppsList'

const Login: NextPage = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setActiveNav(Navs.LOGIN))
  }, [])
  
  return (
    <>
      {/* CUSTOMIZE UI BASED ON CLIENT ID */}
      {/* <Head>
        <title>Sign in - Ory NextJS Integration Example</title>
        <meta name="description" content="NextJS + React + Vercel + Ory" />
      </Head> */}
      <AccountLayout>
        <AppsList />
      </AccountLayout>
    </>
  )
}

export default Login
