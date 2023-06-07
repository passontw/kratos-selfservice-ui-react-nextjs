import Box from "@mui/material/Box"

import Cmid from "../../public/images/app_icons/Cmid"

import { CmidHeadWrap } from "./styles"

interface CmidHeadProps {}

const CmidHead: React.FC<CmidHeadProps> = () => {
  return (
    <CmidHeadWrap>
      <Cmid />
      Master ID
    </CmidHeadWrap>
  )
}

export default CmidHead
