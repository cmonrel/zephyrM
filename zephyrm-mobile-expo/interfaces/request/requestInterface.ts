/**
 * Interface for request
 *
 * @module interfaces/request/requestInterface
 */

export type status = "Pending" | "Approved" | "Denied";

export interface RequestInter {
  title: string;
  motivation: string;
  user: string;
  asset: string;
  denialMotive?: string;
  status?: status;
  creationDate?: Date;
  rid?: string;
}
