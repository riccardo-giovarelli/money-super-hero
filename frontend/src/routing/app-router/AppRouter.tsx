import { Route, Routes } from 'react-router';

import LayoutAuthentication from '@/layouts/layout-authentication';
import LayoutIndoor from '@/layouts/layout-indoor';

import { routesIndoor } from '../routes/routes-indoor';
import { routesOutdoor } from '../routes/routes-outdoor';

const AppRouter = () => (
  <Routes>
    <Route element={<LayoutIndoor />}>
      {routesIndoor.map((route) => (
        <Route key={route.id} path={route.path} index={route?.index} element={<route.element />} />
      ))}
    </Route>
    <Route element={<LayoutAuthentication />}>
      {routesOutdoor.map((route) => (
        <Route key={route.id} path={route.path} element={<route.element />} />
      ))}
    </Route>
  </Routes>
);

export default AppRouter;
