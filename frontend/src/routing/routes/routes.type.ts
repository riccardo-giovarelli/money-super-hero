import { LazyExoticComponent } from 'react';

import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';


export interface RoutesIndoorType {
  id: string;
  path: string;
  menuPath: string;
  name: string;
  element: LazyExoticComponent<() => JSX.Element> | (() => JSX.Element);
  labelLangCode: string;
  icon?: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
  index?: boolean;
  hideInMenu?: boolean;
}

export interface RoutesOutdoorType {
  id: string;
  path: string;
  name: string;
  element: () => JSX.Element;
  icon?: OverridableComponent<SvgIconTypeMap<object, 'svg'>>;
}
