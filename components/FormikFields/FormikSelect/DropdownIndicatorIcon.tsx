interface DropdownIndicatorIconProps {
  // color: string;
}

// eslint-disable-next-line react/prop-types
const DropdownIndicatorIcon: React.FC<DropdownIndicatorIconProps> = () => {
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
        d="M18.7071 9.29289C18.3166 8.90237 17.6834 8.90237 17.2929 9.29289L12 14.5858L6.70711 9.29289C6.31658 8.90237 5.68342 8.90237 5.29289 9.29289C4.90237 9.68342 4.90237 10.3166 5.29289 10.7071L11.2929 16.7071C11.6834 17.0976 12.3166 17.0976 12.7071 16.7071L18.7071 10.7071C19.0976 10.3166 19.0976 9.68342 18.7071 9.29289Z"
        fill="#717197"
      />
    </svg>
  )
}

export default DropdownIndicatorIcon
