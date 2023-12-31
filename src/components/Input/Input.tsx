import React, { Fragment, FunctionComponent, RefObject, useState } from "react";
import { NativeSyntheticEvent, Text, TextInput, TextInputFocusEventData, TextInputProps, TextStyle, View, ViewStyle } from "react-native";

import { NunitoRegular } from "../../constants";
import {
  border,
  centerVertical,
  colorBlack,
  colorBlue,
  colorGray,
  colorRed,
  colorTransparent,
  colorWhite,
  customShadow,
  disabledOpacity6,
  flexChild,
  flexRow,
  fs12BoldGray6,
  fs12RegRed2,
  fs16RegGray6,
  px,
  sh16,
  sh4,
  sh48,
  sh50,
  sw1,
  sw15,
  sw16,
  sw2,
  sw24,
  sw32,
  sw336,
  sw360,
  sw362,
  sw4,
  sw8,
} from "../../styles";
import { CustomSpacer } from "../Views/Spacer";

export interface CustomTextInputProps extends TextInputProps {
  containerStyle?: ViewStyle;
  clearAll?: boolean;
  disabled?: boolean;
  error?: string;
  inputPrefix?: string;
  increaseErrorWidth?: boolean;
  label?: string;
  labelStyle?: TextStyle;
  noBorder?: boolean;
  onPressLabel?: () => void;
  prefixStyle?: TextStyle;
  setRef?: string | ((instance: TextInput | null) => void) | RefObject<TextInput> | null;
  spaceToBottom?: number;
  spaceToLabel?: number;
  spaceToTop?: number;
  style?: TextStyle;
  testID?: string;
  viewStyle?: ViewStyle;
}

export const CustomTextInput: FunctionComponent<CustomTextInputProps> = ({
  containerStyle,
  clearAll,
  disabled,
  increaseErrorWidth,
  error,
  inputPrefix,
  label,
  labelStyle,
  noBorder,
  onBlur,
  onFocus,
  onLayout,
  onPressLabel,
  placeholder,
  prefixStyle,
  setRef,
  spaceToBottom,
  spaceToLabel,
  spaceToTop,
  style,
  testID,
  value,
  viewStyle,
  ...textInputProps
}: CustomTextInputProps) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const borderWidth = noBorder === true ? { borderWidth: 0 } : {};
  const disabledOpacity = disabled === true ? { ...disabledOpacity6 } : {};
  const disabledStyle = disabled === true ? { ...disabledOpacity, backgroundColor: colorGray._1 } : {};
  const errorStyle: ViewStyle = error !== undefined ? { backgroundColor: colorRed._5, borderWidth: sw2, borderColor: colorRed._2 } : {};
  const focusedShadow = isFocused ? customShadow(colorBlue._1, 0, 0, 0.02, sw4) : {};

  const defaultContainerStyle: ViewStyle = {
    paddingTop: spaceToTop !== undefined ? spaceToTop : 0,
    paddingBottom: spaceToBottom !== undefined ? spaceToBottom : 0,
  };

  const defaultInputStyle: ViewStyle = {
    ...border(isFocused ? colorBlue._1 : colorGray._3, isFocused ? sw2 : sw1, sw32),
    ...centerVertical,
    ...flexRow,
    ...px(isFocused === false && error === undefined ? sw16 : sw15),
    backgroundColor: colorWhite._1,
    height: sh48,
    width: sw360,
    ...borderWidth,
    ...focusedShadow,
    ...errorStyle,
    ...disabledStyle,
    ...viewStyle,
  };

  const inputStyle: TextStyle = {
    ...flexChild,
    color: colorBlack._2,
    fontFamily: NunitoRegular,
    fontSize: sh16,
    height: isFocused ? sh50 : sh48, // height is more than the input view size to adjust the keyboard avoiding view
    ...style,
  };

  const errorWidthStyle: TextStyle = {
    width: increaseErrorWidth ? sw362 : sw336,
    lineHeight: sh16,
    ...fs12RegRed2,
  };

  const handleBlur = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    if (onBlur) {
      onBlur(event);
    }
    setIsFocused(false);
  };

  const handleClear = () => {
    if (textInputProps.onChangeText !== undefined) {
      textInputProps.onChangeText("");
    }
  };

  const handleFocus = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    if (onFocus) {
      onFocus(event);
    }
    setIsFocused(true);
  };

  return (
    <View onLayout={onLayout} style={{ width: sw360, ...defaultContainerStyle, ...containerStyle }}>
      {label === undefined ? null : (
        <Text
          onPress={onPressLabel}
          style={{ ...fs12BoldGray6, paddingBottom: spaceToLabel || sh4, ...labelStyle }}
          suppressHighlighting={true}>
          {label}
        </Text>
      )}
      <View style={defaultInputStyle}>
        {inputPrefix !== undefined ? (
          <Fragment>
            <Text style={{ ...fs16RegGray6, ...prefixStyle }}>{inputPrefix}</Text>
            <CustomSpacer isHorizontal={true} space={sw8} />
          </Fragment>
        ) : null}
        <TextInput
          autoCorrect={false}
          editable={!disabled}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          placeholderTextColor={colorGray._4}
          ref={setRef}
          selectionColor={colorGray._6}
          spellCheck={false}
          style={inputStyle}
          testID={testID}
          underlineColorAndroid={colorTransparent}
          value={value}
          {...textInputProps}
        />
      </View>
    </View>
  );
};
