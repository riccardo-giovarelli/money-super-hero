import { Outlet } from 'react-router';

import { Container } from '@mui/material';


const LayoutLogin = () => {
  return (
    <Container>
      <Outlet />
    </Container>
  );
};

export default LayoutLogin;
