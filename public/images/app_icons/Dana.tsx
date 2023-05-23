interface DanaProps {
  color?: string
}

const Dana: React.FC<DanaProps> = ({ color = "#FFF" }) => {
  return (
    <svg
      width="69"
      height="54"
      viewBox="0 0 69 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_2525_6212"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="69"
        height="54"
      >
        <path
          d="M34.4967 0C31.7596 0 27.3356 0.808816 18.4943 4.07696C10.7862 6.92645 9.3762 7.62567 8.15362 8.18899C2.21073 10.9311 0.5 13.7652 0.5 20.9109V34.0404C0.5 40.671 1.51336 42.6042 7.55868 45.2499C9.65297 46.1639 12.8216 47.7465 20.9024 50.8283C24.4786 52.1851 29.8374 54 34.4946 54C39.1517 54 44.5345 52.1851 48.0954 50.8283C56.1914 47.7465 59.3601 46.1639 61.4566 45.2499C67.5019 42.6042 68.5 40.671 68.5 34.0404V20.9109C68.5 13.7652 66.8132 10.9311 60.8616 8.19776C59.6391 7.63444 58.2312 6.93083 50.5188 4.08573C41.6883 0.804432 37.2513 0 34.4967 0ZM34.4967 3.7131C37.4082 3.7131 42.2332 4.97126 49.2504 7.5621C56.3091 10.1661 57.9675 10.9377 59.0724 11.4462L59.3274 11.5645C61.7246 12.6605 63.0518 13.6425 63.7557 14.8151C64.4858 16.0339 64.8127 17.9145 64.8127 20.9109V34.0404C64.8127 36.8899 64.6078 38.3717 64.1044 39.1936C63.601 40.0156 62.3915 40.8003 59.9943 41.8436C59.5584 42.0387 59.0746 42.2535 58.5255 42.5012C56.3898 43.47 53.1622 44.9321 46.7944 47.3563C44.8897 48.0818 39.0972 50.2869 34.4989 50.2869C29.942 50.2869 24.1234 48.0796 22.2165 47.3563C15.8639 44.9342 12.6386 43.4722 10.5029 42.5056C9.95153 42.2557 9.47427 42.0387 9.03623 41.848C6.63902 40.7981 5.40773 40.0046 4.8956 39.1892C4.38347 38.3738 4.20477 36.8746 4.20477 34.0404V20.9109C4.20477 17.9189 4.53166 16.0404 5.26608 14.8195C5.97217 13.6447 7.29717 12.6715 9.69655 11.5645L9.95589 11.4462C11.0586 10.9355 12.7236 10.1661 19.7779 7.5621C26.7799 4.96907 31.5983 3.7131 34.4967 3.7131Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask0_2525_6212)">
        <circle cx="34.5" cy="28" r="36" fill="url(#paint0_linear_2525_6212)" />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_2525_6212"
          x1="34.4999"
          y1="-8"
          x2="34.4999"
          y2="64"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF008B" />
          <stop offset="0.130208" stopColor="#FF9966" />
          <stop offset="0.260417" stopColor="#FFFF66" />
          <stop offset="0.505208" stopColor="#00EFE4" />
          <stop offset="0.666667" stopColor="#4B89F2" />
          <stop offset="0.854167" stopColor="#A62BC3" />
          <stop offset="1" stopColor="#FF008B" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default Dana
