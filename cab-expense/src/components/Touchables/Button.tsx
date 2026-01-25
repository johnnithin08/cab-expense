import React, { Fragment, FunctionComponent, useCallback, useState } from "react";
import { Pressable, Text, TextStyle, ViewStyle } from "react-native";
import { CircleSnail } from "react-native-progress";

import {
  border,
  colorGray,
  colorRed,
  colorTransparent,
  colorWhite,
  flexRowCC,
  fs16BoldWhite1,
  fsCapitalize,
  sh16,
  sh48,
  sw2,
  sw20,
  sw240,
  sw8,
} from "../../styles";
import { CustomSpacer } from "../Views/Spacer";

export interface CustomButtonProps {
  buttonStyle?: ViewStyle;
  disabled?: boolean;
  icon?: string;
  iconColor?: string;
  iconSize?: number;
  loading?: boolean;
  onPress: () => void;
  secondary?: boolean;
  text: string;
  textStyle?: TextStyle;
  withDebounce?: boolean;
}

export const CustomButton: FunctionComponent<CustomButtonProps> = ({
  buttonStyle,
  disabled,
  icon,
  iconColor,
  iconSize,
  loading,
  onPress,
  secondary,
  text,
  textStyle,
  withDebounce,
}: CustomButtonProps) => {
  const [hover, setHover] = useState<boolean>(false);


  const color = ((hover === true && secondary !== true) || loading === true) && disabled !== true ? colorRed._11 : colorRed._1;

  const defaultButtonStyle: ViewStyle = {
    ...border(color, sw2),
    ...flexRowCC,
    backgroundColor: secondary ? colorTransparent : color,
    height: sh48,
    opacity: disabled === true ? 0.5 : 1,
    width: sw240,
    ...buttonStyle,
  };

  const defaultIconColor = iconColor !== undefined ? iconColor : colorWhite._1;
  const textColor = secondary ? colorGray._6 : colorWhite._1;

  const handlePress = () => {
      onPress();
  };

  return (
    <Pressable
      onPress={disabled === true ? undefined : handlePress}
      onPressIn={() => setHover(true)}
      onPressOut={() => setHover(false)}
      style={defaultButtonStyle}>
      {loading === true ? (
        <Fragment>
          <CircleSnail color={colorWhite._1} size={sw20} thickness={sw2} />
          <CustomSpacer isHorizontal={true} space={sw8} />
        </Fragment>
      ) : null}
      <Text style={{ ...fs16BoldWhite1, ...fsCapitalize, color: textColor, ...textStyle }}>{text}</Text>
    </Pressable>
  );
};
