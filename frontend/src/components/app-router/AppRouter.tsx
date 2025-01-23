import { Route, Routes } from 'react-router';

import LayoutLogin from '@/layouts/layout-login';
import Login from '@/pages/authentication/login';
import Register from '@/pages/authentication/register';
import Home from '@pages/home';

const AppRouter = () => (
  <Routes>
    <Route index element={<Home />} />
    <Route element={<LayoutLogin />}>
      <Route path='login' element={<Login />} />
      <Route path='register' element={<Register />} />
    </Route>
  </Routes>
);

export default AppRouter;
