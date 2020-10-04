import { RectButton } from 'react-native-gesture-handler';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 0 24px;
`;

export const Title = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 32px;
  text-align: center;
  color: #f4ede8;
  margin-top: 48px;
`;

export const Description = styled.Text`
  font-family: 'RobotoSlab-Regular';
  color: #999591;
  font-size: 16px;
  margin-top: 16px;
  text-align: center;
`;

export const OkButton = styled(RectButton)`
  padding: 12px 24px;
  background: #ff9000;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-top: 24px;
`;

export const OkButtonText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 18px;
  color: #312e38;
`;
