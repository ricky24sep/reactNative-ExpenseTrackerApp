import { useContext, useState } from 'react';
import { Alert } from 'react-native';

import AuthContent from '../../components/Auth/AuthContent';
import LoadingOverlay from '../../components/UI/LoadingOverlay';

import { createUser } from '../../utils/auth';
import { AuthContext } from '../../store/auth-context';

function SignupScreen() {

  const authCtx = useContext(AuthContext);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  async function signupHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const token = await createUser(email, password);
      authCtx.authenticate(token);
    } catch (error) {
      Alert.alert(
        'Sign Up failed',
        'Could not sign up. Please check again or try again later!'
      );
    }
    setIsAuthenticating(false)
  }

  if (isAuthenticating) {
    return <LoadingOverlay message='Creating user...' />
  }

  return <AuthContent isLogin={false} onAuthenticate={signupHandler} />;
}

export default SignupScreen;
