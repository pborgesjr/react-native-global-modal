import { DeviceEventEmitter } from "react-native";
import { IModalPayload } from "./types";
import { ModalProviderEvent } from "./constants";

export * from "./Provider";
export * from "./types";

export const openModal = (payload: IModalPayload) =>
  DeviceEventEmitter.emit(ModalProviderEvent.ON_OPEN, payload);

export const closeModal = (id: IModalPayload["id"]) =>
  DeviceEventEmitter.emit(ModalProviderEvent.ON_CLOSE, id);
