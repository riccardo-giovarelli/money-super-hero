export interface AuthenticationState {
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthenticationAction {
  setFirstName: (username: AuthenticationState['firstName']) => void;
  setLastName: (username: AuthenticationState['lastName']) => void;
  setEmail: (username: AuthenticationState['email']) => void;
}
