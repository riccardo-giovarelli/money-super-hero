import { AlertProps, SnackbarProps } from '@mui/material';


export interface AlertSnackbarProps {
  message: string;
  autoHideDuration?: SnackbarProps['autoHideDuration'];
  severity: AlertProps['severity'];
  variant?: AlertProps['variant'];
  open: SnackbarProps['open'];
  onClose: () => void;
}
