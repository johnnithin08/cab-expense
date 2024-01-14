import DateTimePicker from "@react-native-community/datetimepicker";
import React, { Fragment, FunctionComponent, useEffect, useState } from "react";
import { Keyboard, Modal, Platform, Pressable, Text, TextStyle, TouchableWithoutFeedback, View, ViewStyle } from "react-native";
import Collapsible from "react-native-collapsible";

import {
  centerHV,
  centerVertical,
  colorBlue,
  colorGray,
  colorWhite,
  flexRow,
  fs16BoldBlue1,
  fullHW,
  fullHeight,
  fullWidth,
  noBGColor,
  px,
  sh228,
  sh44,
  sw12,
  sw15,
  sw16,
  sw2,
  sw20,
  sw24,
  sw356,
  sw360,
} from "../../styles";
import { CustomTextInput } from "../Input";
import { BasicModal } from "../Modals";
import { CustomButton } from "../Touchables";
import { CustomFlexSpacer } from "../Views";
import { NunitoRegular } from "../../constants";
import dayjs from "dayjs";

interface NewDatePickerProps {
  buttonStyle?: ViewStyle;
  buttonText?: string;
  datePickerStyle?: ViewStyle;
  disabled?: boolean;
  error?: string;
  initialDate?: Date;
  keyboardAvoidingRef?: TypeKeyboardAvoidingView;
  maximumDate?: Date;
  minimumDate?: Date;
  mode: "date" | "time";
  placeholder?: string;
  selectedFormat?: string;
  setValue: (value: Date) => void;
  value?: Date;
  viewStyle?: ViewStyle;
}

