import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { checkAuthentication } from './AuthenticationProvider.lib';
import { AuthenticationProviderPropsType } from './AuthenticationProvider.type';
import { useAuthenticationStore } from './AuthenticationStore/AuthenticationStore';


const AuthenticationProvider = ({ children }: AuthenticationProviderPropsType) => {
  const navigate = useNavigate();
  const email = useAuthenticationStore((state) => state.email);

  if (!email) {
    navigate('/signin');
  }

  useEffect(() => {
    checkAuthentication(navigate);
  }, [navigate]);

  return children;
};

export default AuthenticationProvider;
