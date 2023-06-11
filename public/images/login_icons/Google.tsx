import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectActiveNav } from '../../../state/store/slice/layoutSlice';
import { Navs } from '../../../types/enum';

interface GoogleProps {
  color?: string
}

const Google: React.FC<GoogleProps> = ({ color = "#FFF" }) => {
  const currentNav = useSelector(selectActiveNav);
  const fixedSize = currentNav === Navs.ACCOUNT

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <svg
        width={fixedSize && windowWidth <= 600 ? "24" : "44"}
        height={fixedSize && windowWidth <= 600 ? "24" : "44"}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="44" height="44" rx="22" fill="white" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.9898 21.9997C14.9898 21.1994 15.1227 20.4321 15.36 19.7126L11.2078 16.5419C10.3985 18.1849 9.94267 20.0364 9.94267 21.9997C9.94267 23.9614 10.3981 25.8116 11.206 27.4536L15.356 24.2768C15.1209 23.5605 14.9898 22.796 14.9898 21.9997Z"
          fill="#FBBC05"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M22.2802 14.7197C24.0187 14.7197 25.5889 15.3357 26.8226 16.3437L30.4116 12.7597C28.2246 10.8557 25.4207 9.67969 22.2802 9.67969C17.4046 9.67969 13.2142 12.4678 11.2078 16.5419L15.36 19.7126C16.3167 16.8085 19.0437 14.7197 22.2802 14.7197Z"
          fill="#EA4335"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M22.2802 29.2797C19.0439 29.2797 16.3168 27.1908 15.36 24.2868L11.2078 27.4569C13.2142 31.5315 17.4046 34.3197 22.2802 34.3197C25.2894 34.3197 28.1624 33.2511 30.3186 31.2491L26.3774 28.2022C25.2653 28.9027 23.8649 29.2797 22.2802 29.2797Z"
          fill="#34A853"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M34.0567 21.9997C34.0567 21.2716 33.9445 20.4876 33.7763 19.7597H22.2802V24.5197H28.8975C28.5666 26.1427 27.6662 27.3903 26.3774 28.2022L30.3186 31.2491C32.5836 29.147 34.0567 26.0154 34.0567 21.9997Z"
          fill="#4285F4"
        />
      </svg>
    </>
  )
}

export default Google
