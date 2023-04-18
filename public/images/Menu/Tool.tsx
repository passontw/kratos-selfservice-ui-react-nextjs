interface ToolProps {
  color?: string,
}

const Tool: React.FC<ToolProps> = ({ color = "#FFF" }) => {
  return (
    <div>
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M31.2301 15.1741C31.0652 14.9492 30.8254 14.7693 30.5705 14.6793L28.0219 13.8248L29.2213 11.4262C29.3412 11.1713 29.3862 10.8865 29.3412 10.6166C29.2962 10.3468 29.1613 10.0919 28.9664 9.88201L26.088 7.00361C25.8931 6.80872 25.6383 6.67379 25.3534 6.62882C25.0686 6.58384 24.7837 6.62882 24.5439 6.74875L22.1452 7.94808L21.2907 5.3995C21.2007 5.12965 21.0358 4.90478 20.7959 4.73987C20.5711 4.58995 20.3012 4.5 20.0164 4.5H15.9686C15.6838 4.5 15.4139 4.58995 15.1741 4.75486C14.9492 4.91977 14.7693 5.15963 14.6793 5.41449L13.8248 7.96308L11.4262 6.76374C11.1713 6.64381 10.8865 6.59883 10.6166 6.64381C10.3468 6.68878 10.0919 6.82371 9.88201 7.0186L7.00361 9.897C6.80872 10.0919 6.67379 10.3468 6.62882 10.6316C6.58384 10.9164 6.62882 11.2013 6.74875 11.4411L7.94808 13.8398L5.3995 14.6943C5.12965 14.7843 4.90478 14.9492 4.73987 15.1891C4.58995 15.4139 4.5 15.6838 4.5 15.9686V20.0164C4.5 20.3012 4.58995 20.5711 4.75486 20.8109C4.91977 21.0358 5.15963 21.2157 5.41449 21.3057L7.96308 22.1602L6.76374 24.5589C6.64381 24.8137 6.59883 25.0986 6.64381 25.3684C6.68878 25.6383 6.82371 25.8931 7.0186 26.103L9.897 28.9814C10.0919 29.1763 10.3468 29.3112 10.6316 29.3562C10.9164 29.4012 11.2013 29.3562 11.4411 29.2363L13.8398 28.0369L14.6943 30.5855C14.7843 30.8554 14.9642 31.0802 15.1891 31.2451C15.4139 31.41 15.6988 31.5 15.9836 31.5H20.0314C20.3162 31.5 20.5861 31.41 20.8259 31.2451C21.0508 31.0802 21.2307 30.8404 21.3207 30.5855L22.1752 28.0369L24.5738 29.2363C24.8287 29.3562 25.0986 29.4012 25.3834 29.3412C25.6682 29.2812 25.9081 29.1613 26.103 28.9664L28.9814 26.088C29.1763 25.8931 29.3112 25.6383 29.3562 25.3534C29.4012 25.0686 29.3562 24.7837 29.2363 24.5439L28.0369 22.1452L30.5855 21.2907C30.8554 21.2007 31.0802 21.0358 31.2451 20.7959C31.41 20.5711 31.5 20.3012 31.5 20.0164V15.9686C31.5 15.6838 31.41 15.4139 31.2451 15.1741H31.2301ZM22.475 20.9908C21.8753 21.8753 21.0358 22.565 20.0464 22.9847C19.0569 23.3895 17.9775 23.4944 16.9281 23.2846C15.8787 23.0747 14.9192 22.565 14.1696 21.8004C13.42 21.0508 12.8953 20.0913 12.6855 19.0419C12.4756 17.9925 12.5805 16.9131 12.9853 15.9237C13.3901 14.9342 14.0797 14.0947 14.9792 13.495C15.8637 12.8953 16.9131 12.5805 17.9775 12.5805C19.4017 12.5805 20.781 13.1502 21.8004 14.1546C22.8198 15.1741 23.3745 16.5383 23.3745 17.9775C23.3745 19.0419 23.0597 20.0913 22.46 20.9758L22.475 20.9908Z" fill={color}/>
      </svg>
    </div>
  )
}

export default Tool
