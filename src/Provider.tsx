import React, { Component, ReactNode } from "react";
import { DeviceEventEmitter, EmitterSubscription } from "react-native";

import { Modal } from "./Modal";
import { INITIAL_STATE, ModalProviderEvent } from "./constants";
import { IModalPayload, ProviderState } from "./types";
import { hashPayloadToId } from "./utils";

/**
 * @param children - The children of the provider
 * @param discardModalWithSameId - If true, the modal with the same id will not be displayed
 */
type GlobalModalProviderProps = {
  children: ReactNode;
  discardModalWithSameId?: boolean;
};

export class GlobalModalProvider extends Component<
  GlobalModalProviderProps,
  ProviderState
> {
  private openListener: EmitterSubscription | null = null;
  private closeListener: EmitterSubscription | null = null;

  constructor(props: GlobalModalProviderProps) {
    super(props);
    this.state = INITIAL_STATE;

    /** Binding methods to ensure they have the correct 'this' context when called */
    this.onRequestOpen = this.onRequestOpen.bind(this);
    this.onRequestClose = this.onRequestClose.bind(this);
    this.onStartAnimation = this.onStartAnimation.bind(this);
    this.onFinishAnimation = this.onFinishAnimation.bind(this);
    this.onModalHide = this.onModalHide.bind(this);
  }

  componentDidMount() {
    /** Adding open modal event listener */
    this.openListener = DeviceEventEmitter.addListener(
      ModalProviderEvent.ON_OPEN,
      this.onRequestOpen
    );

    /** Adding close modal event listener */
    this.closeListener = DeviceEventEmitter.addListener(
      ModalProviderEvent.ON_CLOSE,
      this.onRequestClose
    );
  }

  componentWillUnmount() {
    /** Removing modal event listeners */
    this.openListener?.remove();
    this.closeListener?.remove();
  }

  onRequestOpen(payload: IModalPayload) {
    const { discardModalWithSameId } = this.props;
    const { isVisible, current, transitioning, next } = this.state;

    /** If the payload has no ID and discardModalWithSameId is enabled, generate a new ID */
    const payloadId =
      !payload.id && discardModalWithSameId
        ? hashPayloadToId(payload)
        : payload.id;

    /** If the current modal is unnavoidable and visible, do not open a new modal */
    if (isVisible && current.unnavoidable) {
      return;
    }

    /** If the current modal is visible, it has discardModalWithSameId enabled and the new modal has the same ID, do not open a new modal */
    if (isVisible && payloadId === current.id && discardModalWithSameId) {
      return;
    }

    /** If the current modal is visible or transitioning, there is no next modal in the queue and the new modal has skipAnimation set to false, add the new modal to the queue and close the current modal */
    if ((isVisible || transitioning) && !next && !payload.skipAnimation) {
      this.setState({ next: payload });
      this.setState({ isVisible: false });
      return;
    }

    /** Open the new modal with the provided ID or an auto-generated ID */
    this.setState({
      isVisible: true,
      current: { ...payload, id: payloadId },
      next: undefined,
    });
  }

  onRequestClose(id?: IModalPayload["id"]) {
    const { isVisible, current } = this.state;

    /** Early return if modal is not visible */
    if (!isVisible) {
      return;
    }

    /** If the current modal is unnavoidable and the ID does not match, do not close the modal */
    if (current.unnavoidable && id !== current.id) {
      return;
    }

    /** Close the current modal */
    this.setState({ isVisible: false });
  }

  /** Starting animation */
  onStartAnimation() {
    this.setState({ transitioning: true });
  }

  /** Finishing animation */
  onFinishAnimation() {
    this.setState({ transitioning: false });
  }

  /** Modal hide callback */
  onModalHide() {
    const { next } = this.state;
    if (next) {
      this.onRequestOpen(next);
    }
  }

  render() {
    const { children } = this.props;
    const { current, isVisible } = this.state;

    return (
      <>
        {children}
        <Modal
          {...current}
          onStartAnimation={this.onStartAnimation}
          onFinishAnimation={this.onFinishAnimation}
          onModalHide={this.onModalHide}
          isVisible={isVisible}
        >
          {current.children}
        </Modal>
      </>
    );
  }
}
