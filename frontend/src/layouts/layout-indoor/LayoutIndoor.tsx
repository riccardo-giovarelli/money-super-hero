import { Outlet } from 'react-router';

import { Container } from '@mui/material';


const LayoutIndoor = () => {
  return (
    <Container>
      <Outlet />
    </Container>
  );
};

export default LayoutIndoor;
