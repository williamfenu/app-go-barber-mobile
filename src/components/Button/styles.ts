import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled(RectButton)`
  height: 60px;
  background: #ff9000;
  border-radius: 10px;
  margin-top: 16px;

  justify-content: center;
  align-items: center;
`;

export const ButtonText = styled.Text`
  font-size: 18px;
  color: #312e38;
  font-family: 'RobotoSlab-Medium';
`;
