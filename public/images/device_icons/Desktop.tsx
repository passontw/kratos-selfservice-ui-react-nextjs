interface DesktopProps {
  color?: string
}

const Desktop: React.FC<DesktopProps> = ({ color = "#FFF" }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V16C21 17.1046 20.1046 18 19 18H5C3.89543 18 3 17.1046 3 16V5ZM4.7998 4.57837H19.1998V16.4205H4.7998V4.57837ZM3 19C2.44772 19 2 19.4477 2 20C2 20.5523 2.44772 21 3 21H21C21.5523 21 22 20.5523 22 20C22 19.4477 21.5523 19 21 19H3Z"
        fill="#717197"
      />
    </svg>
  )
}

export default Desktop
