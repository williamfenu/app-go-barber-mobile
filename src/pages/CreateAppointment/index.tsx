import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Alert, Platform } from 'react-native';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import {
  Container,
  Header,
  Content,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProvidersListContainer,
  ListProvider,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
  ShowDatePickerButton,
  ShowDatePickerButtonText,
  Schedule,
  Section,
  SectionText,
  SectionContent,
  Hour,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
} from './styles';

export interface Provider {
  id: string;
  name: string;
  avatarUrl: string;
}

interface DayAvailability {
  hour: number;
  availability: boolean;
}

interface RouteParams {
  providerId: string;
}

const CreateAppointment: React.FC = () => {
  const { user } = useAuth();
  const route = useRoute();
  const { goBack, navigate } = useNavigation();
  const params = route.params as RouteParams;
  const [providers, setProviders] = useState<Provider[]>([]);
  const [dayAvailability, setDayAvailability] = useState<DayAvailability[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedProvider, setSelectedProvider] = useState(params.providerId);

  useEffect(() => {
    api.get('providers').then(response => setProviders(response.data));
  }, [setProviders]);

  useEffect(() => {
    api
      .get(`providers/${selectedProvider}/dayavailability`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(response => setDayAvailability(response.data));
  }, [selectedDate, selectedProvider]);

  const navigateToPreviousPage = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleChangeSelect = useCallback((providerId: string) => {
    setSelectedProvider(providerId);
  }, []);

  const handleToggleCalendar = useCallback(() => {
    setShowDatePicker(true);
  }, []);

  const handleChangeDate = useCallback((event: any, date: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  }, []);

  const handleChangeHour = useCallback(hour => {
    setSelectedHour(hour);
  }, []);

  const handleCreateAppointment = useCallback(() => {
    try {
      const date = new Date(selectedDate);

      date.setHours(selectedHour);
      date.setMinutes(0);

      api.post('appointments', {
        providerId: selectedProvider,
        date,
      });

      navigate('AppointmentCreated', { date: date.getTime() });
    } catch (error) {
      Alert.alert(
        'Erro ao criar o agendamento',
        'Ocorreu um erro ao criar o agendamento, por favor tente novamente',
      );
    }
  }, [navigate, selectedDate, selectedHour, selectedProvider]);

  const morningAvailability = useMemo(() => {
    return dayAvailability
      .filter(({ hour }) => hour < 12)
      .map(({ hour, availability }) => {
        return {
          hour,
          availability,
          formattedHour: format(new Date().setHours(hour), 'HH:00'),
        };
      });
  }, [dayAvailability]);

  const afterNoonAvailability = useMemo(() => {
    return dayAvailability
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, availability }) => {
        return {
          hour,
          availability,
          formattedHour: format(new Date().setHours(hour), 'HH:00'),
        };
      });
  }, [dayAvailability]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateToPreviousPage}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>Cabeleireiros</HeaderTitle>
        <UserAvatar source={{ uri: user.avatarUrl }} />
      </Header>

      <Content>
        <ProvidersListContainer>
          <ListProvider
            horizontal
            showsHorizontalScrollIndicator={false}
            data={providers}
            keyExtractor={provider => provider.id}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                selected={provider.id === selectedProvider}
                onPress={() => handleChangeSelect(provider.id)}
              >
                <ProviderAvatar source={{ uri: provider.avatarUrl }} />
                <ProviderName selected={provider.id === selectedProvider}>
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProvidersListContainer>

        <Calendar>
          <Title>Escolha a data</Title>

          <ShowDatePickerButton>
            <ShowDatePickerButtonText onPress={handleToggleCalendar}>
              Selecione outra data
            </ShowDatePickerButtonText>
          </ShowDatePickerButton>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              onChange={handleChangeDate}
              display="calendar"
            />
          )}
        </Calendar>

        <Schedule>
          <Title>Escolha o horário</Title>

          <Section>
            <SectionText>Manhã</SectionText>
            <SectionContent>
              {morningAvailability.map(
                ({ hour, availability, formattedHour }) => (
                  <Hour
                    enabled={availability}
                    key={formattedHour}
                    availability={availability}
                    selected={hour === selectedHour && availability}
                    onPress={() => handleChangeHour(hour)}
                  >
                    <HourText selected={hour === selectedHour && availability}>
                      {formattedHour}
                    </HourText>
                  </Hour>
                ),
              )}
            </SectionContent>
          </Section>

          <Section>
            <SectionText>Tarde</SectionText>
            <SectionContent>
              {afterNoonAvailability.map(
                ({ hour, availability, formattedHour }) => (
                  <Hour
                    enabled={availability}
                    key={formattedHour}
                    availability={availability}
                    selected={hour === selectedHour && availability}
                    onPress={() => handleChangeHour(hour)}
                  >
                    <HourText selected={hour === selectedHour && availability}>
                      {formattedHour}
                    </HourText>
                  </Hour>
                ),
              )}
            </SectionContent>
          </Section>
        </Schedule>
        <CreateAppointmentButton onPress={handleCreateAppointment}>
          <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  );
};

export default CreateAppointment;
