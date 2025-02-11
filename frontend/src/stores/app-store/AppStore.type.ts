export interface AppState {
  appDrawerOpen: boolean;
}

export interface AppAction {
  setAppDrawerOpen: (username: AppState['appDrawerOpen']) => void;
}
