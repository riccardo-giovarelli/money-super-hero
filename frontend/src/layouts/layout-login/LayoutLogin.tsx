import { Outlet } from 'react-router';

import { Container } from '@mui/material';

const LayoutLogin = () => {
  return (
    <Container maxWidth='xs'>
      <Outlet />
    </Container>
  );
};

export default LayoutLogin;
