import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

import AppRouter from '@/routing/app-router/AppRouter';
import { Container } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import useAuthentication from './authentication/hooks/useAuthentication/useAuthentication';
import tank from './utils/axios';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthentication();
  const queryClient = new QueryClient();

  /**
   * Check if the user is authenticated
   */
  useEffect(() => {
    if (location.pathname === '/signin' || location.pathname === '/signup') {
      return;
    }
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    (async function () {
      const results = await tank.get('/users/check');
      if (results?.data?.code !== 'LOGGED_IN') {
        navigate('/signin');
      }
    })();
  }, [location.pathname, isAuthenticated]);

  /**
   * Theme configuration
   */
  const theme = createTheme({
    colorSchemes: {
      dark: true,
    },
  });

  return (
    <ThemeProvider theme={theme} defaultMode="light">
      <CssBaseline />
      <Container maxWidth={false} disableGutters>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <QueryClientProvider client={queryClient}>
            <AppRouter />
          </QueryClientProvider>
        </LocalizationProvider>
      </Container>
    </ThemeProvider>
  );
};

export default App;
