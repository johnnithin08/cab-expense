import React, { Fragment, FunctionComponent } from "react";
import { Text, TextStyle, TouchableWithoutFeedback, View, ViewStyle } from "react-native";

import { NunitoBold } from "../../constants";
import {
  centerHV,
  centerVertical,
  circleBorder,
  colorBlue,
  colorGray,
  colorGreen,
  colorRed,
  disabledOpacity6,
  flexChild,
  flexCol,
  flexRow,
  flexRowCC,
  fs12BoldBlack2,
  fs12BoldBlue1,
  fs12BoldGray6,
  fs12BoldWhite1,
  fs14BoldBlack2,
  fs14BoldBlue1,
  fs14BoldWhite1,
  px,
  sh14,
  sh16,
  sh32,
  sh4,
  sh40,
  sw1,
  sw16,
  sw24,
  sw32,
  sw326,
  sw4,
  sw40,
} from "../../styles";
import { CustomSpacer } from "../Views/Spacer";

interface SingleSelectPillsProps {
  buttonStyle?: ViewStyle;
  CustomContent?: (props: IPillsCustomContent) => JSX.Element;
  direction?: "column" | "row";
  disabled?: boolean;
  disabledValues?: string[];
  header?: string;
  headerStyle?: TextStyle;
  iconSize?: number;
  labels: IPillsWithSubLabel[];
  labelStyle?: TextStyle;
  onSelect: (value: string) => void;
  space?: number;
  spaceToHeader?: number;
  spaceToLabel?: number;
  textContainer?: ViewStyle;
  value: string;
}

export const SingleSelectPills: FunctionComponent<SingleSelectPillsProps> = ({
  buttonStyle,
  CustomContent,
  direction,
  disabled,
  disabledValues,
  header,
  headerStyle,
  labels,
  labelStyle: mainLabelStyle,
  onSelect,
  space,
  spaceToHeader,
  spaceToLabel,
  textContainer,
  value,
}: SingleSelectPillsProps) => {
  const defaultSpace = direction === "column" ? sh16 : sw40;
  const defaultSpaceToHeader = spaceToHeader !== undefined ? spaceToHeader : sh4;
  const eachSpace = space !== undefined ? space : defaultSpace;
  const checkDisabled = disabled === true ? "none" : "auto";
  const disabledViewStyle: ViewStyle = disabled === true ? disabledOpacity6 : {};

  return (
    <View pointerEvents={checkDisabled} style={disabledViewStyle}>
      {header !== undefined ? (
        <Fragment>
          <Text style={{ ...fs12BoldGray6, ...headerStyle }}>{header}</Text>
          <CustomSpacer space={defaultSpaceToHeader} />
        </Fragment>
      ) : null}
      <View style={flexRow}>
        <View style={direction === "column" ? flexCol : flexRow}>
          {labels.map((content: IPillsWithSubLabel, index: number) => {
            const { label, labelStyle } = content;
            const disabledContent = disabledValues !== undefined && disabledValues.includes(content.label);

            const handlePress = () => {
              if (!disabledContent) {
                onSelect(label);
              }
            };

            const circleStyle: ViewStyle =
              value === label ? circleBorder(sw16, sw1, colorRed._1, colorRed._1) : circleBorder(sw16, sw1, colorBlue._1);

            const disabledBackground: ViewStyle = disabledContent === true && value === "" ? { backgroundColor: colorGray._4 } : {};
            const disabledStyle: ViewStyle = disabledContent ? { ...disabledOpacity6 } : {};
            const customContentProps: IPillsCustomContent = {
              buttonStyle,
              circleStyle,
              disabledBackground,
              disabledStyle,
              label,
              labelStyle,
              mainLabelStyle,
              selected: value === label,
              textContainer,
            };

            const selectedStyle: ViewStyle = value === label ? { backgroundColor: colorBlue._1 } : { backgroundColor: colorBlue._4 };
            const containerStyle: ViewStyle = {
              ...centerHV,
              ...px(sw32),
              borderRadius: sw24,
              height: sh40,
              ...selectedStyle,
            };
            const textStyle: TextStyle = value === label ? fs14BoldWhite1 : fs14BoldBlue1;
            const defaultSpaceToLabel = spaceToLabel !== undefined ? spaceToLabel : sw4;

            return (
              <Fragment key={index}>
                {index === 0 ? null : <CustomSpacer isHorizontal={direction !== "column"} space={eachSpace} />}
                <TouchableWithoutFeedback onPress={handlePress}>
                  {CustomContent !== undefined ? (
                    <CustomContent {...customContentProps} />
                  ) : (
                    <View style={{ ...centerVertical, ...disabledStyle }}>
                      <View style={{ ...flexRowCC, ...containerStyle }}>
                        <CustomSpacer isHorizontal={true} space={defaultSpaceToLabel} />
                        <Text
                          style={{
                            ...fs14BoldBlack2,
                            fontSize: sh14,
                            fontFamily: NunitoBold,
                            maxWidth: sw326,
                            ...textStyle,
                            ...mainLabelStyle,
                            ...labelStyle,
                          }}>
                          {label}
                        </Text>
                      </View>
                    </View>
                  )}
                </TouchableWithoutFeedback>
              </Fragment>
            );
          })}
        </View>
      </View>
    </View>
  );
};
