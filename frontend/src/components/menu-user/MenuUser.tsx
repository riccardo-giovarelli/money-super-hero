import { Menu, MenuItem } from '@mui/material';

import { MenuUserProps } from './MenuUser.type';


const MenuUser = ({ anchorEl, handleClose }: MenuUserProps) => {
  return (
    <Menu
      id='menu-appbar'
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <MenuItem onClick={handleClose}>Profile</MenuItem>
      <MenuItem onClick={handleClose}>My account</MenuItem>
    </Menu>
  );
};

export default MenuUser;
