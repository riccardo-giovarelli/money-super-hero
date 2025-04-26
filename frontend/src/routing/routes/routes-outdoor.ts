import { Signin } from '@/pages/authentication';
import { Signup } from '@/pages/authentication';

import { RoutesOutdoorType } from './routes.type';

export const routesOutdoor: readonly RoutesOutdoorType[] = Object.freeze([
  {
    id: 'outdoor-signin-page',
    path: '/signin',
    name: 'signin',
    element: Signin,
  },
  {
    id: 'outdoor-signup-page',
    path: '/signup',
    name: 'signup',
    element: Signup,
  },
]);
