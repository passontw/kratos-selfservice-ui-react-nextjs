import Box from "@mui/material/Box"
import { SettingsFlow, UpdateSettingsFlowBody } from "@ory/client"
import axios from "axios"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"

import AccountLayout from "../components/Layout/AccountLayout"
import LinkNav from "../components/LinkNav"
import MenuFooter from "../components/MenuFooter"
import { Methods, ActionCard, Messages } from "../pkg"
import { handleFlowError } from "../pkg/errors"
import ory from "../pkg/sdk"
import Cmodx from "../public/images/app_icons/Cmodx"
import MasterControl from "../public/images/app_icons/MasterControl"
import Stormplay from "../public/images/app_icons/Stormplay"
import { setActiveNav } from "../state/store/slice/layoutSlice"
import { Navs } from "../types/enum"

interface Props {
  flow?: SettingsFlow
  only?: Methods
}

const DeviceManagement: NextPage = () => {
  const dispatch = useDispatch()
  const [sessions, setSessions] = useState([])
  const [flow, setFlow] = useState<SettingsFlow>()
  const router = useRouter()

  const { flow: flowId, return_to: returnTo } = router.query

  useEffect(() => {
    dispatch(setActiveNav(Navs.DEVICEMANAGEMENT))
  }, [])

  return (
    <AccountLayout>
      <Box
        display="flex"
        flexDirection="column"
        position="relative"
        height="100%"
        marginTop={{
          sm: "48px",
          xs: "24px",
        }}
      ></Box>
      <MenuFooter Copyright="Copyright© 2023 Cooler Master Inc. All rights reserved." />
      <LinkNav />
    </AccountLayout>
  )
}

export default DeviceManagement
