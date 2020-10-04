import React from 'react';
import { render } from '@testing-library/react-native';

import SingIn from '../../pages/SignIn';

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      signIn: jest.fn(),
    }),
  };
});

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

describe('SignIn page', () => {
  it('Should contais email/password inputs', () => {
    const { getByPlaceholderText } = render(<SingIn />);

    expect(getByPlaceholderText('E-mail')).toBeTruthy;
    expect(getByPlaceholderText('Senha')).toBeTruthy;
  });
});
