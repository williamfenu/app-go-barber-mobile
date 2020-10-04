import React, { useState, useEffect, useCallback } from 'react';
import Icon from 'react-native-vector-icons/Feather';

import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import {
  Container,
  Header,
  HeaderTitle,
  Username,
  ProfileButton,
  UserAvatar,
  ProviderList,
  ProviderListHeader,
  ProviderContainer,
  ProviderIfo,
  ProviderAvatar,
  ProviderName,
  ProviderMeta,
  MetaText,
} from './styles';
import { useAuth } from '../../hooks/auth';

export interface Provider {
  id: string;
  name: string;
  avatarUrl: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [providers, setProviders] = useState<Provider[]>([]);
  const { navigate } = useNavigation();

  useEffect(() => {
    api.get('providers').then(response => setProviders(response.data));
  }, [setProviders]);

  const navigateToProfile = useCallback(() => {
    navigate('Profile');
  }, [navigate]);

  const navigateToCreateAppointment = useCallback(
    (providerId: string) => {
      navigate('CreateAppointment', { providerId });
    },
    [navigate],
  );

  return (
    <Container>
      <Header>
        <HeaderTitle>
          Bem vindo,
          {'\n'}
          <Username>{user.name}</Username>
        </HeaderTitle>
        <ProfileButton onPress={navigateToProfile}>
          <UserAvatar source={{ uri: user.avatarUrl }} />
        </ProfileButton>
      </Header>

      <ProviderList
        data={providers}
        ListHeaderComponent={() => (
          <ProviderListHeader>Cabeleireiros</ProviderListHeader>
        )}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          return (
            <ProviderContainer
              onPress={() => navigateToCreateAppointment(item.id)}
            >
              <ProviderAvatar source={{ uri: item.avatarUrl }} />
              <ProviderIfo>
                <ProviderName>{item.name}</ProviderName>
                <ProviderMeta>
                  <Icon name="calendar" color="#ff9000" />
                  <MetaText>De segunda á sexta</MetaText>
                </ProviderMeta>
                <ProviderMeta>
                  <Icon name="clock" color="#ff9000" />
                  <MetaText>De 08:00 ás 18:00</MetaText>
                </ProviderMeta>
              </ProviderIfo>
            </ProviderContainer>
          );
        }}
      />
    </Container>
  );
};

export default Dashboard;