export const NewDatePicker: FunctionComponent<NewDatePickerProps> = ({
  buttonStyle,
  buttonText,
  datePickerStyle,
  disabled,
  error,
  mode,
  initialDate,
  keyboardAvoidingRef,
  minimumDate,
  maximumDate,
  placeholder,
  selectedFormat,
  setValue,
  value,
  viewStyle,
}: NewDatePickerProps) => {
  const [layout, setLayout] = useState<IBasicLayout>({ x: 0, y: 0, width: 0, height: 0 });
  const [ref, setRef] = useState<View | null>(null);
  const [collapse, setCollapse] = useState<boolean>(true);
  const [collapsibleModal, setCollapsibleModal] = useState<boolean>(false);
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);

  const maxDate: Date = maximumDate !== undefined ? maximumDate : new Date();
  const defaultInitialDate = initialDate !== undefined ? initialDate : maxDate;
  // const defaultDate = isDate(value) ? value : defaultInitialDate;
  const [selectedDate, setSelectedDate] = useState<Date>(defaultInitialDate);

  const modeFormat = "DD/MM/YYYY";
  const defaultFormat = selectedFormat !== undefined ? selectedFormat : modeFormat;

  const initialValue = value !== undefined ? value : "";
  const selectedValue = initialValue;

  const icon = mode === "date" ? "calendar" : "clock";
  const defaultPlaceholder = "Select a Date";
  const customPlaceholder = placeholder !== undefined ? placeholder : defaultPlaceholder;

  // TODO
  /**
   * Known Issues:
   * 1. Absolute position is wrong when keyboard is open (quick solution, pass keyboardAvoidingRef)
   */

  const handleDateChange = (event: Event, date?: Date) => {
    if(event.type === "dismissed" || event.type === "set")
     {
      setCollapsibleModal(false)
     }
    if (date !== undefined && event.type === "set") {
      setSelectedDate(date);
      setValue(date);
    }
  };

  const handleAnimationClose = () => {
    setCollapse(true);
    setTimeout(() => {
      setCollapsibleModal(false);
    }, 80);
  };

  const handleBackdropPress = () => {
    if (selectedDate !== value) {
      setSelectedDate(new Date());
    }
    handleAnimationClose();
  };

  const handleConfirmDate = () => {
    setValue(selectedDate);
    handleAnimationClose();
  };

  const handleExpand = () => {
    if (disabled !== true) {
      Keyboard.dismiss();
      if (ref !== null && keyboardVisible === false) {
        ref.measure((_x, _y, _width, _height, pageX, pageY) => {
          const measurement = { x: pageX, y: pageY, height: _height, width: _width };
          if (keyboardAvoidingRef !== undefined && keyboardAvoidingRef !== null) {
            Keyboard.dismiss();
            const keyboardOffset = keyboardAvoidingRef.state.bottom;
            measurement.y += keyboardOffset;
            setLayout({ x: pageX, y: pageY + keyboardOffset, height: _height, width: _width });
          } else {
            setLayout(measurement);
          }
        });
        setCollapsibleModal(!collapsibleModal);
        setTimeout(() => {
          setCollapse(false);
        }, 80);
      }
    }
  };

  const dropdownContainer: ViewStyle = {
    backgroundColor: colorWhite._1,
    borderColor: colorBlue._1,
    borderRadius: sw16,
    borderWidth: sw2,
    left: layout.x,
    position: "absolute",
    top: layout.y,
    width: sw360,
    zIndex: 3,
    ...viewStyle,
  };

  const placeholderStyle: TextStyle = selectedValue !== "" ? {} : { color: colorGray._4, fontFamily: NunitoRegular };

  const defaultButtonStyle: ViewStyle = {
    backgroundColor: colorBlue._1,
    borderWidth: 0,
    borderBottomRightRadius: sw16,
    borderBottomLeftRadius: sw16,
    width: sw356,
    ...buttonStyle,
  };

  const handleKeyboardDidShow = () => {
    setKeyboardVisible(true);
  };
  const handleKeyboardHide = () => {
    setKeyboardVisible(false);
  };

  const handleClose = () => {
    setCollapsibleModal(false)
  }

  useEffect(() => {
    const keyboardDidShow = Keyboard.addListener("keyboardDidShow", handleKeyboardDidShow);
    const keyboardDidHide = Keyboard.addListener("keyboardDidHide", handleKeyboardHide);
    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);

  console.log("coll", collapsibleModal)

  return (
    <Fragment>
      <View ref={setRef} renderToHardwareTextureAndroid={true}>
        <TouchableWithoutFeedback onPress={handleExpand}>
          <View onStartShouldSetResponderCapture={() => true}>
            <CustomTextInput
              disabled={disabled}
              error={error}
              editable={false}
              placeholder={customPlaceholder}
              value={dayjs(selectedValue).format("DD/MM/YYYY")}
              viewStyle={viewStyle}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
      {Platform.OS === "ios" ? (
      <BasicModal visible={collapsibleModal} hasBackdrop={true} onClose={handleClose}>
                    <Pressable onPress={handleClose} style={{...centerHV, ...fullWidth, ...fullHeight, }}>
                    
                    <View style={{ maxHeight: 400, backgroundColor: colorWhite._1, borderRadius: sw12, padding: sw20}}>
                    <DateTimePicker
                      // androidVariant="nativeAndroid"
                      display="inline"
                      is24Hour={true}
                      maximumDate={maximumDate}
                      minimumDate={minimumDate}
                      mode={"date"}
                      onChange={handleDateChange}
                      textColor="black"
                      accessibilityViewIsModal={true}
                      value={selectedDate}
                    />

                    </View>

                  </Pressable>
      </BasicModal>
      ): (
        <>
        {collapsibleModal === true ? (

          <DateTimePicker
                        display="default"
                        is24Hour={true}
                        maximumDate={maximumDate}
                        minimumDate={minimumDate}
                        mode={"date"}
                        onChange={handleDateChange}
                        textColor="black"
                        accessibilityViewIsModal={true}
                        value={selectedDate}
                      />
        ): null}
        </>
      )}
      {/* <BasicModal animationOutTiming={80} visible={collapsibleModal} hasBackdrop={false}>
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <View style={fullHW}>
            <View style={dropdownContainer}>
              <View style={{ ...centerVertical, ...flexRow, height: sh44, ...px(sw15) }}>
                <Text style={{ ...fs16BoldBlue1, ...placeholderStyle }}>{dayjs(selectedValue).format("DD/MM/YYYY") || customPlaceholder}</Text>
                <CustomFlexSpacer />
              </View>
              <Collapsible duration={100} collapsed={collapse} style={noBGColor}>
                <View style={{ borderTopWidth: sw2, borderTopColor: colorBlue._1 }}>
                  <View style={pickerStyle}> */}
                  {/* {collapsibleModal ?
                    <DateTimePicker
                      // androidVariant="nativeAndroid"
                      display="calendar"
                      is24Hour={true}
                      maximumDate={maximumDate}
                      minimumDate={minimumDate}
                      mode={"date"}
                      onChange={handleDateChange}
                      style={pickerStyle}
                      textColor="black"
                      value={selectedDate}
                    />
                  : null} */}
                  {/* </View>
                  <View style={{ backgroundColor: colorBlue._1, borderBottomRightRadius: sw12, borderBottomLeftRadius: sw12 }}>
                    <CustomButton
                      buttonStyle={defaultButtonStyle}
                      onPress={handleConfirmDate}
                      text={"Confirm"}
                    />
                  </View>
                </View>
              </Collapsible>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </BasicModal> */}
    </Fragment>
  );
};
