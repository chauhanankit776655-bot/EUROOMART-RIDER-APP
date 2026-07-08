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

export interface RiderProfile {
  id: string;
  name: string;
  email: string | null;
  avatar_url: string | null;
  vehicle_type: string;
  vehicle_model: string | null;
  vehicle_number: string | null;
  status: string;
  cod_wallet: number;
  today_deliveries: number;
  today_earnings: number;
  rating: number;
  acceptance_rate: number;
  weekly_online_hours: string;
  driving_license_verified: boolean;
  aadhaar_verified: boolean;
  insurance_active: boolean;
}

