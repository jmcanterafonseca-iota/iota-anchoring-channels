import { ILinkedDataSignature } from "./ILinkedDataSignature";

/**
 * A JSON signed document must include a proof
 */
export interface IJsonSignedDocument extends Record<string, unknown> {
    proof: ILinkedDataSignature;
}