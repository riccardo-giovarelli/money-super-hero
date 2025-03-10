import Signin from '@/pages/authentication/signin';
import Signup from '@/pages/authentication/signup';

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
