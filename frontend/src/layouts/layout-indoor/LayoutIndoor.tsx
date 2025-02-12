import './LayoutIndoor.style.scss';

import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';

import { useAuthenticationStore } from '@/authentication/AuthenticationStore/AuthenticationStore';
import useAuthentication from '@/authentication/hooks/useAuthentication/useAuthentication';
import MenuAppBar from '@/components/menu-app-bar/MenuAppBar';
import MenuAppDrawer from '@/components/menu-app-drawer/MenuAppDrawer';
import { Container } from '@mui/material';


const LayoutIndoor = () => {
  const navigate = useNavigate();
  const email = useAuthenticationStore((state) => state.userData?.email);
  const { checkAuthentication } = useAuthentication();

  if (!email) {
    navigate('/signin');
  }

  useEffect(() => {
    checkAuthentication(navigate);
  }, [navigate, checkAuthentication]);

  return (
    <div className='layoutindoor__container'>
      <MenuAppBar />
      <MenuAppDrawer />
      <Container maxWidth={false}>
        <Outlet />
      </Container>
    </div>
  );
};

export default LayoutIndoor;
