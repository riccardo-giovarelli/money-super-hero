import axios from 'axios';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { MessageType } from '@/types/generic';
import { Alert, Box, Button, TextField, Typography } from '@mui/material';

import { isFormFilled } from './Signin.lib';


const Signin = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<MessageType | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  /**
   * @function handleFormChange
   *
   * @description Handle changes of form fields
   * @param event Change event of fields
   */
  const handleFormChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    switch ((event.target as HTMLInputElement).id) {
      case 'email':
        setEmail((event.target as HTMLInputElement).value);
        break;
      case 'password':
        setPassword((event.target as HTMLInputElement).value);
        break;
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isFormFilled(email, password && import.meta.env.VITE_API_BASE_URL)) {
      axios
        .post(`${import.meta.env.VITE_API_BASE_URL}/users/signin`, { email, password })
        .then((results) => {
          if (results?.data?.code === 'LOGIN_SUCCESSFUL') {
            navigate('/');
          }
        })
        .catch((error) => {
          if (!error?.response?.data?.code) {
            setMessage({
              type: 'error',
              text: t('authentication.error_signing_in'),
            });
          } else {
            switch (error.response.data.code) {
              case 'USER_NOT_FOUND':
                setMessage({
                  type: 'error',
                  text: t('authentication.user_does_not_exist'),
                });
                break;
              case 'WRONG_PASSWORD':
                setMessage({
                  type: 'error',
                  text: t('authentication.wrong_password'),
                });
                break;
              default:
                setMessage({
                  type: 'error',
                  text: t('authentication.error_signing_in'),
                });
                break;
            }
          }
        });
    }
  };

  return (
    <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' minHeight='100vh'>
      <Typography variant='h4' component='h1' gutterBottom>
        {t('authentication.signin')}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          id='email'
          label={t('authentication.email')}
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
          label={t('authentication.password')}
          onChange={handleFormChange}
          value={password}
          variant='outlined'
          margin='normal'
          required
          fullWidth
          type='password'
        />
        <Button type='submit' fullWidth variant='contained' color='primary' sx={{ mt: 2 }}>
          {t('authentication.login')}
        </Button>
        {message && (
          <Alert sx={{ marginTop: 3 }} severity={message.type}>
            {message.text}
          </Alert>
        )}
      </form>
    </Box>
  );
};

export default Signin;
