import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import useAuthentication from '@/authentication/hooks/useAuthentication/useAuthentication';
import { Menu, MenuItem } from '@mui/material';

import { handleLogoutClick, handleProfileClick } from './MenuUser.lib';
import { MenuUserProps } from './MenuUser.type';


const MenuUser = ({ anchorEl, handleClose }: MenuUserProps) => {
  const { logout } = useAuthentication();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
      <MenuItem onClick={() => handleProfileClick(navigate, handleClose)}>{t('user_menu.profile')}</MenuItem>
      <MenuItem onClick={() => handleLogoutClick(logout, navigate, handleClose)}>{t('user_menu.logout')}</MenuItem>
    </Menu>
  );
};

export default MenuUser;
