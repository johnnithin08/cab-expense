declare interface IBasicModalProps {
  animationIn?: TypeModalAnimation;
  animationInTiming?: number;
  animationOut?: TypeModalAnimation;
  animationOutTiming?: number;
  backdropColor?: string;
  backdropOpacity?: number;
  children: JSX.Element;
  hasBackdrop?: boolean;
  onClose?: () => void;
  setVisible?: (toggle: boolean) => void;
  style?: import("react-native").ViewStyle;
  visible: boolean;
}
