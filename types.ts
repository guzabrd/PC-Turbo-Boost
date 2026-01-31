
export enum View {
  DASHBOARD = 'dashboard',
  CUSTOMERS = 'customers',
  AI_ASSISTANT = 'ai_assistant',
  LOGIN = 'login',
  FAQ = 'faq',
  GAMES = 'games',
  DIAGNOSTIC = 'diagnostic',
  SCRIPTS = 'scripts'
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  notes?: string;
  createdAt: Date;
}

export interface DashboardStats {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  growthRate: number;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export interface DiagnosticData {
  cpuUsage: number;
  ramUsage: number;
  diskSpeed: number;
  temp: number;
  os: string;
  score: number;
}

export interface Optimization {
  id: string;
  title: string;
  type: 'PowerShell' | 'CMD';
  date: Date;
}

// Added missing interface for Plans management
export interface Plan {
  id: string;
  name: string;
  price: number;
  active: boolean;
}

// Added missing interface for Subscription tracking
export interface Subscription {
  id: string;
  customerId: string;
  planId: string;
  startDate: string;
  nextRenewal: string;
  status: 'active' | 'overdue' | 'cancelled';
}

// Added missing interface for Payment logging
export interface Payment {
  id: string;
  subscriptionId: string;
  amount: number;
  paidAt: string;
}
