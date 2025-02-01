import axios from 'axios';
import React, { useState } from 'react';
import PasswordChecklist from 'react-password-checklist';
import { useNavigate } from 'react-router';

import { Box, Button, TextField, Typography } from '@mui/material';

import { isFormFilled } from './Register.lib';

const Register = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rePassword, setRePassword] = useState<string>('');
  const [passwordIsValid, setPasswordIsValid] = useState<boolean>(false);
  const navigate = useNavigate();

  /**
   * @function handleSubmit
   *
   * @description Handle the submit of the register form
   * @param event Submit event of form
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (isFormFilled(firstName, lastName, email, passwordIsValid && import.meta.env.VITE_API_BASE_URL)) {
      axios
        .post(`${import.meta.env.VITE_API_BASE_URL}/users`, { firstName, lastName, email, password })
        .then(() => navigate('/'))
        .catch((error) => console.log(error));
    }
  };

  /**
   * @function handleFormChange
   *
   * @description Handle changes of form fields
   * @param event Change event of fields
   */
  const handleFormChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    switch ((event.target as HTMLInputElement).id) {
      case 'first-name':
        setFirstName((event.target as HTMLInputElement).value);
        break;
      case 'last-name':
        setLastName((event.target as HTMLInputElement).value);
        break;
      case 'email':
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
              setPasswordIsValid(isValid);
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
