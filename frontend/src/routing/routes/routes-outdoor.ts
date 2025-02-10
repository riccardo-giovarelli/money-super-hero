import Signin from '@/pages/authentication/signin'; // Adjust the import path as necessary
import Signup from '@/pages/authentication/signup';

import { RoutesOutdoorType } from './routes.type';


export const routesOutdoor: readonly RoutesOutdoorType[] = Object.freeze([
  {
    id: 'outdoor-signin-page',
    path: '/signin',
    element: Signin,
  },
  {
    id: 'outdoor-signup-page',
    path: '/signup',
    element: Signup,
  },
]);
