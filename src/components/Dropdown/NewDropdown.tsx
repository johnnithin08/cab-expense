import React, { Fragment, FunctionComponent, useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import Collapsible from "react-native-collapsible";

import { NunitoRegular } from "../../constants";
import {
  absolutePosition,
  centerHV,
  centerVertical,
  circle,
  colorBlack,
  colorBlue,
  colorGray,
  colorGreen,
  colorTransparent,
  colorWhite,
  flexRow,
  fs12BoldGray6,
  fs12RegBlue5,
  fs16BoldBlue1,
  fullHW,
  noBGColor,
  px,
  py,
  scaleHeight,
  sh12,
  sh16,
  sh176,
  sh20,
  sh24,
  sh240,
  sh28,
  sh4,
  sh40,
  sh44,
  sh48,
  sh8,
  sw15,
  sw16,
  sw2,
  sw24,
  sw286,
  sw296,
  sw328,
  sw360,
} from "../../styles";
import { AnimationUtils, isArrayNotEmpty } from "../../utils";
import { CustomTextInput } from "../Input";
import { BasicModal } from "../Modals";
import { CustomFlexSpacer, CustomSpacer } from "../Views/Spacer";
import { Icon, Icons } from "../Icon";


interface NewDropdownProps {
  disabled?: boolean;
  error?: string;
  handleChange: (text: string) => void;
  items: TypeLabelValue[];
  keyboardAvoidingRef?: TypeKeyboardAvoidingView;
  label?: string;
  labelStyle?: TextStyle;
  loading?: boolean;
  maxHeight?: number;
  modal?: boolean;
  onOpen?: () => void;
  placeholder?: string;
  scrollBack?: boolean;
  searchable?: boolean;
  spaceToLabel?: number;
  spaceToTop?: number;
  style?: ViewStyle;
  value: string;
  viewStyle?: ViewStyle;
}

interface ISearch {
  items: TypeLabelValue[];
  value: string;
}

interface IKeyboardEvent {
  endCoordinates: { height: number; screenX: number; screenY: number; width: number };
  startCoordinates: { height: number; screenX: number; screenY: number; width: number };
}

export const NewDropdown: FunctionComponent<NewDropdownProps> = ({
  disabled,
  error,
  handleChange,
  items,
  keyboardAvoidingRef,
  label,
  labelStyle,
  loading,
  maxHeight,
  modal,
  onOpen,
  placeholder,
  scrollBack,
  searchable,
  spaceToLabel,
  spaceToTop,
  style,
  value,
  viewStyle,
}: NewDropdownProps) => {
  const [layout, setLayout] = useState<IBasicLayout>({ x: 0, y: 0, width: 0, height: 0 });
  const [search, setSearch] = useState<ISearch>({ items: [], value: "" });
  const [ref, setRef] = useState<View | null>(null);
  const [dummyInputRef, setDummyInputRef] = useState<TextInput | null>(null);
  const [inputRef, setInputRef] = useState<TextInput | null>(null);
  const [inputFocus, setInputFocus] = useState<boolean>(false);
  const [collapse, setCollapse] = useState<boolean>(true);
  const [collapsibleModal, setCollapsibleModal] = useState<boolean>(false);
  const [initialYPosition, setInitialYPosition] = useState<number>(0);

  const placeholderLabel = placeholder || "Select One";
  const defaultLabelSpace = spaceToLabel === undefined ? sh4 : spaceToLabel;
  const defaultMaxHeight = maxHeight !== undefined ? maxHeight : sh240;
  const checkModal = modal === true ? sh24 : 0;

  // for some reason, organize imports on save removes sh292 from the import
  const sh292 = scaleHeight(292);
  const defaultTotalHeight = maxHeight !== undefined ? maxHeight + sh48 : sh292 + checkModal;
  const defaultDummySpace = maxHeight !== undefined ? maxHeight + sh20 : sh292 - sh28;
  const labelExtractor = search.value !== "" ? search.items.map((item) => item.label) : items.map((item) => item.label);

  const handleAnimationClose = () => {
    setCollapse(true);
    setTimeout(() => {
      setCollapsibleModal(false);
    }, 80);
  };

  const handleBackdropPress = () => {
    handleAnimationClose();
  };

  const handleExpand = () => {
    if (disabled !== true) {
      Keyboard.dismiss();
      if (ref !== null) {
        ref.measure((_x, _y, _width, _height, pageX, pageY) => {
          const measurement = { x: pageX, y: pageY, height: _height, width: _width };
          if (keyboardAvoidingRef !== undefined && keyboardAvoidingRef !== null) {
            Keyboard.dismiss();
            const keyboardOffset = keyboardAvoidingRef.state.bottom;
            measurement.y += keyboardOffset;
            setLayout({ x: pageX, y: pageY + keyboardOffset, height: _height, width: _width });
          } else {
            setInitialYPosition(pageY);
            setLayout(measurement);
          }
        });
        setCollapsibleModal(!collapsibleModal);
        setTimeout(() => {
          setCollapse(false);
        }, 80);
      }
      if (onOpen !== undefined) {
        onOpen();
      }
    }
  };

  const handleLayout = useCallback(
    (keyboardIn: boolean, keyboardEvent: IKeyboardEvent) => {
      if (layout.y !== 0) {
        const checkInitialPosition = scrollBack === true ? initialYPosition : layout.y;
        const updatedYPosition =
          keyboardIn === false
            ? checkInitialPosition
            : Dimensions.get("screen").height - keyboardEvent.endCoordinates.height - defaultTotalHeight;
        const currentHeight = layout.y + defaultTotalHeight;
        const heightRemaining = Dimensions.get("screen").height - keyboardEvent.endCoordinates.height;
        let measurement = { x: 0, y: 0, height: 0, width: 0 };
        if (currentHeight > heightRemaining) {
          if (keyboardIn === true) {
            AnimationUtils.layout({ duration: 100 });
          } else {
            AnimationUtils.layout({ duration: 150 });
          }
          if (keyboardIn === true) {
            setLayout({ ...layout, y: updatedYPosition });
          }
        } else if (keyboardIn === false) {
          ref!.measure((_x, _y, _width, _height, pageX, pageY) => {
            measurement = { x: pageX, y: pageY, height: _height, width: _width };
            if (measurement.y !== layout.y) {
              setLayout({ ...layout, y: measurement.y });
            }
            AnimationUtils.layout({ duration: 150 });
          });
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [layout],
  );

  const handleKeyboardDidShow = useCallback(
    (e: KeyboardEvent) => {
      handleLayout(true, e as IKeyboardEvent);
    },
    [handleLayout],
  );

  const handleKeyboardWillHide = useCallback(
    (e: KeyboardEvent) => {
      handleLayout(false, e as IKeyboardEvent);
      setInputFocus(false);
    },
    [handleLayout],
  );

  const handleDummyFocus = () => {
    if (inputRef !== null) {
      inputRef.focus();
    }
  };

  const handleInputFocus = () => {
    if (dummyInputRef !== null) {
      if (inputFocus === false) {
        setTimeout(() => {
          dummyInputRef.focus();
          if (inputFocus === false) {
            setInputFocus(true);
          }
        }, 350);
      }
    }
  };

  const handleSearch = (searchText: string) => {
    const filteredResults: TypeLabelValue[] = items!.filter((item: TypeLabelValue) =>
      item.label.toLowerCase().includes(searchText.toLowerCase()),
    );
    setSearch({ ...search, items: filteredResults, value: searchText });
  };

  useEffect(() => {
    const keyboardDidShow = Keyboard.addListener("keyboardDidShow", handleKeyboardDidShow);
    const keyboardWillHide = Keyboard.addListener("keyboardWillHide", handleKeyboardWillHide);
    return () => {
      keyboardDidShow.remove();
      keyboardWillHide.remove();
    };
    // Added the functions in dependency to  get the updated value of layout inside those functions
  }, [handleKeyboardDidShow, handleKeyboardWillHide]);

  const dropdownContainer: ViewStyle = {
    backgroundColor: colorWhite._1,
    borderColor: colorBlue._1,
    borderRadius: sw16,
    borderWidth: sw2,
    left: layout.x,
    top: layout.y,
    width: sw360,
    zIndex: 3,
    ...absolutePosition,
    ...viewStyle,
  };

  const placeholderStyle: TextStyle = value ? {} : { color: colorBlack._2, fontFamily: NunitoRegular };
  const inputStyle: ViewStyle = collapsibleModal ? { borderColor: colorTransparent } : {};

  const widthStyle: ViewStyle = viewStyle !== undefined && viewStyle.width !== undefined ? { maxWidth: viewStyle.width } : {};

  const searchedItems = search.value !== "" ? search.items : items;

  return (
    <View>
      <View>
        {spaceToTop !== undefined ? <CustomSpacer space={spaceToTop} /> : null}
        {label === undefined ? null : (
          <Fragment>
            <Text style={{ ...fs12BoldGray6, ...labelStyle }}>{label}</Text>
            <CustomSpacer space={defaultLabelSpace} />
          </Fragment>
        )}
        <View ref={setRef} renderToHardwareTextureAndroid={true}>
          <TouchableWithoutFeedback onPress={handleExpand}>
            <View onStartShouldSetResponderCapture={() => true}>
              <CustomTextInput
                disabled={disabled}
                error={error}
                editable={false}
                placeholder={placeholderLabel}
                placeholderTextColor={colorGray._4}
                rightIcon={{ name: "caret-down" }}
                viewStyle={{ ...inputStyle, ...viewStyle }}
                value={value}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
      {/* {collapsibleModal === true ? ( */}
      <Fragment>
        <View onStartShouldSetResponder={() => false} style={{ ...absolutePosition, top: defaultDummySpace }}>
          <CustomTextInput
            setRef={setDummyInputRef}
            onFocus={handleDummyFocus}
            selectionColor={colorTransparent}
            viewStyle={{ backgroundColor: colorTransparent, borderColor: colorTransparent }}
            value=""
          />
        </View>
      </Fragment>
      {/* ) : null} */}
      <BasicModal animationOutTiming={80} visible={collapsibleModal} hasBackdrop={false}>
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <View style={fullHW}>
            <View style={dropdownContainer}>
              <View style={{ ...centerVertical, ...flexRow, height: sh44, ...px(sw15) }}>
                <Text numberOfLines={1} style={{ ...fs16BoldBlue1, ...placeholderStyle, maxWidth: sw286, ...widthStyle }}>
                  {value || placeholderLabel}
                </Text>
                <CustomFlexSpacer />
                <Icon type={Icons.FontAwesome} color={colorBlue._1} name="caret-down" size={sw24} />
              </View>
              <Collapsible duration={100} collapsed={collapse} style={noBGColor}>
                <View style={{ borderTopWidth: sw2, borderTopColor: colorBlue._1, maxHeight: defaultMaxHeight }}>
                    <Fragment>
                      {searchable === true ? (
                        <Pressable style={{ ...px(sw16), ...py(sh16) }}>
                          <CustomTextInput
                            leftIcon={{ name: "search" }}
                            viewStyle={{ width: sw328, height: sh40 }}
                            keyboardType="default"
                            onFocus={handleInputFocus}
                            setRef={setInputRef}
                            onChangeText={handleSearch}
                            value={search.value}
                          />
                        </Pressable>
                      ) : null}
                      <View style={style}>
                        {!isArrayNotEmpty(labelExtractor) && search.value ? (
                          // TODO temporary
                          <View style={centerHV}>
                            <Text style={{ ...fs12RegBlue5, ...py(sh8) }}>No results found.</Text>
                          </View>
                        ) : (
                          <FlatList
                            data={labelExtractor}
                            style={{ borderBottomLeftRadius: sw16, borderBottomRightRadius: sw16, maxHeight: sh176 }}
                            keyboardDismissMode="on-drag"
                            keyboardShouldPersistTaps="always"
                            keyExtractor={(item: string, index: number) => `${item}-${index}`}
                            ListHeaderComponent={() => (searchable ? null : <CustomSpacer space={sh8} />)}
                            ListFooterComponent={() => <CustomSpacer space={sh8} />}
                            renderItem={({ index }) => {
                              const itemExtractor = searchedItems[index];
                              const itemContainer: ViewStyle = { ...centerVertical, ...flexRow, ...py(sh8), ...px(sw16) };
                              const selectedStyle: ViewStyle = value === itemExtractor.label ? { backgroundColor: colorBlue._2 } : {};

                              const handleSelect = () => {
                                handleAnimationClose();
                                setTimeout(() => {
                                  if (itemExtractor !== undefined) {
                                    handleChange(itemExtractor.value);
                                  }
                                }, 250);
                              };

                              return (
                                <TouchableWithoutFeedback key={index} onPress={handleSelect}>
                                  <View style={{ ...itemContainer, ...selectedStyle }}>
                                    {index === 0 || <CustomSpacer space={sh8} />}
                                    <Text
                                      numberOfLines={1}
                                      style={{ ...fs16BoldBlue1, maxWidth: value === itemExtractor.label ? sw296 : sw328, ...widthStyle }}>
                                      {itemExtractor.label}
                                    </Text>
                                    {value === itemExtractor.label ? (
                                      <Fragment>
                                        <CustomFlexSpacer />
                                        <View style={{ ...centerHV, ...circle(sw16, colorGreen._1) }}>
                                          <Icon type={Icons.AntDesign} color={colorWhite._1} name="check" size={sh12} />
                                        </View>
                                      </Fragment>
                                    ) : null}
                                    {index === labelExtractor.length - 1 || <CustomSpacer space={sh8} />}
                                  </View>
                                </TouchableWithoutFeedback>
                              );
                            }}
                            showsVerticalScrollIndicator={false}
                          />
                        )}
                      </View>
                    </Fragment>
                </View>
              </Collapsible>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </BasicModal>
    </View>
  );
};
