import Box from "@mui/material/Box"
import { useSelector } from "react-redux"

import Cmid from "../../public/images/app_icons/Cmid"
import CmidFixed from "../../public/images/app_icons/CmidFixed"
import { selectActiveNav } from "../../state/store/slice/layoutSlice"
import { Navs } from "../../types/enum"

import { CmidHeadWrap } from "./styles"

interface CmidHeadProps {}

const CmidHead: React.FC<CmidHeadProps> = () => {
  const currentNav = useSelector(selectActiveNav)
  const fixedSize =
    currentNav === Navs.LOGIN ||
    currentNav === Navs.REGISTER ||
    currentNav === Navs.RECOVERY ||
    currentNav === Navs.SETTINGS ||
    currentNav === Navs.VERIFICATION

  return (
    <CmidHeadWrap>
      {fixedSize ? <CmidFixed /> : <Cmid />}
      Master ID
    </CmidHeadWrap>
  )
}

export default CmidHead
