import './LayoutIndoor.style.scss';

import { Outlet } from 'react-router';

import AuthenticationProvider from '@/authentication/AuthenticationProvider';
import MenuAppBar from '@/components/menu-app-bar/MenuAppBar';
import { Container } from '@mui/material';


const LayoutIndoor = () => {
  return (
    <AuthenticationProvider>
      <div className='layoutindoor__container'>
        <MenuAppBar />
        <Container maxWidth={false}>
          <Outlet />
        </Container>
      </div>
    </AuthenticationProvider>
  );
};

export default LayoutIndoor;
