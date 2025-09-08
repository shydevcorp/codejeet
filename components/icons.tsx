import { BookOpen, Building, LineChart, User, Settings, Code, Search } from "lucide-react";

export const Icons = {
  bookOpen: BookOpen,
  building: Building,
  chart: LineChart,
  user: User,
  settings: Settings,
  code: Code,
  search: Search,
};

export type Icon = keyof typeof Icons;
