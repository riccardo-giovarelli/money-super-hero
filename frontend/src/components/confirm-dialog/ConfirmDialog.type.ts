export interface ConfirmDialogPropsType {
  id?: string;
  open: boolean;
  onClose: (choice: boolean) => void;
  title?: string;
  text: string;
  okText?: string;
  abortText?: string;
}
