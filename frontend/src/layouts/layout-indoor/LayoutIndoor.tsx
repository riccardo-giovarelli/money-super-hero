import './LayoutIndoor.style.scss';

import { Outlet } from 'react-router';

import AuthenticationProvider from '@/authentication/AuthenticationProvider';
import MenuAppBar from '@/components/menu-app-bar/MenuAppBar';
import MenuAppDrawer from '@/components/menu-app-drawer/MenuAppDrawer';
import { Container } from '@mui/material';


const LayoutIndoor = () => {
  return (
    <AuthenticationProvider>
      <div className='layoutindoor__container'>
        <MenuAppBar />
        <MenuAppDrawer />
        <Container maxWidth={false}>
          <Outlet />
        </Container>
      </div>
    </AuthenticationProvider>
  );
};

export default LayoutIndoor;
