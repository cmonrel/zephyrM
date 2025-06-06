/**
 * Interface for event
 *
 * @module interfaces/calendar/eventInterface
 */

import { Asset } from "../assetsModule/assetInterface";
import { User } from "../login/userInterface";

export interface EventInter {
  title: string;
  description: string;
  start: Date;
  end: Date;
  user?: User;
  asset?: Asset;
  eid?: string;
}

export interface EventDateString extends Omit<EventInter, "start" | "end"> {
  start: string;
  end: string;
}
