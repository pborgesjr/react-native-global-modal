import React, { useEffect, useReducer, ReactNode } from "react";
import { DeviceEventEmitter } from "react-native";

import { Modal } from "./Modal";
import { INITIAL_STATE, ActionType, ModalProviderEvent } from "./constants";
import { Action, IModalPayload, ProviderState } from "./types";
import { hashPayloadToId } from "./utils";

const reducerFn = (state: ProviderState, action: Action): ProviderState => {
  switch (action.type) {
    case ActionType.ON_OPEN:
      return {
        ...state,
        isVisible: true,
        current: action.payload,
        next: undefined,
      };
    case ActionType.ON_CLOSE:
      return { ...state, isVisible: false };
    case ActionType.ADD_TO_QUEUE:
      return { ...state, next: action.payload };
    case ActionType.ON_ANIMATION:
      return { ...state, transitioning: action.payload };
    default:
      return state;
  }
};

/**
 * @param children - The children of the provider
 * @param discardModalWithSameId - If true, the modal with the same id will not be displayed
 */
type GlobalModalProviderProps = {
  children: ReactNode;
  discardModalWithSameId?: boolean;
};

export const GlobalModalProvider = ({
  children,
  discardModalWithSameId,
}: GlobalModalProviderProps) => {
  const [state, dispatch] = useReducer(reducerFn, INITIAL_STATE);

  const onStartAnimation = () =>
    dispatch({ type: ActionType.ON_ANIMATION, payload: true });

  const onFinishAnimation = () =>
    dispatch({ type: ActionType.ON_ANIMATION, payload: false });

  const onModalHide = () => {
    if (state.next) {
      onRequestOpen(state.next);
    }
  };

  const onRequestOpen = (payload: IModalPayload) => {
    /** If the current modal is unnavoidable and visible, do not open a new modal */
    if (state.isVisible && state.current.unnavoidable) {
      return;
    }

    /** If the current modal is visible, it has discardModalWithSameId enabled and the new modal has the same ID, do not open a new modal */
    if (
      state.isVisible &&
      payload.id === state.current.id &&
      discardModalWithSameId
    ) {
      return;
    }

    /** If the current modal is visible or transitioning, there is no next modal in the queue and the new modal has skipAnimation set to false, add the new modal to the queue and close the current modal */
    if (
      (state.isVisible || state.transitioning) &&
      !state.next &&
      !payload.skipAnimation
    ) {
      dispatch({ type: ActionType.ADD_TO_QUEUE, payload });
      dispatch({ type: ActionType.ON_CLOSE });
      return;
    }

    /** Open the new modal with the provided ID or an auto-generated ID */
    dispatch({
      type: ActionType.ON_OPEN,
      payload: { ...payload, id: payload.id || hashPayloadToId(payload) },
    });
  };

  const onRequestClose = (id: IModalPayload["id"]) => {
    /** Early return if modal is not visible */
    if (!state.isVisible) {
      return;
    }

    /** If the current modal is unnavoidable and the ID does not match, do not close the modal */
    if (state.current.unnavoidable && id !== state.current.id) {
      return;
    }

    /** Close the current modal */
    dispatch({ type: ActionType.ON_CLOSE });
  };

  /** Adding event listeners to deal with modal events */
  useEffect(() => {
    const onOpen = DeviceEventEmitter.addListener(
      ModalProviderEvent.ON_OPEN,
      onRequestOpen
    );

    const onClose = DeviceEventEmitter.addListener(
      ModalProviderEvent.ON_CLOSE,
      onRequestClose
    );

    return () => {
      onOpen.remove();
      onClose.remove();
    };
  }, []);

  return (
    <>
      {children}
      <Modal
        {...state.current}
        onStartAnimation={onStartAnimation}
        onFinishAnimation={onFinishAnimation}
        onModalHide={onModalHide}
        isVisible={state.isVisible}
      >
        {state.current.children}
      </Modal>
    </>
  );
};
