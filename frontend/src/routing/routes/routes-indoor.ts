import { lazy } from 'react';

import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MailIcon from '@mui/icons-material/Mail';
import TuneIcon from '@mui/icons-material/Tune';

import { RoutesIndoorType } from './routes.type';


const Home = lazy(() => import('@/pages/home/Home'));
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'));
const Settings = lazy(() => import('@/pages/settings/Settings'));
const Transactions = lazy(() => import('@/pages/transactions/transactions/Transactions'));
const UserProfile = lazy(() => import('@/pages/user-profile/UserProfile'));

export const routesIndoor: readonly RoutesIndoorType[] = Object.freeze([
  {
    id: 'indoor-home-page',
    path: '/',
    menuPath: '/',
    name: 'home',
    element: Home,
    index: true,
    labelLangCode: 'indoor_menu.home_page',
    icon: MailIcon,
  },
  {
    id: 'indor-dashboard',
    path: '/dashboard',
    menuPath: '/dashboard',
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
