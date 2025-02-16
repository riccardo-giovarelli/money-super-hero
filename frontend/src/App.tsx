import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

import AppRouter from '@/routing/app-router/AppRouter';
import { Container } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import useAuthentication from './authentication/hooks/useAuthentication/useAuthentication';
import tank from './utils/axios';


const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthentication();

  useEffect(() => {
    // Do not redirect to the signin page if the user is
    // already on the signin page
    if (location.pathname === '/signin') {
      return;
    }
    // Redirect to the signin page if the user is not
    // authenticated
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    // Check if the user is authenticated by making a
    // request to the server
    (async function () {
      const results = await tank.get('/users/check');
      if (results?.data?.code !== 'LOGGED_IN') {
        navigate('/signin');
      }
    })();
  }, [location.pathname, isAuthenticated]);

  const theme = createTheme({
    colorSchemes: {
      dark: true,
    },
  });

  return (
    <ThemeProvider theme={theme} defaultMode='light'>
      <CssBaseline />
      <Container maxWidth={false} disableGutters>
        <AppRouter />
      </Container>
    </ThemeProvider>
  );
};

export default App;
