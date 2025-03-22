import './LayoutIndoor.style.scss';

import { Outlet } from 'react-router';

import MenuAppBar from '@/components/menu-app-bar/MenuAppBar';
import MenuAppDrawer from '@/components/menu-app-drawer/MenuAppDrawer';
import { Container } from '@mui/material';

const LayoutIndoor = () => {
  return (
    <div className="layoutindoor__container">
      <MenuAppBar />
      <MenuAppDrawer />
      <Container maxWidth={false}>
        <Outlet />
      </Container>
    </div>
  );
};

export default LayoutIndoor;
