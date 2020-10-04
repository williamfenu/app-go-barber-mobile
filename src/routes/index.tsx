import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import AuthRotes from './auth.routes';
import AppRotes from './app.routes';

import { useAuth } from '../hooks/auth';

const Routes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator color="#999" size="large" />
      </View>
    );
  }

  return user ? <AppRotes /> : <AuthRotes />;
};

export default Routes;
