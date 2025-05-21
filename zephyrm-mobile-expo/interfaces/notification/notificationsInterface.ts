import { Asset } from "../assetsModule/assetInterface";
import { EventInter } from "../calendar/eventInterface";

export interface NotificationInter {
  title: string;
  description: string;
  read?: boolean;
  user: string[];
  event?: EventInter;
  asset?: Asset;
  eventDate?: Date;
  creationDate?: Date;
  nid?: string;
}
