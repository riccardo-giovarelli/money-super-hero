import { useTranslation } from 'react-i18next';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import { ConfirmDialogPropsType } from './ConfirmDialog.type';

const ConfirmDialog = ({
  id,
  open,
  onClose,
  title,
  text,
  okText,
  abortText,
}: ConfirmDialogPropsType) => {
  const { t } = useTranslation();

  const handleClose = (choice: boolean) => {
    onClose(choice);
  };

  return (
    <Dialog
      id={id ? id : 'confirm-dialog'}
      open={open}
      onClose={handleClose}
      aria-labelledby={id ? `${id}-title` : 'confirm-dialog-title'}
      aria-describedby={id ? `${id}-description` : 'confirm-dialog-description'}
    >
      {title && <DialogTitle id={id ? `${id}-title` : 'confirm-dialog-title'}>{title}</DialogTitle>}
      <DialogContent>
        <DialogContentText id={id ? `${id}-description` : 'confirm-dialog-description'}>
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleClose(false);
          }}
        >
          {abortText ? abortText : t('app.message.cancel')}
        </Button>
        <Button
          onClick={() => {
            handleClose(true);
          }}
          autoFocus
        >
          {okText ? abortText : t('app.message.ok')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
