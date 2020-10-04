import React, { useRef, useCallback } from 'react';
import { Image, ScrollView, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';
import * as Yup from 'yup';

import getValidationErrors from '../../utils/getValidationErrors';

import api from '../../services/api';

import Button from '../../components/Button';
import Input from '../../components/Input';

import LogoImg from '../../assets/logo.png';

import { Container, Title, BackToLogon, BackToLogonText } from './styles';

const SingUp: React.FC = () => {
  const navigation = useNavigation();
  const formRef = useRef<FormHandles>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  interface CadastroProps {
    name: string;
    email: string;
    password: string;
  }

  const handleSubmit = useCallback(async (data: CadastroProps): Promise<
    void
  > => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required('O campo nome é obrigatório'),
        email: Yup.string()
          .required('Campo e-mail obrigatório')
          .email('É necessário informar um email válido'),
        password: Yup.string().min(
          6,
          'A senha deve ter pelo menos 6 caracteres',
        ),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await api.post('/users', data);

      Alert.alert(
        'Cadastro realizado com sucesso!',
        'Você já pode fazer login no sistema.',
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
  }, []);

  return (
    <>
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Container>
          <Image source={LogoImg} />
          <Title>Cria sua conta</Title>

          <Form ref={formRef} onSubmit={handleSubmit}>
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
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
            <Input
              ref={passwordRef}
              secureTextEntry
              name="password"
              icon="lock"
              placeholder="Senha"
              returnKeyType="send"
              onSubmitEditing={() => formRef.current?.submitForm()}
            />

            <Button onPress={() => formRef.current?.submitForm()}>
              Entrar
            </Button>
          </Form>
        </Container>
      </ScrollView>
      <BackToLogon onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={20} color="#f4ede8" />
        <BackToLogonText>Voltar para tela de logon</BackToLogonText>
      </BackToLogon>
    </>
  );
};

export default SingUp;
