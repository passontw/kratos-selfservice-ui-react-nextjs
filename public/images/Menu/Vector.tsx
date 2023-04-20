interface VercelProps {
  color?: string,
}

const Vercel: React.FC<VercelProps> = ({ color = "#FFF" }) => {
  return (
    <>
      <svg width="6" height="40" viewBox="0 0 6 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 40L4.98 33.2417C5.64 32.35 6 31.225 6 30.075V9.93333C6 8.775 5.64 7.65833 4.98 6.76667L0 0V40Z" fill={color} />
      </svg>
    </>
  )
}

export default Vercel
