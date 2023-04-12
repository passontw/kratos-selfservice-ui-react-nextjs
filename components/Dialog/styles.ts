import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/system';
import Button from '@mui/material/Button';

const StyledDialogTitle = styled(DialogTitle, {
  shouldForwardProp: (prop) => prop !== 'titleHeight',
})<{ titleHeight?: number | string }>(({ titleHeight }) => ({
  color: '#FFF',
  letterSpacing: '1px',
  backgroundColor: '#1E1E28',
  fontSize: '28px',
  fontFamily: 'Teko',
  fontWeight: 600,
  // lineHeight: '24px',
  height: titleHeight || '72px',
  borderBottom: `1px solid #000`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const StyledDialogContent = styled(DialogContent, {
  shouldForwardProp: (prop) => prop !== 'center',
})<{ center?: boolean; sub?: boolean }>(({ center, sub }) => ({
  // padding: sub ? 0 : '40px',
  padding: 0,
  // maxHeight: center ? '472px' : '570px',
  '&::-webkit-scrollbar': {
    width: 5,
    height: 0,
  },
  '&::-webkit-scrollbar-track': {
    borderRadius: 4,
    backgroundColor: '#FFF',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'lightgray',
    borderRadius: 4,
  },
}));

const StyledEditNameButton = styled(Button)(() => ({
  '&.MuiButtonBase-root': {
    fontWeight: 500,
    display: 'inline-block',
    borderRadius: '8px',
    margin: '0px 8px',
    padding: '6px 12px',
  },
  '&.MuiButton-outlined': {
    background: 'transparent',
    color: 'purple',
    border: `1px solid purple`,
    '&:hover': {
      border: `1px solid lavender`,
      color: 'lavender',
    },
  },
  '&.MuiButton-contained': {
    color: '#fff',
    background: 'purple',
    '&:hover': {
      background: 'lavender',
    },
  },
}));

export { StyledDialogContent, StyledDialogTitle, StyledEditNameButton };
