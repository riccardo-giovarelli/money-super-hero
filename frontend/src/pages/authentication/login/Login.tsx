import React from 'react';

import { Box, Button, TextField, Typography } from '@mui/material';

const Login = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' minHeight='100vh'>
      <Typography variant='h4' component='h1' gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField label='Email' variant='outlined' margin='normal' required fullWidth type='email' />
        <TextField label='Password' variant='outlined' margin='normal' required fullWidth type='password' />
        <Button type='submit' fullWidth variant='contained' color='primary' sx={{ mt: 2 }}>
          Sign In
        </Button>
      </form>
    </Box>
  );
};

export default Login;
