import { Route, Routes } from 'react-router';

import LayoutLogin from '@/layouts/layout-login';
import Home from '@pages/home';
import Login from '@pages/login';


const AppRouter = () => (
  <Routes>
    <Route index element={<Home />} />

    <Route element={<LayoutLogin />}>
      <Route path='login' element={<Login />} />
    </Route>
  </Routes>
);

export default AppRouter;
