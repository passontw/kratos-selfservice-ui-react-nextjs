import React from 'react';
import { styled } from '@mui/system';
import Button from '@mui/material/Button';
import { SxProps } from '@mui/material/styles';
import Tooltip, { TooltipProps } from '@mui/material/Tooltip';

interface Props {
  ariaDescribedby?: string;
  focus?: boolean;
  tipOption?: { text: string; position: TooltipProps['placement'] };
  category?: 'feature' | 'trigger' | 'link' | 'menu' | 'remove' | 'edit';
  defaultHiddenCircle?: boolean;
  isRotate?: boolean;
  icon: React.ReactNode;
  width?: string | number;
  height?: string | number;
  sx?: SxProps;
  handleClick?: (e: any) => void;
}
interface BtnStyle {
  default: string;
  hover: string;
  active: string;
  focus?: string;
}
interface BtnStyles {
  [key: string]: BtnStyle;
}

const btnStyles: BtnStyles = {
  feature: {
    default: '#222223',
    hover: '#4E2361',
    active: '#33243F',
  },
  link: {
    default: '',
    hover: 'rgba(255,255,255,0.15)',
    active: 'rgba(255,255,255,0.,10)',
  },
  trigger: {
    default: '#333336',
    hover: '#616169',
    active: '#4B4B53',
    focus: '',
  },
  menu: {
    default: '',
    hover: '',
    active: '',
    focus: '',
  },
  remove: {
    default: '',
    hover: 'rgba(188, 188, 191, 0.3)',
    active: 'rgba(188, 188, 191, 0.3)',
  },
  edit: {
    default: '',
    hover: 'rgba(188, 188, 191, 0.3)',
    active: 'rgba(188, 188, 191, 0.3)',
  },
};

const StyledCircle = styled(Button, {
  shouldForwardProp: () => true,
})<{
  focus?: string;
  category: string;
  defaulthiddencircle?: string;
  isrotate?: string;
  width: string | number;
  height: string | number;
}>(({ theme, category, defaulthiddencircle, width, height, isrotate }) => ({
  minWidth: 'unset',
  borderRadius: '50%',
  transition: '0.2s',
  backgroundColor:
    defaulthiddencircle === 'true'
      ? 'transparent'
      : btnStyles[category]?.default,
  width,
  height,
  '&:hover': {
    backgroundColor: btnStyles[category]?.hover,
  },
  '&:active': {
    backgroundColor: btnStyles[category]?.active,
  },
  '&.focus': {
    backgroundColor: btnStyles[category]?.focus,
  },
  // '&:focus': {
  //   backgroundColor: focus === 'true' ? btnStyles[category]?.focus : '',
  // },
  '& img': {
    width: 'auto',
    height: 'auto',
  },
  ...(isrotate && {
    transform: isrotate === 'true' ? 'rotateZ(0)' : 'rotateZ(-180deg)',
  }),
}));

const ButtonCircleIcon: React.FC<Props> = (props) => {
  const {
    ariaDescribedby,
    focus,
    tipOption = { text: '', position: 'bottom' },
    category = 'trigger',
    defaultHiddenCircle,
    isRotate,
    icon,
    width = '40px',
    height = '40px',
    sx,
    handleClick,
  } = props;

  return (
    <Tooltip
      title={tipOption.text}
      placement={tipOption.position}
      sx={{ background: 'red' }}
    >
      <StyledCircle
        aria-describedby={ariaDescribedby}
        className={focus ? 'focus' : ''}
        disableRipple
        category={category}
        defaulthiddencircle={defaultHiddenCircle?.toString()}
        width={width}
        height={height}
        isrotate={isRotate?.toString()}
        onClick={handleClick}
        sx={sx}
      >
        {icon}
      </StyledCircle>
    </Tooltip>
  );
};

export default ButtonCircleIcon;
