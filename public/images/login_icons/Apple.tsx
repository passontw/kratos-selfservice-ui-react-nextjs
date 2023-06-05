import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectActiveNav } from '../../../state/store/slice/layoutSlice';
import { Navs } from '../../../types/enum';

interface AppleProps {
  color?: string
}

const Apple: React.FC<AppleProps> = ({ color = "#FFF" }) => {
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
          d="M22.3235 14.4615C23.5315 14.4615 25.0457 13.6071 25.9474 12.4679C26.7641 11.4355 27.3596 9.99364 27.3596 8.55181C27.3596 8.35601 27.3426 8.1602 27.3086 8C25.9645 8.0534 24.3481 8.94342 23.3783 10.136C22.6127 11.0439 21.9152 12.4679 21.9152 13.9275C21.9152 14.1411 21.9492 14.3547 21.9662 14.4259C22.0513 14.4437 22.1874 14.4615 22.3235 14.4615ZM18.07 36C19.7204 36 20.452 34.843 22.5106 34.843C24.6033 34.843 25.0627 35.9644 26.9002 35.9644C28.7037 35.9644 29.9117 34.22 31.0516 32.5111C32.3277 30.5531 32.8551 28.6306 32.8891 28.5416C32.77 28.506 29.3162 27.0286 29.3162 22.8811C29.3162 19.2854 32.0384 17.6656 32.1915 17.541C30.3881 14.8353 27.6488 14.7641 26.9002 14.7641C24.8756 14.7641 23.2252 16.0458 22.1874 16.0458C21.0645 16.0458 19.5842 14.8353 17.8318 14.8353C14.4971 14.8353 11.1113 17.719 11.1113 23.1659C11.1113 26.548 12.3704 30.1259 13.9186 32.4399C15.2457 34.398 16.4026 36 18.07 36Z"
          fill="black"
        />
      </svg>
    </>
  )
}

export default Apple
