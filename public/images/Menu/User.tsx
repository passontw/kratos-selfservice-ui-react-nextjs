interface UserProps {
  color?: string,
}

const User: React.FC<UserProps> = ({ color = "#FFF" }) => {
  return (
    <div>
<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18 16.5C21.3137 16.5 24 13.8137 24 10.5C24 7.18629 21.3137 4.5 18 4.5C14.6863 4.5 12 7.18629 12 10.5C12 13.8137 14.6863 16.5 18 16.5Z" fill={ color } />
<path d="M29.3722 24.7185C29.7963 25.2111 30 25.8499 30 26.4999V28.5C30 30.1569 28.6569 31.5 27 31.5H9C7.34314 31.5 6 30.1569 6 28.5V26.4999C6 25.8499 6.20364 25.2111 6.6277 24.7185C9.37852 21.5232 13.453 19.5 18 19.5C22.5469 19.5 26.6214 21.5232 29.3722 24.7185Z" fill={color} />
</svg>
    </div>
  )
}

export default User
