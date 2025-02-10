import Home from '@/pages/home';

import { RoutesIndoorType } from './routes.type';


export const routesIndoor: readonly RoutesIndoorType[] = Object.freeze([
  {
    id: 'indoor-home-page',
    path: '/',
    element: Home,
    index: true,
    labelLangCode: 'indoor_menu.home_page',
  },
]);
