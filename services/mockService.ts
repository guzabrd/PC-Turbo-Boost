
import { Customer, DashboardStats, Plan, Subscription, Payment } from '../types';

const STORAGE_KEYS = {
  CUSTOMERS: 'pcturbo_customers',
  PLANS: 'pcturbo_plans',
  SUBSCRIPTIONS: 'pcturbo_subscriptions',
  PAYMENTS: 'pcturbo_payments'
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const SEED_DATA = {
  customers: [
    { id: 'c1', name: 'João Silva', email: 'joao@gamer.com', status: 'active', createdAt: new Date() },
    { id: 'c2', name: 'Maria Pro', email: 'maria@itxgamer.com', status: 'active', createdAt: new Date() },
    { id: 'c3', name: 'Lucas FPS', email: 'lucas@fps.com', status: 'inactive', createdAt: new Date() },
  ],
  plans: [
    { id: 'p1', name: 'Plano Boost Básico', price: 19.90, active: true },
    { id: 'p2', name: 'Plano Performance Pro', price: 39.90, active: true },
    { id: 'p3', name: 'Plano Ultimate Gamer', price: 59.90, active: true },
  ]
};

const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(SEED_DATA.customers));
  }
  // Initialize missing storage keys with seed data or empty arrays
  if (!localStorage.getItem(STORAGE_KEYS.PLANS)) {
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(SEED_DATA.plans));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS)) {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify([]));
  }
};

initStorage();

export const mockService = {
  getCustomers: async (): Promise<Customer[]> => {
    await delay(400);
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMERS) || '[]');
  },
  createCustomer: async (data: Omit<Customer, 'id' | 'createdAt'>) => {
    await delay(600);
    const customers = await mockService.getCustomers();
    const newCustomer = { ...data, id: Math.random().toString(36).substr(2, 9), createdAt: new Date() };
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify([...customers, newCustomer]));
    return newCustomer;
  },
  updateCustomer: async (id: string, data: Partial<Customer>) => {
    const customers = await mockService.getCustomers();
    const updated = customers.map(c => c.id === id ? { ...c, ...data } : c);
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(updated));
  },
  deleteCustomer: async (id: string) => {
    const customers = await mockService.getCustomers();
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers.filter(c => c.id !== id)));
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    const customers = await mockService.getCustomers();
    const active = customers.filter(c => c.status === 'active').length;

    return {
      totalCustomers: customers.length,
      activeCustomers: active,
      inactiveCustomers: customers.length - active,
      growthRate: 15 // Simulado
    };
  },

  // Added missing methods to handle Plans
  getPlans: async (): Promise<Plan[]> => {
    await delay(400);
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PLANS) || '[]');
  },
  createPlan: async (data: Omit<Plan, 'id'>) => {
    await delay(600);
    const plans = await mockService.getPlans();
    const newPlan = { ...data, id: Math.random().toString(36).substr(2, 9) };
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify([...plans, newPlan]));
    return newPlan;
  },

  // Added missing methods to handle Subscriptions
  getSubscriptions: async (): Promise<Subscription[]> => {
    await delay(400);
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS) || '[]');
  },
  createSubscription: async (data: Omit<Subscription, 'id' | 'status'>) => {
    await delay(600);
    const subs = await mockService.getSubscriptions();
    const newSub: Subscription = { 
      ...data, 
      id: Math.random().toString(36).substr(2, 9), 
      status: 'active' 
    };
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify([...subs, newSub]));
    return newSub;
  },

  // Added missing methods to handle Payments
  getPayments: async (): Promise<Payment[]> => {
    await delay(400);
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYMENTS) || '[]');
  },
  createPayment: async (subscriptionId: string, amount: number) => {
    await delay(600);
    const payments = await mockService.getPayments();
    const newPayment: Payment = { 
      id: Math.random().toString(36).substr(2, 9), 
      subscriptionId, 
      amount, 
      paidAt: new Date().toISOString() 
    };
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify([...payments, newPayment]));
    return newPayment;
  }
};
