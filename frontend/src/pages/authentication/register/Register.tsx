import React from 'react';

import { Box, Button, TextField, Typography } from '@mui/material';

const Register = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission logic here
  };

  return (
    <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' minHeight='100vh'>
      <Typography variant='h4' component='h1' gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField label='Name' variant='outlined' margin='normal' required fullWidth />
        <TextField label='Email' variant='outlined' margin='normal' required fullWidth type='email' />
        <TextField label='Password' variant='outlined' margin='normal' required fullWidth type='password' />
        <Button type='submit' fullWidth variant='contained' color='primary' sx={{ mt: 2 }}>
          Register
        </Button>
      </form>
    </Box>
  );
};

export default Register;
