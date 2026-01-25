import React, { FunctionComponent } from "react";
import { Pressable, Text, TextStyle, ViewStyle } from "react-native";

import { CustomSpacer } from "..";
import {
  autoWidth,
  centerHV,
  colorBlue,
  colorGreen,
  colorRed,
  flexRow,
  fs14SemiBoldBlue1,
  fs14SemiBoldBlue5,
  sh48,
  sw2,
  sw24,
  sw4,
  sw8,
} from "../../styles";

export interface TabProps {
  badgeCount?: number;
  onPress?: () => void;
  selected?: boolean;
  spaceToRight?: number;
  style?: ViewStyle;
  text: string;
  textStyle?: TextStyle;
}

export const Tab: FunctionComponent<TabProps> = ({ badgeCount, onPress, selected, style, spaceToRight, text, textStyle }: TabProps) => {
  const selectedStyle: ViewStyle = selected === true ? { borderBottomWidth: sw4, borderBottomColor: colorBlue._1, } : {};
  const defaultTextStyle: TextStyle = selected === true ? { ...fs14SemiBoldBlue1, ...textStyle } : { ...fs14SemiBoldBlue5, ...textStyle };

  const defaultSpace = badgeCount !== undefined ? sw8 : 0;
  const defaultSpaceToRight = spaceToRight !== undefined ? spaceToRight : defaultSpace;
  const container: ViewStyle = {
    ...centerHV,
    ...flexRow,
    height: sh48,
    paddingHorizontal: sw24,
    ...selectedStyle,
    ...style,
  };

  return (
    <Pressable onPress={onPress} style={container}>
      <Text style={defaultTextStyle}>{text}</Text>
    </Pressable>
  );
};
