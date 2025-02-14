import AppRouter from '@/routing/app-router/AppRouter';
import { Container } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const App = () => {
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
