import React, { useContext, useState } from 'react';
import { Alert } from 'react-native';

import AuthContent from '../../components/Auth/AuthContent';
import LoadingOverlay from '../../components/UI/LoadingOverlay';

import { login } from '../../utils/auth';
import { AuthContext } from '../../store/auth-context';

function LoginScreen() {

  const authCtx = useContext(AuthContext);

  const [isAuthenticating, setIsAuthenticating] = useState(false);

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const token = await login(email, password);
      authCtx.authenticate(token);
    } catch (error) {
      Alert.alert(
        'Authentication failed',
        'Could not log you in. Please check your credentials or try again later!'
      );
    }
    setIsAuthenticating(false);
  }

  if (isAuthenticating) {
    return <LoadingOverlay message='Logging you in...' />
  }

  return <AuthContent isLogin={true} onAuthenticate={loginHandler} />;
}

export default LoginScreen;
