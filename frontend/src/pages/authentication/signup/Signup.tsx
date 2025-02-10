import axios from 'axios';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PasswordChecklist from 'react-password-checklist';
import { useNavigate } from 'react-router';

import { MessageType } from '@/types/generic';
import { Alert, Box, Button, TextField, Typography } from '@mui/material';

import { isFormFilled } from './Signup.lib';


const Signup = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rePassword, setRePassword] = useState<string>('');
  const [passwordIsValid, setPasswordIsValid] = useState<boolean>(false);
  const [message, setMessage] = useState<MessageType | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  /**
   * @function handleSubmit
   *
   * @description Handles the submission of the registration form. Prevents the default form submission behavior,
   * checks if the form is filled correctly, and sends a POST request to the signup endpoint with the user's details.
   * If the registration is successful, navigates to the signin page. If there is an error, sets an appropriate error message.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - The submit event of the form.
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (isFormFilled(firstName, lastName, email, passwordIsValid && import.meta.env.VITE_API_BASE_URL)) {
      axios
        .post(
          `${import.meta.env.VITE_API_BASE_URL}/users/signup`,
          { firstName, lastName, email, password },
          { withCredentials: true }
        )
        .then((results) => {
          if (results?.data?.code === 'REGISTRATION_SUCCESSFUL') {
            navigate('/signin');
          }
        })
        .catch((error) => {
          setMessage({
            type: 'error',
            text:
              error?.response?.data?.code === 'USER_EXISTS'
                ? t('authentication.user_already_exists')
                : t('authentication.error_inserting_user'),
          });
        });
    }
  };

  /**
   * @function handleFormChange
   *
   * @description Handles changes to form fields. Updates the corresponding state based on the field's id.
   * Validates the email format and sets an error message if the email is invalid.
   *
   * @param {React.FormEvent<HTMLInputElement | HTMLTextAreaElement>} event - The change event of the form fields.
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
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((event.target as HTMLInputElement).value)) {
          setEmailErrorMessage(t('authentication.email_invalid'));
          setEmail((event.target as HTMLInputElement).value);
        } else {
          setEmailErrorMessage('');
          setEmail((event.target as HTMLInputElement).value);
        }
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
        {t('authentication.registration')}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          id='first-name'
          label={t('authentication.first_name')}
          onChange={handleFormChange}
          value={firstName}
          variant='outlined'
          margin='normal'
          required
          fullWidth
        />
        <TextField
          id='last-name'
          label={t('authentication.last_name')}
          onChange={handleFormChange}
          value={lastName}
          variant='outlined'
          margin='normal'
          fullWidth
        />
        <TextField
          id='email'
          label={t('authentication.email')}
          error={emailErrorMessage.length > 0}
          helperText={emailErrorMessage}
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
        <TextField
          id='re-password'
          label={t('authentication.repeat_password')}
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
            minLength={8}
            value={password}
            valueAgain={rePassword}
            onChange={(isValid) => {
              setPasswordIsValid(isValid);
            }}
          />
        )}
        <Button type='submit' fullWidth variant='contained' color='primary' sx={{ mt: 2 }}>
          {t('authentication.register')}
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

export default Signup;
