import Dashboard from '@/pages/dashboard/Dashboard';
import Home from '@/pages/home';
import Transactions from '@/pages/transactions/transactions/Transactions';
import UserProfile from '@/pages/user-profile/UserProfile';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MailIcon from '@mui/icons-material/Mail';

import { RoutesIndoorType } from './routes.type';

export const routesIndoor: readonly RoutesIndoorType[] = Object.freeze([
  {
    id: 'indoor-home-page',
    path: '/',
    name: 'home',
    element: Home,
    index: true,
    labelLangCode: 'indoor_menu.home_page',
    icon: MailIcon,
  },
  {
    id: 'indor-dashboard',
    path: '/dashboard',
    name: 'dashboard',
    element: Dashboard,
    labelLangCode: 'indoor_menu.dashboard',
    icon: DashboardIcon,
  },
  {
    id: 'indor-user-profile',
    path: '/profile',
    name: 'profile',
    element: UserProfile,
    labelLangCode: 'indoor_menu.user_profile',
    hideInMenu: true,
  },
  {
    id: 'indor-transactions',
    path: '/transactions/:trsId?',
    name: 'transactions',
    element: Transactions,
    labelLangCode: 'indoor_menu.transactions',
    icon: CurrencyExchangeIcon,
  },
]);
