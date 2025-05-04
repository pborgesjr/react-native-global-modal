import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import RNModal, { ModalProps as RNModalProps } from "react-native-modal";

/** Animation in timing */
const ANIMATION_IN_TIMING = 200;
/** Animation out timing */
const ANIMATION_OUT_TIMING = 200;
/** Device height */
const DEVICE_HEIGHT = Dimensions.get("screen").height;
/** Device width */
const DEVICE_WIDTH = Dimensions.get("screen").width;

/** Modal props */
export interface ModalProps
  extends Partial<Omit<RNModalProps, "onBackdropPress">> {
  onBackButtonPress?: () => void;
  onBackdropPress?: () => void;
  onStartAnimation?: () => void;
  onFinishAnimation?: () => void;
}

/** Modal component */
export const Modal = ({
  children,
  onBackButtonPress,
  onBackdropPress,
  onStartAnimation,
  onFinishAnimation,
  onModalHide,
  ...rest
}: ModalProps) => {
  /** Handle modal hide */
  const handleOnModalHide = () => {
    onFinishAnimation?.();
    onModalHide?.();
  };

  /** Render modal */
  return (
    <RNModal
      animationInTiming={ANIMATION_IN_TIMING}
      animationOutTiming={ANIMATION_OUT_TIMING}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      statusBarTranslucent
      onModalWillShow={onStartAnimation}
      onModalShow={onFinishAnimation}
      onModalWillHide={onStartAnimation}
      onModalHide={handleOnModalHide}
      deviceHeight={DEVICE_HEIGHT}
      deviceWidth={DEVICE_WIDTH}
      hideModalContentWhileAnimating
      onBackdropPress={onBackdropPress}
      onBackButtonPress={onBackButtonPress}
      useNativeDriverForBackdrop
      hasBackdrop
      style={styles.default}
      {...rest}
    >
      {children}
    </RNModal>
  );
};

/** Default modal styles */
const styles = StyleSheet.create({
  default: {
    alignItems: "center",
  },
});
