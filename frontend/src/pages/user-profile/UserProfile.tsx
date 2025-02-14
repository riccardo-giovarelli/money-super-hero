import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PasswordChecklist from 'react-password-checklist';

import { MessageType } from '@/types/generic';
import { Alert, Button, Container, Paper, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

import { isFormFilled } from './UserProfile.lib';
import { PasswordDataType, ProfileDataType } from './UserProfile.type';


const UserProfile = () => {
  const [passwordIsValid, setPasswordIsValid] = useState<boolean>(false);
  const [message, setMessage] = useState<MessageType | null>(null);
  const [profileData, setProfileData] = useState<ProfileDataType | null>(null);
  const [passwordData, setPasswordData] = useState<PasswordDataType | null>(null);
  const { t } = useTranslation();

  const handleProfileSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isFormFilled(profileData?.firstName, profileData?.lastName, profileData?.email)) {
      setMessage({
        type: 'info',
        text: 'Form is filled',
      });
      console.log('Form is filled');
    }
  };

  const handlePasswordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (passwordIsValid) {
      setMessage({
        type: 'info',
        text: 'Password is valid',
      });
      console.log('Password is valid');
    }
  };

  /**
   * @function handleProfileFormChange
   *
   * @description Handles changes to the profile form fields. Updates the corresponding state based on the field's name.
   * Specifically, it updates the `profileData` state variable when the respective input fields change.
   *
   * @param {React.FormEvent<HTMLInputElement | HTMLTextAreaElement>} event - The change event of the form fields.
   */
  const handleProfileFormChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setProfileData({
      ...profileData,
      [(event.target as HTMLInputElement).name]: (event.target as HTMLInputElement).value,
    } as ProfileDataType);
  };

  /**
   * @function handlePasswordFormChange
   *
   * @description Handles changes to the password form fields. Updates the corresponding state based on the field's name.
   * Specifically, it updates the `passwordData` state variable when the respective input fields change.
   * Additionally, it validates the email format and sets an error message if the email is invalid.
   *
   * @param {React.FormEvent<HTMLInputElement | HTMLTextAreaElement>} event - The change event of the form fields.
   */
  const handlePasswordFormChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setPasswordData({
      ...passwordData,
      [(event.target as HTMLInputElement).name]: (event.target as HTMLInputElement).value,
    } as PasswordDataType);
  };

  return (
    <Container>
      <form onSubmit={handleProfileSubmit}>
        <Paper elevation={3} sx={{ padding: 2, marginTop: 4 }}>
          <Grid container spacing={1} sx={{ mt: 1 }}>
            <Grid size={12}>
              <Typography variant='h5' component='h5' gutterBottom>
                {t('user_profile.profile')}
              </Typography>
            </Grid>
            <Grid size={6}>
              <TextField
                id='first-name'
                name='firstName'
                label={t('authentication.first_name')}
                onChange={handleProfileFormChange}
                value={profileData?.firstName}
                variant='outlined'
                margin='normal'
                required
                fullWidth
              />
            </Grid>
            <Grid size={6}>
              <TextField
                id='last-name'
                name='lastName'
                label={t('authentication.last_name')}
                onChange={handleProfileFormChange}
                value={profileData?.lastName}
                variant='outlined'
                margin='normal'
                fullWidth
              />
            </Grid>
            <Grid size={12}>
              <TextField
                id='email'
                name='email'
                label={t('authentication.email')}
                onChange={handleProfileFormChange}
                value={profileData?.email}
                variant='outlined'
                margin='normal'
                required
                fullWidth
                type='email'
              />
            </Grid>
            <Grid size={12}>
              <Button type='submit' fullWidth variant='contained' color='primary' sx={{ mt: 2 }}>
                {t('user_profile.save')}
              </Button>
              {message && (
                <Alert sx={{ marginTop: 3 }} severity={message.type}>
                  {message.text}
                </Alert>
              )}
            </Grid>
          </Grid>
        </Paper>
      </form>
      <form onSubmit={handlePasswordSubmit}>
        <Paper elevation={3} sx={{ padding: 2, marginTop: 4 }}>
          <Grid container spacing={1} sx={{ mt: 1 }}>
            <Grid size={12}>
              <Typography variant='h5' component='h5' gutterBottom>
                {t('user_profile.password')}
              </Typography>
            </Grid>
            <Grid size={6}>
              <TextField
                id='password'
                label={t('authentication.password')}
                onChange={handlePasswordFormChange}
                value={passwordData?.password}
                variant='outlined'
                margin='normal'
                required
                fullWidth
                type='password'
              />
              {passwordData && passwordData?.password?.length > 0 && (
                <PasswordChecklist
                  rules={['minLength', 'specialChar', 'number', 'capital', 'match']}
                  minLength={8}
                  value={passwordData?.password}
                  valueAgain={passwordData?.rePassword}
                  onChange={(isValid) => {
                    setPasswordIsValid(isValid);
                  }}
                />
              )}
            </Grid>
            <Grid size={6}>
              <TextField
                id='re-password'
                label={t('authentication.repeat_password')}
                onChange={handlePasswordFormChange}
                value={passwordData?.rePassword}
                variant='outlined'
                margin='normal'
                required
                fullWidth
                type='password'
              />
            </Grid>
            <Grid size={12}>
              <Button type='submit' fullWidth variant='contained' color='primary' sx={{ mt: 2 }}>
                {t('user_profile.save')}
              </Button>
              {message && (
                <Alert sx={{ marginTop: 3 }} severity={message.type}>
                  {message.text}
                </Alert>
              )}
            </Grid>
          </Grid>
        </Paper>
      </form>
    </Container>
  );
};

export default UserProfile;
