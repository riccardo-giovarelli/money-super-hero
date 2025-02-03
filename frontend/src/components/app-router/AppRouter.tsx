import { Route, Routes } from 'react-router';

import LayoutAuthentication from '@/layouts/layout-authentication';
import Signin from '@/pages/authentication/signin';
import Signup from '@/pages/authentication/signup';
import Home from '@pages/home';


const AppRouter = () => (
  <Routes>
    <Route index element={<Home />} />
    <Route element={<LayoutAuthentication />}>
      <Route path='signin' element={<Signin />} />
      <Route path='signup' element={<Signup />} />
    </Route>
  </Routes>
);

export default AppRouter;
