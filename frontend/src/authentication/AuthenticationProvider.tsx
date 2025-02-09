import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';

import { isAuthenticated } from './AuthenticationProvider.lib';

const AuthenticationProvider = () => {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const authentication = await isAuthenticated();
      if (!authentication) {
        navigate('/signin');
      }
    })();
  }, [navigate]);

  return <Outlet />;
};

export default AuthenticationProvider;
