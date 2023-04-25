import Box from "@mui/material/Box"

interface TextProps {
  children?: React.ReactNode
  color?: string
  size?: string
  font?: string
  weight?: string
  my?: string
}

const Text: React.FC<TextProps> = ({
  children,
  color = "#A5A5A9",
  size = "14px",
  font = "open sans",
  weight = 400,
  my = "0",
}) => {
  return (
    <Box
      color={color}
      fontSize={size}
      fontFamily={font}
      fontWeight={weight}
      my={my}
    >
      {children}
    </Box>
  )
}

export default Text
