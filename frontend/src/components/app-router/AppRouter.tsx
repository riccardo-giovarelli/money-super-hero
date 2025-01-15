import { Route, Routes } from 'react-router';

import Home from '@pages/home';


const AppRouter = () => (
  <Routes>
    <Route path='/' element={<Home />} />
  </Routes>
);

export default AppRouter;
