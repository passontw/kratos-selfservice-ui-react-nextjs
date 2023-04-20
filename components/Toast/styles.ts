import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledStatus = styled(Box)(({ theme }) => ({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	background: 'rgba(54, 179, 126, 0.16)',
	borderRadius: '12px',
	width: 40,
	height: 40,
	marginRight: '12px'

}));

export const StyledMessage = styled(Typography)(({ theme }) => ({
	fontSize: '14px', // anchornav width 228 + gap 12
	color: '#212B36',
	fontWeight: 600,
	borderRadius: '8px'
}));
