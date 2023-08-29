import React from 'react';
import Button from '@mui/material/Button';
import { SxProps } from '@mui/material/styles';
import { Box } from '@mui/material';
import StyledButton from './styled';

interface Props {
  icon?: React.ReactNode;
  text: string;
  sx?: SxProps;
  onClick?: () => void;
  background?: string;
  disable?: boolean;
}
const ButtonAction: React.FC<Props> = ({
  sx,
  icon,
  text,
  onClick,
  background,
  disable,
}) => {
  return (
    <StyledButton
      sx={sx}
      variant="contained"
      disableElevation
      disableRipple
      onClick={onClick}
      background={background}
      disabled={disable}
    >
      {icon}
      <Box sx={{ paddingLeft: icon ? '12px' : '' }}>{text}</Box>
    </StyledButton>
  );
};

export default ButtonAction;
