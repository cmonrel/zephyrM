import { Event as RBCEvent } from "react-big-calendar";
import { Asset } from "../assetsModule/assetInterface";
import { User } from "../login/userInterface";

export interface EventInter extends RBCEvent {
  title: string;
  description: string;
  start: Date;
  end: Date;
  user: User;
  asset: Asset;
  eid: string;
}

export interface EventDateString extends Omit<EventInter, "start" | "end"> {
  start: string;
  end: string;
}
