import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { routesIndoor } from '@/routing/routes/routes-indoor';
import { useAppStore } from '@/stores/app-store/AppStore';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';


const MenuAppDrawer = () => {
  const setAppDrawerOpen = useAppStore((state) => state.setAppDrawerOpen);
  const appDrawerOpen = useAppStore((state) => state.appDrawerOpen);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const DrawerList = (
    <Box
      sx={{ width: 250 }}
      role='presentation'
      onClick={() => {
        setAppDrawerOpen(false);
      }}
    >
      <List>
        {routesIndoor.map((route) => (
          <ListItem key={route.id} disablePadding onClick={() => navigate(route.path)}>
            <ListItemButton>
              {route.icon && (
                <ListItemIcon>
                  <route.icon />
                </ListItemIcon>
              )}
              <ListItemText primary={t(route.labelLangCode)} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <Drawer
        open={appDrawerOpen}
        onClose={() => {
          setAppDrawerOpen(false);
        }}
      >
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default MenuAppDrawer;
