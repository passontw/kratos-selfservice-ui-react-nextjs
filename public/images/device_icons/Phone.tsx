interface PhoneProps {
  color?: string
}

const Phone: React.FC<PhoneProps> = ({ color = "#FFF" }) => {
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
        d="M5.5 3C5.5 1.89543 6.39543 1 7.5 1H16.5C17.6046 1 18.5 1.89543 18.5 3V21C18.5 22.1046 17.6046 23 16.5 23H7.5C6.39543 23 5.5 22.1046 5.5 21V3ZM7.5 4H16.5V18H7.5V4ZM12 22C12.8284 22 13.5 21.3284 13.5 20.5C13.5 19.6716 12.8284 19 12 19C11.1716 19 10.5 19.6716 10.5 20.5C10.5 21.3284 11.1716 22 12 22Z"
        fill="#717197"
      />
    </svg>
  )
}

export default Phone
