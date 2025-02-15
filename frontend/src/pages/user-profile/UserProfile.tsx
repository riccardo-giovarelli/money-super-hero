import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PasswordChecklist from 'react-password-checklist';

import useUserData from '@/hooks/useUserData/useUserData';
import { UsersType } from '@/models/users';
import {
    Box, Button, Card, CardActions, CardContent, CardHeader, Container, TextField
} from '@mui/material';
import Grid from '@mui/material/Grid2';

import { isFormFilled } from './UserProfile.lib';
import { PasswordDataType } from './UserProfile.type';


const UserProfile = () => {
  const [passwordIsValid, setPasswordIsValid] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<UsersType | null>(null);
  const [passwordData, setPasswordData] = useState<PasswordDataType | null>(null);
  const userData = useUserData();
  const { t } = useTranslation();

  console.log('userData', userData);

  useEffect(() => {
    if (userData) {
      setProfileData(userData);
    }
  }, [userData]);

  const handleProfileSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isFormFilled(profileData?.firstName, profileData?.lastName, profileData?.email)) {
      console.log('Form is filled');
    }
  };

  const handlePasswordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (passwordIsValid) {
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
    } as UsersType);
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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          flexDirection: 'column',
        }}
      >
        <Card sx={{ width: '100%', marginTop: 4 }}>
          <CardHeader title={t('user_profile.personal_info')} />
          <form onSubmit={handleProfileSubmit}>
            <CardContent>
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    id='first-name'
                    name='firstName'
                    label={t('authentication.first_name')}
                    onChange={handleProfileFormChange}
                    value={profileData?.firstName || ''}
                    variant='outlined'
                    margin='normal'
                    required
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    id='last-name'
                    name='lastName'
                    label={t('authentication.last_name')}
                    onChange={handleProfileFormChange}
                    value={profileData?.lastName || ''}
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
                    value={profileData?.email || ''}
                    variant='outlined'
                    margin='normal'
                    required
                    fullWidth
                    type='email'
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button type='submit' color='primary'>
                {t('user_profile.save')}
              </Button>
            </CardActions>
          </form>
        </Card>
        <Card sx={{ width: '100%', marginTop: 4 }}>
          <CardHeader title={t('user_profile.password')} />
          <form onSubmit={handlePasswordSubmit}>
            <CardContent>
              <Grid container spacing={1} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    id='password'
                    name='password'
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
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    id='re-password'
                    name='rePassword'
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
              </Grid>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button type='submit' color='primary'>
                {t('user_profile.save')}
              </Button>
            </CardActions>
          </form>
        </Card>
      </Box>
    </Container>
  );
};

export default UserProfile;
