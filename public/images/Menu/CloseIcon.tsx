interface CloseIconProps {
  color?: string,
}

const CloseIcon: React.FC<CloseIconProps> = ({ color = "#FFF" }) => {
  return (
    <>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 7L7 17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <path d="M17 17L7 7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </>
  )
}

export default CloseIcon
