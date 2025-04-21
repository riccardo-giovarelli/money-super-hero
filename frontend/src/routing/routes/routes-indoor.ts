import { lazy } from 'react';

import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TuneIcon from '@mui/icons-material/Tune';

import { RoutesIndoorType } from './routes.type';

const Dashboard = lazy(() => import('@/pages/dashboard'));
const Settings = lazy(() => import('@/pages/settings'));
const Transactions = lazy(() => import('@/pages/transactions'));
const UserProfile = lazy(() => import('@/pages/user-profile'));

export const routesIndoor: readonly RoutesIndoorType[] = Object.freeze([
  {
    id: 'indor-dashboard',
    path: '/',
    menuPath: '/',
    name: 'dashboard',
    element: Dashboard,
    labelLangCode: 'indoor_menu.dashboard',
    icon: DashboardIcon,
  },
  {
    id: 'indor-user-profile',
    path: '/profile',
    menuPath: '/profile',
    name: 'profile',
    element: UserProfile,
    labelLangCode: 'indoor_menu.user_profile',
    hideInMenu: true,
  },
  {
    id: 'indor-transactions',
    path: '/transactions/:trsId?',
    menuPath: '/transactions',
    name: 'transactions',
    element: Transactions,
    labelLangCode: 'indoor_menu.transactions',
    icon: CurrencyExchangeIcon,
  },
  {
    id: 'indor-settings',
    path: '/settings',
    menuPath: '/settings',
    name: 'settings',
    element: Settings,
    labelLangCode: 'indoor_menu.settings',
    icon: TuneIcon,
  },
]);
