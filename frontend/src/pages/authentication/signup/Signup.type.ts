export interface MessageType {
  type: 'success' | 'error' | 'info' | 'warning';
  text: string;
}

export interface ProfileDataType {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  rePassword: string;
}
