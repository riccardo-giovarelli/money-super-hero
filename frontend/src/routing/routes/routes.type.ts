export interface RoutesIndoorType {
  id: string;
  path: string;
  element: () => JSX.Element;
  index?: boolean;
  labelLangCode: string;
}

export interface RoutesOutdoorType {
  id: string;
  path: string;
  element: () => JSX.Element;
}
