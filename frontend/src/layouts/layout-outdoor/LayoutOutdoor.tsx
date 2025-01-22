import { Outlet } from 'react-router';

import { Container } from '@mui/material';


const LayoutOutdoor = () => {
  return (
    <Container>
      <Outlet />
    </Container>
  );
};

export default LayoutOutdoor;
