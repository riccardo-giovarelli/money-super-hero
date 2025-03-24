import './LayoutIndoor.style.scss';

import { Outlet } from 'react-router';

import MenuAppBar from '@/components/menu-app-bar/MenuAppBar';
import { Container } from '@mui/material';

const LayoutIndoor = () => {
  return (
    <div className="layoutindoor__container">
      <MenuAppBar />
      <Container maxWidth={false}>
        <Outlet />
      </Container>
    </div>
  );
};

export default LayoutIndoor;
