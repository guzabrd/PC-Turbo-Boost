
export enum View {
  FAQ = 'faq',
  DIAGNOSTIC = 'diagnostic',
  SCRIPTS = 'scripts',
  GAMES = 'games'
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export interface Optimization {
  id: string;
  title: string;
  type: 'PowerShell' | 'CMD' | 'Settings';
  date: Date;
  status: 'pending' | 'applied';
}

export interface DiagnosticData {
  cpuUsage: number;
  ramUsage: number;
  diskSpeed: number;
  temp: number;
  os: string;
  score: number;
}
