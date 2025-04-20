import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PasswordChecklist from 'react-password-checklist';

import { useAuthenticationStore } from '@/authentication/AuthenticationStore/AuthenticationStore';
import AlertSnackbar from '@/components/alert-snackbar/AlertSnackbar';
import useUserData from '@/hooks/useUserData/useUserData';
import { UserType } from '@/models/users';
import { MessageType } from '@/types/generic.type';
import tank from '@/utils/axios';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Container, TextField, Grid } from '@mui/material';

import { isFormFilled } from './UserProfile.lib';
import { PasswordDataType } from './UserProfile.type';

const UserProfile = () => {
  const [passwordIsValid, setPasswordIsValid] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<UserType | null>(null);
  const [passwordData, setPasswordData] = useState<PasswordDataType | null>(null);
  const [message, setMessage] = useState<MessageType | null>(null);
  const setUserData = useAuthenticationStore((state) => state.setUserData);
  const userData = useUserData();
  const { t } = useTranslation();

  useEffect(() => {
    if (userData) {
      setProfileData(userData);
    }
  }, [userData]);

  /**
   * @function handleProfileSubmit
   *
   * @description Handles the submission of the profile form. Prevents the default form submission behavior,
   * checks if the form is filled correctly, and sends a PUT request to the `/users/myself` endpoint with the user's profile data.
   * If the update is successful, updates the user data in the authentication store and sets a success message.
   * If there is an error, sets an appropriate error message.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - The submit event of the form.
   */
  const handleProfileSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isFormFilled(profileData?.firstName, profileData?.lastName, profileData?.email)) {
      tank.put('/users/myself', profileData).then((results) => {
        if (!results?.data?.code) {
          setMessage({
            type: 'error',
            text: t('user_profile.update_error'),
          });
        } else {
          switch (results.data.code) {
            case 'UPDATE_USER_SUCCESS':
              setUserData(results.data.details);
              setMessage({
                type: 'success',
                text: t('user_profile.update_success'),
              });
              break;
            case 'UPDATE_USER_ERROR':
              setMessage({
                type: 'error',
                text: t('user_profile.update_error'),
              });
              break;
            default:
              setMessage({
                type: 'error',
                text: t('user_profile.update_error'),
              });
              break;
          }
        }
      });
    }
  };

  /**
   * @function handlePasswordSubmit
   *
   * @description Handles the submission of the password update form. Prevents the default form submission behavior,
   * checks if the password is valid, and sends a PUT request to the `/users/password` endpoint with the new password.
   * If the update is successful, sets a success message. If there is an error, sets an appropriate error message.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - The submit event of the form.
   */
  const handlePasswordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (passwordIsValid) {
      tank.put('/users/password', { password: passwordData?.password }).then((results) => {
        if (!results?.data?.code) {
          setMessage({
            type: 'error',
            text: t('user_profile.update_error'),
          });
        } else {
          switch (results.data.code) {
            case 'UPDATE_PASSWORD_SUCCESS':
              setMessage({
                type: 'success',
                text: t('user_profile.update_success'),
              });
              break;
            case 'UPDATE_PASSWORD_ERROR':
              setMessage({
                type: 'error',
                text: t('user_profile.update_error'),
              });
              break;
            default:
              setMessage({
                type: 'error',
                text: t('user_profile.update_error'),
              });
              break;
          }
        }
      });
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
    } as UserType);
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
                <Grid size={12} sx={{ input: { cursor: 'not-allowed' } }}>
                  <TextField
                    id="email"
                    name="email"
                    label={t('user_profile.email')}
                    value={profileData?.email || ''}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    type="email"
                    disabled
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    id="first-name"
                    name="firstName"
                    label={t('user_profile.first_name')}
                    onChange={handleProfileFormChange}
                    value={profileData?.firstName || ''}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    id="last-name"
                    name="lastName"
                    label={t('user_profile.last_name')}
                    onChange={handleProfileFormChange}
                    value={profileData?.lastName || ''}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button type="submit" color="primary">
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
                    id="password"
                    name="password"
                    label={t('user_profile.password')}
                    onChange={handlePasswordFormChange}
                    value={passwordData?.password}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    type="password"
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
                    id="re-password"
                    name="rePassword"
                    label={t('user_profile.repeat_password')}
                    onChange={handlePasswordFormChange}
                    value={passwordData?.rePassword}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    type="password"
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button type="submit" color="primary">
                {t('user_profile.save')}
              </Button>
            </CardActions>
          </form>
        </Card>
      </Box>
      <AlertSnackbar
        message={message?.text ? message.text : ''}
        autoHideDuration={5000}
        severity={message?.type}
        open={message !== null}
        onClose={() => setMessage(null)}
      />
    </Container>
  );
};

export default UserProfile;
