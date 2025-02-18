import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router';

import { useAuthenticationStore } from '@/authentication/AuthenticationStore/AuthenticationStore';
import { MessageType } from '@/types/generic.type';
import tank from '@/utils/axios';
import { Alert, Box, Button, TextField, Typography } from '@mui/material';

import { isFormFilled } from './Signin.lib';


const Signin = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<MessageType | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const setUserData = useAuthenticationStore((state) => state.setUserData);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    (async function () {
      const results = await tank.get('/users/check');
      if (results?.data?.code === 'LOGGED_IN') {
        navigate('/');
      }
    })();
  }, []);

  useEffect(() => {
    if (searchParams.get('sessionExpired') === 'true') {
      setMessage({
        type: 'error',
        text: t('authentication.session_expired'),
      });
    }
  }, [searchParams]);

  /**
   * @function handleFormChange
   *
   * @description Handles changes to form fields. Updates the corresponding state based on the field's id.
   * Specifically, it updates the email and password state variables when the respective input fields change.
   *
   * @param {React.FormEvent<HTMLInputElement | HTMLTextAreaElement>} event - The change event of the form fields.
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

  /**
   * @function handleSubmit
   *
   * @description Handles the submission of the sign-in form. Prevents the default form submission behavior,
   * checks if the form is filled correctly, and sends a POST request to the signin endpoint with the user's email and password.
   * If the sign-in is successful, updates the authentication store with the user's details and navigates to the home page.
   * If there is an error, sets an appropriate error message based on the error response.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - The submit event of the form.
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isFormFilled(email, password)) {
      tank.post('/users/signin', { email, password }).then((results) => {
        if (!results?.data?.code) {
          setMessage({
            type: 'error',
            text: t('authentication.error_signing_in'),
          });
        } else {
          switch (results.data.code) {
            case 'LOGIN_SUCCESSFUL':
              setUserData({
                firstName: results.data.details.firstName,
                lastName: results.data.details.lastName,
                email: results.data.details.email,
              });
              navigate('/');
              break;
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
