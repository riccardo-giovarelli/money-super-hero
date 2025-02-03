import { Outlet } from 'react-router';

import { Container } from '@mui/material';


const LayoutAuthentication = () => {
  return (
    <Container maxWidth='xs'>
      <Outlet />
    </Container>
  );
};

export default LayoutAuthentication;
