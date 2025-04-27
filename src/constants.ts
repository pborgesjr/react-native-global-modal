import { ProviderState } from "./types";

/**
 * @description The events that can be emitted by the modal provider
 */
export enum ModalProviderEvent {
  ON_OPEN = "modal-open-event-request",
  ON_CLOSE = "modal-close-event-request",
}

/**
 * @description The events that can be emitted by the modal
 */
export enum ActionType {
  ON_OPEN = "open",
  ON_CLOSE = "close",
  ON_ANIMATION = "animation",
  ADD_TO_QUEUE = "addToQueue",
}

export const INITIAL_STATE: ProviderState = {
  current: {
    id: undefined,
    children: undefined,
    unnavoidable: false,
  },
  isVisible: false,
  next: undefined,
  transitioning: false,
};
