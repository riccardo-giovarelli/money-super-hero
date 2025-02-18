import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Alert, Snackbar, SnackbarCloseReason } from '@mui/material';

import { AlertSnackbarProps } from './AlertSnackbar.type';


const AlertSnackbar = ({
  message,
  autoHideDuration = null,
  severity,
  variant = 'filled',
  open,
  onClose,
}: AlertSnackbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      setIsOpen(open);
    }
  }, [open]);

  const handleClose = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose();
    setIsOpen(false);
  };

  return (
    <Snackbar open={isOpen} autoHideDuration={autoHideDuration} onClose={handleClose}>
      <Alert severity={severity} variant={variant} sx={{ width: '100%' }} onClose={handleClose}>
        {t(message)}
      </Alert>
    </Snackbar>
  );
};

export default AlertSnackbar;
