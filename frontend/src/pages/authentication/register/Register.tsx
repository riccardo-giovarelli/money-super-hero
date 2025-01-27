import React, { useState } from 'react';
import PasswordChecklist from 'react-password-checklist';

import { Box, Button, TextField, Typography } from '@mui/material';


const Register = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rePassword, setRePassword] = useState<string>('');

  /**
   * @function handleSubmit
   *
   * @description Handle the submit of the register form
   * @param event Submit event of form
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission logic here
  };

  /**
   * @function handleFormChange
   *
   * @description Handle changes of form fields
   * @param event Change event of fields
   */
  const handleFormChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    switch ((event.target as HTMLInputElement).id) {
      case 'first-name':
        setFirstName((event.target as HTMLInputElement).value);
        break;
      case 'last-name':
        setLastName((event.target as HTMLInputElement).value);
        break;
      case 'email-name':
        setEmail((event.target as HTMLInputElement).value);
        break;
      case 'password':
        setPassword((event.target as HTMLInputElement).value);
        break;
      case 're-password':
        setRePassword((event.target as HTMLInputElement).value);
        break;
    }
  };

  return (
    <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' minHeight='100vh'>
      <Typography variant='h4' component='h1' gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          id='first-name'
          label='First name'
          onChange={handleFormChange}
          value={firstName}
          variant='outlined'
          margin='normal'
          required
          fullWidth
        />
        <TextField
          id='last-name'
          label='Last name'
          onChange={handleFormChange}
          value={lastName}
          variant='outlined'
          margin='normal'
          fullWidth
        />
        <TextField
          id='email'
          label='Email'
          onChange={handleFormChange}
          value={email}
          variant='outlined'
          margin='normal'
          required
          fullWidth
          type='email'
        />
        <TextField
          id='password'
          label='Password'
          onChange={handleFormChange}
          value={password}
          variant='outlined'
          margin='normal'
          required
          fullWidth
          type='password'
        />
        <TextField
          id='re-password'
          label='Repeat password'
          onChange={handleFormChange}
          value={rePassword}
          variant='outlined'
          margin='normal'
          required
          fullWidth
          type='password'
        />
        {password.length > 0 && (
          <PasswordChecklist
            rules={['minLength', 'specialChar', 'number', 'capital', 'match']}
            minLength={5}
            value={password}
            valueAgain={rePassword}
            onChange={(isValid) => {
              console.log(isValid);
            }}
          />
        )}
        <Button type='submit' fullWidth variant='contained' color='primary' sx={{ mt: 2 }}>
          Register
        </Button>
      </form>
    </Box>
  );
};

export default Register;
