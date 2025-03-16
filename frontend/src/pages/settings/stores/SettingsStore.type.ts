import { MessageType } from '@/types/generic.type';


export interface SettingsState {
  alertSnackbarMessage: MessageType | null;
}

export interface SettingsAction {
  setAlertSnackbarMessage: (alertSnackbarMessage: { type: MessageType['type'], text: MessageType['text'] } | null) => void;
}
