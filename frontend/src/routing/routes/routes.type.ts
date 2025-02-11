import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';


export interface RoutesIndoorType {
  id: string;
  path: string;
  element: () => JSX.Element;
  index?: boolean;
  labelLangCode: string;
  icon?: OverridableComponent<SvgIconTypeMap<object, 'svg'>>;
}

export interface RoutesOutdoorType {
  id: string;
  path: string;
  element: () => JSX.Element;
  icon?: OverridableComponent<SvgIconTypeMap<object, 'svg'>>;
}
