export interface Order {
  id: string;
  customerName: string;
  pickupAddress: string;
  dropAddress: string;
  distance: number; // in km
  estPayout: number; // in ₹
  codAmount: number; // in ₹
  itemsCount: number;
  estTime: number; // in mins
  note?: string;
  status: 'pending' | 'accepted' | 'arrived_at_pickup' | 'picked_up' | 'delivered';
}

export interface Transaction {
  id: string;
  type: 'cod_collected' | 'hub_submission';
  orderId?: string;
  details: string;
  time: string;
  amount: number; // positive for income, negative for expense
}

export type ScreenType = 'dashboard' | 'navigation' | 'pickup_verification' | 'final_step' | 'wallet' | 'profile' | 'earnings';
