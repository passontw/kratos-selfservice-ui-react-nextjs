import { FormGroup } from '@mui/material';
import { styled } from '@mui/material/styles';

const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: '50%',
  border: '1px solid #CA4AE8',
  backgroundColor: '#2B2B33',
  width: 22,
  height: 22,
  display: 'flex',
  alignItems: 'center',
  'input:disabled ~ &': {
    boxShadow: 'none',
    background:
      theme.palette.mode === 'dark'
        ? 'rgba(57,75,89,.5)'
        : 'rgba(206,217,224,.5)',
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: '#CA4AE8',
  backgroundImage:
    'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
  '&:before': {
    display: 'block',
    width: 20,
    height: 20,
    backgroundImage: 'radial-gradient(#fff,#fff 20%,transparent 22%)',
    content: '""',
  },
  'input:hover ~ &': {
    backgroundColor: '#CA4AE8',
  },
});

const StyledFormGroup = styled(FormGroup, {
  shouldForwardProp: (prop) => prop !== 'direction',
})<{ direction?: 'row' | 'column' }>(({ direction }) => ({
  // marginBottom: '24px',
  width: 'fit-content',
  '& .MuiFormGroup-root': {
    flexDirection: direction === 'row' ? 'row' : 'column',
    gap: '25px',
  },
  '& .disabledRadio': {
    '& .MuiButtonBase-root.Mui-checked .MuiSvgIcon-root': {
      opacity: 0.38,
    },
    '& .MuiButtonBase-root.Mui-checked + .MuiTypography-root': {
      color: '#868A8F',
    },
  },
}));

export { BpCheckedIcon, BpIcon, StyledFormGroup };
