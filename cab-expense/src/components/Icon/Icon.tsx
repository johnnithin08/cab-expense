import React, { Fragment } from 'react';
import {
  AntDesign,
  EvilIcons,
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
} from '@expo/vector-icons';
import { ViewStyle } from 'react-native';

export const Icons = {
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Fontisto,
  AntDesign,
  Entypo,
  SimpleLineIcons,
  Octicons,
  Foundation,
  EvilIcons,
}

declare interface IIconProps {
  type: unknown;
  name: string;
  color?: string;
  size?: number;
  style?: ViewStyle;
}




export const Icon = ({ type, name, color, size = 24, style }: IIconProps) => {
  const fontSize = 24;
  const Tag = type;
  return (
    <Fragment>

      {type && name && (
        <Tag name={name} size={size || fontSize} color={color} style={style} />
      )}
    </Fragment>
  )
}