interface ErrorIconProps {
  color?: string
}

const ErrorIcon: React.FC<ErrorIconProps> = ({ color = "#FFF" }) => {
  return (
    <div>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.99996 1.6665C5.39759 1.6665 1.66663 5.39746 1.66663 9.99984C1.66663 14.6022 5.39759 18.3332 9.99996 18.3332C14.6023 18.3332 18.3333 14.6022 18.3333 9.99984C18.3333 5.39746 14.6023 1.6665 9.99996 1.6665ZM12.7339 8.15019C12.978 7.90612 12.978 7.51039 12.7339 7.26631C12.4898 7.02223 12.0941 7.02223 11.85 7.26631L10.0003 9.11604L8.15056 7.26631C7.90648 7.02223 7.51075 7.02223 7.26668 7.26631C7.0226 7.51039 7.0226 7.90612 7.26668 8.15019L9.1164 9.99992L7.26668 11.8496C7.0226 12.0937 7.0226 12.4894 7.26668 12.7335C7.51075 12.9776 7.90648 12.9776 8.15056 12.7335L10.0003 10.8838L11.85 12.7335C12.0941 12.9776 12.4898 12.9776 12.7339 12.7335C12.978 12.4894 12.978 12.0937 12.7339 11.8496L10.8842 9.99992L12.7339 8.15019Z"
          fill="#F24867"
        />
      </svg>
    </div>
  )
}

export default ErrorIcon
