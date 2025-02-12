export interface UserDataType {
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthenticationState {
  userData: UserDataType | null;
}

export interface AuthenticationAction {
  setUserData: (newUserData: UserDataType) => void;
  setLogout: () => void;
}
