import { closeModal } from ".";
import { IModalPayload } from "./types";

/**
 * Hashes an object into an id
 * @param payload - Modal payload to be hashed into an id
 * @returns The id of the modal
 */
export const hashPayloadToId = (payload: IModalPayload): string => {
  const str = JSON.stringify(payload, Object.keys(payload).sort());
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }

  return (hash >>> 0).toString(16);
};
