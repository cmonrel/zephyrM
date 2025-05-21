export interface Asset {
  title: string;
  category: string;
  description: string;
  acquisitionDate: Date;
  location: string;
  state: state;
  user: string;
  aid?: string;
}

type state = "Free" | "On loan" | "Under maintenance" | "Broken";
