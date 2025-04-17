import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { useAuthenticationStore } from '@/authentication/AuthenticationStore/AuthenticationStore';
import { routesIndoor } from '@/routing/routes/routes-indoor';
import { Divider } from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { MenuAppDrawerPropsType } from './MenuAppDrawer.type';

const MenuAppDrawer = ({ open, setOpen }: MenuAppDrawerPropsType) => {
  const navigate = useNavigate();
  const userData = useAuthenticationStore((state) => state.userData);
  const { t } = useTranslation();

  const DrawerList = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={() => {
        setOpen(false);
      }}
    >
      <List>
        <ListItem disablePadding>
          <ListItemText
            primary={`${userData?.firstName} ${userData?.lastName}`}
            color="action"
            slotProps={{
              primary: {
                fontSize: 20,
                letterSpacing: 0,
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontWeight: 'medium',
                paddingY: 2,
              },
            }}
          />
        </ListItem>
        <Divider />
        {routesIndoor.map(
          (route) =>
            !route.hideInMenu && (
              <ListItem key={route.id} disablePadding onClick={() => navigate(route.menuPath)}>
                <ListItemButton>
                  {route.icon && (
                    <ListItemIcon>
                      <route.icon />
                    </ListItemIcon>
                  )}
                  <ListItemText primary={t(route.labelLangCode)} />
                </ListItemButton>
              </ListItem>
            )
        )}
      </List>
    </Box>
  );

  return (
    <div>
      <Drawer
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default MenuAppDrawer;
