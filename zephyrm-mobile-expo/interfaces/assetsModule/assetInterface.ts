/**
 * Interface for asset
 *
 * @module interfaces/assetsModule/assetInterface
 */

export interface Asset {
  title: string;
  category: string;
  description: string;
  acquisitionDate: Date;
  location: string;
  state: state;
  user?: string;
  aid?: string;
  nfcTag?: string;
}

export interface Category {
  cid?: string;
  title: string;
}

type state = "Free" | "On loan" | "Under maintenance" | "Broken";
