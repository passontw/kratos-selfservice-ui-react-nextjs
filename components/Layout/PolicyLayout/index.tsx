import Box from "@mui/material/Box"
import { ReactNode } from "react"
import { useSelector } from "react-redux"
import Cmid from '../../../public/images/app_icons/Cmid'
import { selectActiveNav } from "../../../state/store/slice/layoutSlice"
import { Navs } from "../../../types/enum"

import { 
  StyledWrapper, 
  StyledContent, 
} from "./styles"

interface PrivacyPolicyLayoutProps {
  children: ReactNode
  title: string
}

const PrivacyPolicyLayout: React.FC<PrivacyPolicyLayoutProps> = ({ children, title }) => {
  return (
    <StyledWrapper>
      <Box display="flex" flexDirection="column" width="800px">
        <Box display='flex' alignItems='center' width='100%' gap='16px' paddingTop="48px" >
          <Cmid />
          <Box fontFamily="Teko" fontSize={{xs:'24px', sm:'32px'}} color="#fff" lineHeight='44px' textTransform="uppercase" >Cooler Master ID</Box>
        </Box>

        <Box fontFamily="Teko" fontSize="48px" color="#A2A1C6" padding="60px 0px 32px">
          {title}
        </Box>
        <StyledContent>
          {children}
        </StyledContent>
      </Box>
    </StyledWrapper>
  )
}

export default PrivacyPolicyLayout
