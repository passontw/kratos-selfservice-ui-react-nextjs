/* eslint-disable react/prop-types */
import Box from '@mui/material/Box';
import { useState } from 'react';

interface EditIconProps {
  color?: string;
  hoverColor?: string;
  size?: string;
}

// eslint-disable-next-line react/prop-types
const EditIcon: React.FC<EditIconProps> = ({
  color = '#FFF',
  hoverColor = '#FFF',
  size = '20',
}) => {
  const originalColor = color;
  const [iconColor, setIconColor] = useState(color);

  return (
    <Box
      display="flex"
      alignItems="center"
    // onMouseEnter={() => setIconColor(hoverColor)}
    // onMouseLeave={() => setIconColor(originalColor)}
    // sx={{
    //   '&:hover': {
    //     cursor: 'pointer',
    //     // '& svg': {
    //     //   fill: '#FFC107',
    //     // },
    //   },
    // }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.0833 7.43752L12.5417 3.93752L13.7083 2.77085C14.0278 2.45141 14.4203 2.29169 14.8858 2.29169C15.3508 2.29169 15.7431 2.45141 16.0625 2.77085L17.2292 3.93752C17.5486 4.25696 17.7153 4.64252 17.7292 5.09419C17.7431 5.5453 17.5903 5.93058 17.2708 6.25002L16.0833 7.43752ZM3.33333 17.5C3.09722 17.5 2.89944 17.42 2.74 17.26C2.58 17.1006 2.5 16.9028 2.5 16.6667V14.3125C2.5 14.2014 2.52083 14.0939 2.5625 13.99C2.60417 13.8856 2.66667 13.7917 2.75 13.7084L11.875 4.79169L15.4167 8.33335L6.29167 17.25C6.20833 17.3334 6.11472 17.3959 6.01083 17.4375C5.90639 17.4792 5.79861 17.5 5.6875 17.5H3.33333Z"
          fill={iconColor}
        />
      </svg>
    </Box>
  );
};

export default EditIcon;
