import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PasswordChecklist from 'react-password-checklist';
import { useNavigate } from 'react-router';

import { MessageType } from '@/types/generic.type';
import tank from '@/utils/axios';
import { Alert, Box, Button, TextField, Typography } from '@mui/material';

import { isFormFilled } from './Signup.lib';
import { ProfileDataType } from './Signup.type';

const Signup = () => {
  const [passwordIsValid, setPasswordIsValid] = useState<boolean>(false);
  const [message, setMessage] = useState<MessageType | null>(null);
  const [profileData, setProfileData] = useState<ProfileDataType | null>(null);
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
    if (isFormFilled(passwordIsValid, profileData?.firstName, profileData?.lastName, profileData?.email)) {
      tank
        .post('/users/signup', {
          firstName: profileData?.firstName,
          lastName: profileData?.lastName,
          email: profileData?.email,
          password: profileData?.password,
        })
        .then((results) => {
          if (!results?.data?.code) {
            setMessage({
              type: 'error',
              text: t('authentication.error_inserting_user'),
            });
          } else {
            switch (results.data.code) {
              case 'REGISTRATION_SUCCESSFUL':
                navigate('/signin');
                break;
              case 'USER_EXISTS':
                setMessage({
                  type: 'error',
                  text: t('authentication.user_already_exists'),
                });
                break;
              case 'REGISTRATION_ERROR':
                setMessage({
                  type: 'error',
                  text: t('authentication.error_inserting_user'),
                });
                break;
            }
          }
        });
    }
  };

  /**
   * @function handleFormChange
   *
   * @description Handles changes to the form fields. Updates the `profileData` state with the new value
   * of the input field that triggered the change event.
   *
   * @param {React.FormEvent<HTMLInputElement | HTMLTextAreaElement>} event - The change event triggered by the form field.
   *
   * @returns {void}
   */
  const handleFormChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setProfileData({
      ...profileData,
      [(event.target as HTMLInputElement).name]: (event.target as HTMLInputElement).value,
    } as ProfileDataType);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
      <Typography variant="h4" component="h1" gutterBottom>
        {t('authentication.registration')}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          id="first-name"
          name="firstName"
          label={t('authentication.first_name')}
          onChange={handleFormChange}
          value={profileData?.firstName || ''}
          variant="outlined"
          margin="normal"
          required
          fullWidth
        />
        <TextField
          id="last-name"
          name="lastName"
          label={t('authentication.last_name')}
          onChange={handleFormChange}
          value={profileData?.lastName || ''}
          variant="outlined"
          margin="normal"
          fullWidth
        />
        <TextField
          id="email"
          name="email"
          label={t('authentication.email')}
          onChange={handleFormChange}
          value={profileData?.email || ''}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          type="email"
        />
        <TextField
          id="password"
          name="password"
          label={t('authentication.password')}
          onChange={handleFormChange}
          value={profileData?.password || ''}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          type="password"
        />
        <TextField
          id="re-password"
          name="rePassword"
          label={t('authentication.repeat_password')}
          onChange={handleFormChange}
          value={profileData?.rePassword || ''}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          type="password"
        />
        {profileData && profileData?.password?.length > 0 && (
          <PasswordChecklist
            rules={['minLength', 'specialChar', 'number', 'capital', 'match']}
            minLength={8}
            value={profileData?.password}
            valueAgain={profileData?.rePassword}
            onChange={(isValid) => {
              setPasswordIsValid(isValid);
            }}
          />
        )}
        <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
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
