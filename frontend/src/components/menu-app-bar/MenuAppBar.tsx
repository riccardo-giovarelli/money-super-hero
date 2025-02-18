import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import { getRouteByField } from '@/routing/routes/routes.lib';
import { RoutesIndoorType } from '@/routing/routes/routes.type';
import { useAppStore } from '@/stores/app-store/AppStore';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { Switch } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import { useColorScheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import MenuUser from '../menu-user/MenuUser';

const MenuAppBar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const [pageName, setPageName] = useState<string>('');
  const { t } = useTranslation();
  const setAppDrawerOpen = useAppStore((state) => state.setAppDrawerOpen);
  const { mode, setMode } = useColorScheme();

  useEffect(() => {
    const name = getRouteByField('path', location.pathname, 'indoor') as RoutesIndoorType;
    setPageName(name?.labelLangCode || 'indoor_menu.no_name');
  }, [location.pathname]);

  const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMode(event.target.checked ? 'dark' : 'light');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar>
          <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 2 }}
            onClick={() => {
              setAppDrawerOpen(true);
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            {t(pageName)}
          </Typography>
          <div>
            {mode && (
              <FormControlLabel
                control={
                  <Switch
                    checked={mode === 'dark'}
                    onChange={handleModeChange}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label='Dark mode'
              />
            )}
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={(event: React.MouseEvent<HTMLElement>) => {
                setAnchorEl(event.currentTarget);
              }}
              color='inherit'
            >
              <AccountCircle />
            </IconButton>
            <MenuUser
              anchorEl={anchorEl}
              handleClose={() => {
                setAnchorEl(null);
              }}
            />
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default MenuAppBar;
