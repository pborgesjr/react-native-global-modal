import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import RNModal, { ModalProps as RNModalProps } from "react-native-modal";

const ANIMATION_IN_TIMING = 200;
const ANIMATION_OUT_TIMING = 200;
const DEVICE_HEIGHT = Dimensions.get("screen").height;
const DEVICE_WIDTH = Dimensions.get("screen").width;

export interface ModalProps
  extends Partial<Omit<RNModalProps, "onBackdropPress">> {
  onBackButtonPress?: VoidFunction;
  onBackdropPress?: VoidFunction;
  onStartAnimation?: VoidFunction;
  onFinishAnimation?: VoidFunction;
}

export const Modal = ({
  children,
  onBackButtonPress,
  onBackdropPress,
  onStartAnimation,
  onFinishAnimation,
  onModalHide,
  ...rest
}: ModalProps) => {
  const handleOnModalHide = () => {
    onFinishAnimation?.();
    onModalHide?.();
  };
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
      useNativeDriver
      useNativeDriverForBackdrop
      hasBackdrop
      style={styles.default}
      {...rest}
    >
      {children}
    </RNModal>
  );
};

const styles = StyleSheet.create({
  default: {
    alignItems: "center",
  },
});
