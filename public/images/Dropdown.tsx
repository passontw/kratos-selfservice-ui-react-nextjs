interface DropdownProps {
  color?: string
}

const Dropdown: React.FC<DropdownProps> = ({ color = "#FFF" }) => {
  return (
    <div>
      <svg
        width="10"
        height="8"
        viewBox="0 0 10 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.759049 0.666504H9.24095C9.39109 0.666541 9.53784 0.718104 9.66266 0.814674C9.78748 0.911244 9.88477 1.04849 9.94222 1.20905C9.99967 1.36961 10.0147 1.54629 9.98542 1.71674C9.95614 1.88719 9.88386 2.04377 9.77771 2.16668L5.53676 7.07586C5.39439 7.24061 5.20132 7.33317 5 7.33317C4.79868 7.33317 4.60561 7.24061 4.46324 7.07586L0.222287 2.16668C0.116142 2.04377 0.0438603 1.88719 0.0145794 1.71674C-0.0147015 1.54629 0.000333386 1.36961 0.0577829 1.20905C0.115232 1.04849 0.212517 0.911244 0.337339 0.814674C0.462161 0.718104 0.608915 0.666541 0.759049 0.666504Z"
          fill={color}
        />
      </svg>
    </div>
  )
}

export default Dropdown
