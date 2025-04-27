import { ReactNode } from "react";
import { ActionType } from "./constants";
import { ModalProps } from "./Modal";

/**
 * @param id - The id of the modal
 * @param children - The content of the modal
 * @param unnavoidable - When true, the modal will be displayed with priority over other modals and can only be closed providing the id
 * @param skipAnimation - When true, the modal will not have animation when opening or closing
 */
export interface IModalPayload extends ModalProps {
  id?: string;
  children: ReactNode;
  unnavoidable?: boolean;
  skipAnimation?: boolean;
}

/**
 * @param current - The current modal props
 * @param next - The next modal props
 * @param transitioning - Whether the modal is transitioning or not
 * @param isVisible - Whether the modal is visible or not
 */
export type ProviderState = {
  current: IModalPayload;
  next?: IModalPayload;
  transitioning: boolean;
  isVisible: boolean;
};

/**
 * @param type - The type of the action
 */
export type Action =
  | { type: ActionType.ON_OPEN; payload: IModalPayload }
  | { type: ActionType.ON_CLOSE }
  | { type: ActionType.ON_ANIMATION; payload: boolean }
  | { type: ActionType.ADD_TO_QUEUE; payload: IModalPayload };
