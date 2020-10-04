import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 0 30px ${Platform.OS === 'android' ? 150 : 40}px;
`;

export const Header = styled.View`
  margin-top: 16px;
  flex-direction: row;
`;

export const BackButton = styled.TouchableOpacity`
  align-items: flex-start;
`;

export const AvatarButton = styled.TouchableOpacity`
  margin: 0 auto;
`;

export const UserAvatar = styled.Image`
  width: 186px;
  height: 186px;
  border-radius: 93px;
`;

export const Title = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 16px 0;
  text-align: left;
`;
