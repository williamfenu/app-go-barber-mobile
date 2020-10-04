import React, { useRef, useCallback } from 'react';
import { ScrollView, TextInput, Alert, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Imagepicker from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';
import * as Yup from 'yup';

import getValidationErrors from '../../utils/getValidationErrors';

import api from '../../services/api';
import { useAuth } from '../../hooks/auth';

import Button from '../../components/Button';
import Input from '../../components/Input';

import {
  Container,
  Header,
  Title,
  AvatarButton,
  UserAvatar,
  BackButton,
} from './styles';

interface CadastroProps {
  name: string;
  email: string;
  oldPassword: string;
  password: string;
  confirmationPassword: string;
}

interface ResponseData {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
  };
}

const Profile: React.FC = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const formRef = useRef<FormHandles>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const oldPasswordRef = useRef<TextInput>(null);
  const confirmationPassword = useRef<TextInput>(null);

  const handleSubmit = useCallback(
    async (data: CadastroProps): Promise<void> => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('O campo nome é obrigatório'),
          email: Yup.string()
            .required('O campo e-mail é obrigatório')
            .email('É necessário informar um e-mail válido'),
          oldPassword: Yup.string(),
          password: Yup.string().when('oldPassword', {
            is: value => !!value,
            then: Yup.string().required('Necessário informar a nova senha'),
            otherwise: Yup.string(),
          }),
          confirmationPassword: Yup.string().oneOf(
            [Yup.ref('password')],
            'A nova senha e a confirmação não conferem',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const response = await api.put<ResponseData>('/profile', data);

        updateUser(response.data.user);

        Alert.alert(
          'Atualização realizada com sucesso!',
          'O perfil foi atualizado com sucesso.',
        );

        navigation.goBack();
      } catch (err) {
        if (!(err instanceof Yup.ValidationError)) {
          Alert.alert('Erro de autenticação', 'Houve problema ao autenticar');
          return;
        }

        const Errors = getValidationErrors(err);
        formRef.current?.setErrors(Errors);
      }
    },
    [navigation, updateUser],
  );

  const handleChangeAvatar = useCallback(() => {
    Imagepicker.showImagePicker(
      {
        title: 'Selecione um avatar',
        cancelButtonTitle: 'Cancelar',
        takePhotoButtonTitle: 'Usar câmera',
        chooseFromLibraryButtonTitle: 'Escolher da galheria',
      },
      response => {
        if (response.didCancel) return;

        if (response.error) {
          Alert.alert('Erro ao atualizar o seu avatar');
        } else {
          const source = { uri: response.uri };

          const data = new FormData();
          data.append('avatar', {
            type: 'image/jpg',
            name: `${user.id}.jpeg`,
            uri: source.uri,
          });

          api.patch('users/avatar', data).then(apiResponse => {
            updateUser(apiResponse.data.user);
          });
        }
      },
    );
  }, [user.id, updateUser]);

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <Container>
        <Header>
          <BackButton onPress={() => navigation.goBack()}>
            <Icon name="chevron-left" size={24} color="#999591" />
          </BackButton>
          <AvatarButton onPress={handleChangeAvatar}>
            <UserAvatar source={{ uri: user.avatarUrl }} />
          </AvatarButton>
        </Header>

        <View>
          <Title>Meu perfil</Title>
        </View>

        <Form initialData={user} ref={formRef} onSubmit={handleSubmit}>
          <Input
            autoCapitalize="words"
            name="name"
            icon="user"
            placeholder="Nome"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
          />
          <Input
            ref={emailRef}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            name="email"
            icon="mail"
            placeholder="E-mail"
            returnKeyType="next"
            onSubmitEditing={() => oldPasswordRef.current?.focus()}
          />
          <Input
            ref={oldPasswordRef}
            secureTextEntry
            name="oldPassword"
            icon="lock"
            containerStyle={{ marginTop: 16 }}
            placeholder="Senha antiga"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
          <Input
            ref={passwordRef}
            secureTextEntry
            name="password"
            icon="lock"
            placeholder="Nova senha"
            returnKeyType="next"
            onSubmitEditing={() => confirmationPassword.current?.focus()}
          />
          <Input
            ref={confirmationPassword}
            secureTextEntry
            name="password"
            icon="lock"
            placeholder="Confirmar senha"
            returnKeyType="send"
            onSubmitEditing={() => formRef.current?.submitForm()}
          />

          <Button onPress={() => formRef.current?.submitForm()}>
            Confirmar alterações
          </Button>
        </Form>
      </Container>
    </ScrollView>
  );
};

export default Profile;
