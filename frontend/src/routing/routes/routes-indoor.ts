import Dashboard from '@/pages/dashboard/Dashboard';
import Home from '@/pages/home';
import UserProfile from '@/pages/user-profile/UserProfile';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MailIcon from '@mui/icons-material/Mail';

import { RoutesIndoorType } from './routes.type';


export const routesIndoor: readonly RoutesIndoorType[] = Object.freeze([
  {
    id: 'indoor-home-page',
    path: '/',
    element: Home,
    index: true,
    labelLangCode: 'indoor_menu.home_page',
    icon: MailIcon,
  },
  {
    id: 'indor-dashboard',
    path: '/dashboard',
    element: Dashboard,
    labelLangCode: 'indoor_menu.dashboard',
    icon: DashboardIcon,
  },
  {
    id: 'indor-user-profile',
    path: '/profile',
    element: UserProfile,
    labelLangCode: 'indoor_menu.user_profile',
    hideInMenu: true,
  },
]);
