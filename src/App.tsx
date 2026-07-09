import React, { useState, useEffect, useCallback } from 'react';
import { Order, Transaction, ScreenType, RiderProfile } from './types';
import Dashboard from './components/Dashboard';
import NavigationScreen from './components/NavigationScreen';
import PickupVerification from './components/PickupVerification';
import FinalStep from './components/FinalStep';
import WalletScreen from './components/WalletScreen';
import ProfileScreen from './components/ProfileScreen';
import EarningsScreen from './components/EarningsScreen';
import LoginScreen from './components/LoginScreen';
import { supabase, isSupabaseConfigured } from './supabaseClient';

// Helper to generate dynamic, realistic pending orders
const generateNewOrder = (customId?: string): Order => {
  const ids = ['EM-992A', 'ORD-8821', 'ORD-8921', 'ORD-445B', 'ORD-109X'];
  const locations = [
    { pickup: 'Indiranagar (EurooMart Hub)', drop: 'Koramangala 4th Block', dist: 4.2, pay: 65, cod: 450, count: 3, time: 12 },
    { pickup: 'EurooMart Central Hub', drop: '124 Logistics Way, Sector 7', dist: 2.4, pay: 50, cod: 450, count: 3, time: 12 },
    { pickup: 'HSR Layout Sector 1', drop: 'Bellandur Gate Hub', dist: 3.8, pay: 55, cod: 250, count: 2, time: 10 },
    { pickup: 'Whitefield Main Rd', drop: 'Brookefield EurooMart', dist: 5.1, pay: 75, cod: 890, count: 4, time: 15 },
    { pickup: 'Malleswaram 8th Cross', drop: 'Rajajinagar Sector 3', dist: 2.9, pay: 45, cod: 120, count: 1, time: 8 },
  ];
  
  const randLoc = locations[Math.floor(Math.random() * locations.length)];
  const randId = customId || (ids[Math.floor(Math.random() * ids.length)] + '-' + Math.floor(100 + Math.random() * 900));
  const names = ['Rahul Sharma', 'Anjali Gupta', 'Alice S.', 'Karan Johar', 'Neha Patel'];
  const notes = [
    'Note: Please call upon arrival, doorbell is broken.',
    'Note: Deliver to reception, do not enter residence.',
    'Note: Cash on delivery, keep exact change ready.',
    'Note: Contact-less delivery. Leave package on doorstep and ring bell.'
  ];
  
  return {
    id: randId,
    customerName: names[Math.floor(Math.random() * names.length)],
    pickupAddress: randLoc.pickup,
    dropAddress: randLoc.drop,
    distance: randLoc.dist,
    estPayout: randLoc.pay,
    codAmount: randLoc.cod,
    itemsCount: randLoc.count,
    estTime: randLoc.time,
    note: notes[Math.floor(Math.random() * notes.length)],
    status: 'pending',
  };
};

const initialCompletedOrders: Order[] = [
  {
    id: 'ORD-892',
    customerName: 'Karan Johar',
    pickupAddress: 'EurooMart Central Hub',
    dropAddress: '124 Logistics Way, Sector 7',
    distance: 2.4,
    estPayout: 65,
    codAmount: 450,
    itemsCount: 3,
    estTime: 12,
    status: 'delivered',
    note: 'Delivered at 02:45 PM'
  },
  {
    id: 'ORD-887',
    customerName: 'Anjali Gupta',
    pickupAddress: 'Indiranagar (EurooMart Hub)',
    dropAddress: 'Koramangala 4th Block',
    distance: 4.2,
    estPayout: 75,
    codAmount: 1200,
    itemsCount: 4,
    estTime: 15,
    status: 'delivered',
    note: 'Delivered at 01:15 PM'
  },
  {
    id: 'ORD-810',
    customerName: 'Rahul Sharma',
    pickupAddress: 'HSR Layout Sector 1',
    dropAddress: 'Bellandur Gate Hub',
    distance: 3.8,
    estPayout: 75,
    codAmount: 0,
    itemsCount: 2,
    estTime: 10,
    status: 'delivered',
    note: 'Delivered at 12:30 PM'
  },
  {
    id: 'ORD-809',
    customerName: 'Neha Patel',
    pickupAddress: 'Whitefield Main Rd',
    dropAddress: 'Brookefield EurooMart',
    distance: 5.1,
    estPayout: 85,
    codAmount: 0,
    itemsCount: 3,
    estTime: 14,
    status: 'delivered',
    note: 'Delivered at 11:45 AM'
  },
  {
    id: 'ORD-808',
    customerName: 'Alice S.',
    pickupAddress: 'Malleswaram 8th Cross',
    dropAddress: 'Rajajinagar Sector 3',
    distance: 2.9,
    estPayout: 75,
    codAmount: 320,
    itemsCount: 1,
    estTime: 8,
    status: 'delivered',
    note: 'Delivered at 11:00 AM'
  },
  {
    id: 'ORD-807',
    customerName: 'Vikram Singh',
    pickupAddress: 'Indiranagar (EurooMart Hub)',
    dropAddress: 'Domlur Stage 2',
    distance: 1.8,
    estPayout: 50,
    codAmount: 150,
    itemsCount: 2,
    estTime: 9,
    status: 'delivered',
    note: 'Delivered at 10:15 AM'
  },
  {
    id: 'ORD-806',
    customerName: 'Priya Nair',
    pickupAddress: 'Koramangala 3rd Block',
    dropAddress: 'HSR Sector 2',
    distance: 5.5,
    estPayout: 90,
    codAmount: 0,
    itemsCount: 5,
    estTime: 18,
    status: 'delivered',
    note: 'Delivered at 09:45 AM'
  },
  {
    id: 'ORD-805',
    customerName: 'Amit Verma',
    pickupAddress: 'EurooMart Central Hub',
    dropAddress: 'Halasuru Metro Stn',
    distance: 3.2,
    estPayout: 65,
    codAmount: 280,
    itemsCount: 2,
    estTime: 11,
    status: 'delivered',
    note: 'Delivered at 09:00 AM'
  },
  {
    id: 'ORD-804',
    customerName: 'Sanjay Dutt',
    pickupAddress: 'Jayanagar 4th Block',
    dropAddress: 'JP Nagar Phase 2',
    distance: 4.0,
    estPayout: 80,
    codAmount: 0,
    itemsCount: 3,
    estTime: 13,
    status: 'delivered',
    note: 'Delivered at 08:30 AM'
  },
  {
    id: 'ORD-803',
    customerName: 'Riya Sen',
    pickupAddress: 'Richmond Town',
    dropAddress: 'MG Road Metro',
    distance: 2.7,
    estPayout: 70,
    codAmount: 420,
    itemsCount: 1,
    estTime: 9,
    status: 'delivered',
    note: 'Delivered at 08:00 AM'
  },
  {
    id: 'ORD-802',
    customerName: 'Rohan Roy',
    pickupAddress: 'Indiranagar (EurooMart Hub)',
    dropAddress: 'Ulsoor Lake',
    distance: 2.1,
    estPayout: 55,
    codAmount: 180,
    itemsCount: 1,
    estTime: 7,
    status: 'delivered',
    note: 'Delivered at 07:30 AM'
  },
  {
    id: 'ORD-801',
    customerName: 'Gaurav K.',
    pickupAddress: 'Koramangala 1st Block',
    dropAddress: 'Ejipura Signal',
    distance: 2.5,
    estPayout: 60,
    codAmount: 0,
    itemsCount: 2,
    estTime: 8,
    status: 'delivered',
    note: 'Delivered at 07:00 AM'
  }
];

const initialRiderProfile: RiderProfile = {
  id: 'R-8088',
  name: 'Vikram Singh',
  email: 'rider@euromart.com',
  avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY0P7NKiglTLw4dzxBgDcIosrtxAcAXC7IpwKyPDEN5XT9F_wQ5c0PzgT7fv7G_RoxXs7_UB37PCR_LBfqye8cBObUVm8mGhYcI9-KiS7pO3gDlcHkr9jh1NL4jH5jgNSgLtifSaYzITNGWHgFqv5SMeh_rMLts_64FBlCCf4jIGg6j71jx6JeqWKqI24N0D0o-zXYKqjYBLl1R66wvASqclsIrnxyUUC2cixTxpAMI9xEXIP06KBt',
  vehicle_type: 'Motorcycle',
  vehicle_model: 'Honda Activa 6G',
  vehicle_number: 'KA-03-HA-1234',
  status: 'Active',
  cod_wallet: 3240,
  today_deliveries: 12,
  today_earnings: 845,
  rating: 4.95,
  acceptance_rate: 98.5,
  weekly_online_hours: '34h 15m',
  driving_license_verified: true,
  aadhaar_verified: true,
  insurance_active: true
};

const mapDbOrderToFrontend = (dbOrder: any): Order => {
  return {
    id: dbOrder.id,
    customerName: dbOrder.customer_name,
    pickupAddress: dbOrder.pickup_address,
    dropAddress: dbOrder.drop_address,
    distance: Number(dbOrder.distance),
    estPayout: Number(dbOrder.est_payout),
    codAmount: Number(dbOrder.cod_amount),
    itemsCount: dbOrder.items_count,
    estTime: dbOrder.est_time,
    note: dbOrder.note || undefined,
    status: dbOrder.status === 'Assigning' || dbOrder.status === 'Pending' ? 'pending' : dbOrder.status,
  };
};

const mapDbTransactionToFrontend = (dbTx: any): Transaction => {
  const timeStr = dbTx.created_at 
    ? new Date(dbTx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Just now';
  const dateStr = dbTx.created_at
    ? new Date(dbTx.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })
    : 'Today';
  
  return {
    id: dbTx.id,
    type: dbTx.type as 'cod_collected' | 'hub_submission',
    orderId: dbTx.order_id || undefined,
    details: dbTx.details,
    time: `${dateStr}, ${timeStr}`,
    amount: Number(dbTx.amount),
  };
};

export default function App() {
  const [currentRiderId, setCurrentRiderId] = useState<string | null>(() => {
    return localStorage.getItem('rider_id');
  });
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [todayEarnings, setTodayEarnings] = useState<number>(845);
  const [completedDeliveries, setCompletedDeliveries] = useState<number>(12);
  const [completedOrders, setCompletedOrders] = useState<Order[]>(initialCompletedOrders);
  const [cashInHand, setCashInHand] = useState<number>(3240);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dashboard');
  
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);
  const [riderProfile, setRiderProfile] = useState<RiderProfile>(initialRiderProfile);
  const [rejectedOrderIds, setRejectedOrderIds] = useState<string[]>([]);

  // Hardcoded initial transactions matching the screens
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'tx-1',
      type: 'cod_collected',
      details: 'COD Collected - #ORD-892',
      time: 'Today, 2:45 PM',
      amount: 450,
    },
    {
      id: 'tx-2',
      type: 'cod_collected',
      details: 'COD Collected - #ORD-887',
      time: 'Today, 1:15 PM',
      amount: 1200,
    },
    {
      id: 'tx-3',
      type: 'hub_submission',
      details: 'Hub Submission - North Zone',
      time: 'Yesterday, 6:30 PM',
      amount: -4500,
    },
    {
      id: 'tx-4',
      type: 'cod_collected',
      details: 'COD Collected - #ORD-850',
      time: 'Yesterday, 4:10 PM',
      amount: 890,
    },
  ]);

  const fetchLatestOrders = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    if (!currentRiderId) return;
    try {
      // 1. Fetch active order
      const { data: activeData, error: activeErr } = await supabase
        .from('orders')
        .select('*')
        .eq('rider_id', currentRiderId)
        .in('status', ['accepted', 'arrived_at_pickup', 'picked_up'])
        .maybeSingle();

      if (activeErr) console.error("Error fetching active order:", activeErr);
      else if (activeData) {
        const order = mapDbOrderToFrontend(activeData);
        setActiveOrder(order);
        setPendingOrder(null);
        if (order.status === 'accepted') setCurrentScreen('navigation');
        else if (order.status === 'arrived_at_pickup') setCurrentScreen('pickup_verification');
        else if (order.status === 'picked_up') setCurrentScreen('final_step');
      } else {
        // Only fetch pending orders if no active order is in progress
        const { data: pendingData, error: pendingErr } = await supabase
          .from('orders')
          .select('*')
          .in('status', ['Assigning', 'Pending'])
          .is('rider_id', null)
          .order('created_at', { ascending: false });

        if (pendingErr) console.error("Error fetching pending order:", pendingErr);
        else if (pendingData) {
          const available = pendingData
            .map(mapDbOrderToFrontend)
            .filter((o) => !rejectedOrderIds.includes(o.id));
          if (available.length > 0) {
            setPendingOrder(available[0]);
          } else {
            setPendingOrder(null);
          }
        }
      }

      // 2. Fetch completed orders
      const { data: completedData, error: completedErr } = await supabase
        .from('orders')
        .select('*')
        .eq('rider_id', currentRiderId)
        .eq('status', 'delivered')
        .order('created_at', { ascending: false });

      if (completedErr) console.error("Error fetching completed orders:", completedErr);
      else if (completedData) {
        setCompletedOrders(completedData.map(mapDbOrderToFrontend));
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  }, [rejectedOrderIds, currentRiderId]);

  const fetchRiderProfileAndTransactions = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    if (!currentRiderId) return;
    try {
      // 1. Fetch profile
      const { data: profileData, error: profileErr } = await supabase
        .from('riders')
        .select('*')
        .eq('id', currentRiderId)
        .maybeSingle();

      if (profileErr) {
        console.error("Error fetching profile:", profileErr);
      } else if (profileData) {
        setRiderProfile(profileData as RiderProfile);
        setTodayEarnings(Number(profileData.today_earnings));
        setCompletedDeliveries(profileData.today_deliveries);
        setCashInHand(Number(profileData.cod_wallet));
        setIsOnline(profileData.status === 'Active');
      }

      // 2. Fetch transactions
      const { data: txData, error: txErr } = await supabase
        .from('rider_transactions')
        .select('*')
        .eq('rider_id', currentRiderId)
        .order('created_at', { ascending: false });

      if (txErr) {
        console.error("Error fetching transactions:", txErr);
      } else if (txData) {
        setTransactions(txData.map(mapDbTransactionToFrontend));
      }
    } catch (err) {
      console.error("Error fetching rider profile & transactions:", err);
    }
  }, [currentRiderId]);

  // Supabase initial load and realtime subscription
  useEffect(() => {
    if (isSupabaseConfigured && currentRiderId) {
      fetchRiderProfileAndTransactions();
      fetchLatestOrders();

      const dbChannel = supabase
        .channel('db-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'orders' },
          () => {
            fetchLatestOrders();
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'riders', filter: `id=eq.${currentRiderId}` },
          () => {
            fetchRiderProfileAndTransactions();
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'rider_transactions', filter: `rider_id=eq.${currentRiderId}` },
          () => {
            fetchRiderProfileAndTransactions();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(dbChannel);
      };
    }
  }, [fetchRiderProfileAndTransactions, fetchLatestOrders, currentRiderId]);

  // Mock mode sync effect
  useEffect(() => {
    if (!isSupabaseConfigured && currentRiderId) {
      setRiderProfile((prev) => ({
        ...prev,
        id: currentRiderId,
      }));
    }
  }, [currentRiderId]);

  // Generate initial pending order when online (Local Mock fallback loop)
  useEffect(() => {
    if (isSupabaseConfigured) return;
    if (isOnline && !activeOrder && !pendingOrder) {
      const timer = setTimeout(() => {
        setPendingOrder({
          id: 'ORD-8921',
          customerName: 'Rahul Sharma',
          pickupAddress: 'Indiranagar (EurooMart Hub)',
          dropAddress: 'Koramangala 4th Block',
          distance: 4.2,
          estPayout: 65,
          codAmount: 450,
          itemsCount: 3,
          estTime: 12,
          note: 'Note: Please call upon arrival, doorbell is broken.',
          status: 'pending'
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, activeOrder, pendingOrder]);

  const handleToggleOnline = useCallback(async (online: boolean) => {
    setIsOnline(online);
    if (isSupabaseConfigured && currentRiderId) {
      try {
        const { error } = await supabase
          .from('riders')
          .update({ status: online ? 'Active' : 'Offline' })
          .eq('id', currentRiderId);
        if (error) console.error("Error updating online status in Supabase:", error);
      } catch (err) {
        console.error("Failed to update status in Supabase:", err);
      }
    }
  }, [currentRiderId]);

  const handleAcceptOrder = useCallback(async (order: Order) => {
    const accepted: Order = {
      ...order,
      status: 'accepted',
    };
    setActiveOrder(accepted);
    setPendingOrder(null);
    setCurrentScreen('navigation');

    if (isSupabaseConfigured && currentRiderId) {
      try {
        const { error } = await supabase
          .from('orders')
          .update({
            status: 'accepted',
            rider_id: currentRiderId,
            rider_name: riderProfile.name,
            rider_avatar: riderProfile.avatar_url,
          })
          .eq('id', order.id);
        if (error) console.error("Error accepting order in Supabase:", error);
      } catch (err) {
        console.error("Failed to accept order in Supabase:", err);
      }
    }
  }, [riderProfile, currentRiderId]);

  const handleRejectOrder = useCallback(async () => {
    const currentPending = pendingOrder;
    setPendingOrder(null);

    if (currentPending) {
      setRejectedOrderIds((prev) => [...prev, currentPending.id]);
    }

    if (!isSupabaseConfigured) {
      setTimeout(() => {
        setPendingOrder(generateNewOrder());
      }, 5000);
    }
  }, [pendingOrder]);

  const handleArrivedAtPickup = useCallback(async () => {
    if (activeOrder) {
      const updated: Order = {
        ...activeOrder,
        status: 'arrived_at_pickup',
      };
      setActiveOrder(updated);
      setCurrentScreen('pickup_verification');

      if (isSupabaseConfigured) {
        try {
          const { error } = await supabase
            .from('orders')
            .update({ status: 'arrived_at_pickup' })
            .eq('id', activeOrder.id);
          if (error) console.error("Error updating order arrived status in Supabase:", error);
        } catch (err) {
          console.error("Failed to update status in Supabase:", err);
        }
      }
    }
  }, [activeOrder]);

  const handleConfirmPickup = useCallback(async () => {
    if (activeOrder) {
      const updated: Order = {
        ...activeOrder,
        status: 'picked_up',
      };
      setActiveOrder(updated);
      setCurrentScreen('final_step');

      if (isSupabaseConfigured) {
        try {
          const { error } = await supabase
            .from('orders')
            .update({ status: 'picked_up' })
            .eq('id', activeOrder.id);
          if (error) console.error("Error updating order picked up status in Supabase:", error);
        } catch (err) {
          console.error("Failed to update status in Supabase:", err);
        }
      }
    }
  }, [activeOrder]);

  const handleCompleteDelivery = useCallback(async () => {
    if (activeOrder) {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const completedOrder: Order = {
        ...activeOrder,
        status: 'delivered' as const,
        note: `Delivered at ${timeStr}`
      };
      
      const newEarnings = todayEarnings + completedOrder.estPayout;
      const newDeliveries = completedDeliveries + 1;
      const hasCod = completedOrder.codAmount > 0;
      const newCodWallet = cashInHand + (hasCod ? completedOrder.codAmount : 0);

      setTodayEarnings(newEarnings);
      setCompletedDeliveries(newDeliveries);
      setCompletedOrders((prev) => [completedOrder, ...prev]);
      if (hasCod) {
        setCashInHand(newCodWallet);
      }

      const txId = 'tx-' + Date.now();
      const newTx: Transaction = {
        id: txId,
        type: 'cod_collected',
        orderId: completedOrder.id,
        details: `COD Collected - #ORD-${completedOrder.id.split('-')[0]}`,
        time: `Today, ${timeStr}`,
        amount: completedOrder.codAmount,
      };

      if (hasCod) {
        setTransactions((prev) => [newTx, ...prev]);
      }

      setActiveOrder(null);
      setCurrentScreen('dashboard');

      if (isSupabaseConfigured && currentRiderId) {
        try {
          const { error: orderErr } = await supabase
            .from('orders')
            .update({
              status: 'delivered',
              note: `Delivered at ${timeStr}`
            })
            .eq('id', completedOrder.id);
          if (orderErr) console.error("Error completing order in Supabase:", orderErr);

          const { error: riderErr } = await supabase
            .from('riders')
            .update({
              today_earnings: newEarnings,
              today_deliveries: newDeliveries,
              cod_wallet: newCodWallet,
            })
            .eq('id', currentRiderId);
          if (riderErr) console.error("Error updating rider stats in Supabase:", riderErr);

          if (hasCod) {
            const { error: txErr } = await supabase
              .from('rider_transactions')
              .insert({
                id: txId,
                rider_id: currentRiderId,
                type: 'cod_collected',
                order_id: completedOrder.id,
                details: `COD Collected - #ORD-${completedOrder.id.split('-')[0]}`,
                amount: completedOrder.codAmount,
              });
            if (txErr) console.error("Error inserting transaction in Supabase:", txErr);
          }
        } catch (err) {
          console.error("Failed to complete delivery in Supabase:", err);
        }
      } else {
        setTimeout(() => {
          setPendingOrder(generateNewOrder());
        }, 8000);
      }
    }
  }, [activeOrder, todayEarnings, completedDeliveries, cashInHand, currentRiderId]);

  const handleClearCash = useCallback(async () => {
    if (cashInHand > 0) {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const txId = 'tx-' + Date.now();
      const amountToClear = cashInHand;
      const newTx: Transaction = {
        id: txId,
        type: 'hub_submission',
        details: 'Hub Submission - North Zone',
        time: `Today, ${timeStr}`,
        amount: -amountToClear,
      };
      setTransactions((prev) => [newTx, ...prev]);
      setCashInHand(0);

      if (isSupabaseConfigured && currentRiderId) {
        try {
          const { error: riderErr } = await supabase
            .from('riders')
            .update({ cod_wallet: 0 })
            .eq('id', currentRiderId);
          if (riderErr) console.error("Error clearing rider wallet in Supabase:", riderErr);

          const { error: txErr } = await supabase
            .from('rider_transactions')
            .insert({
              id: txId,
              rider_id: currentRiderId,
              type: 'hub_submission',
              details: 'Hub Submission - North Zone',
              amount: -amountToClear,
            });
          if (txErr) console.error("Error inserting submission transaction in Supabase:", txErr);
        } catch (err) {
          console.error("Failed to clear cash in Supabase:", err);
        }
      }
    }
  }, [cashInHand, currentRiderId]);

  const handleLogout = useCallback(async () => {
    if (isSupabaseConfigured && currentRiderId) {
      try {
        await supabase
          .from('riders')
          .update({ status: 'Offline' })
          .eq('id', currentRiderId);
      } catch (err) {
        console.error("Error setting rider offline on logout:", err);
      }
    }
    localStorage.removeItem('rider_id');
    setCurrentRiderId(null);
    setIsOnline(false);
    setCurrentScreen('dashboard');
  }, [currentRiderId]);

  if (!currentRiderId) {
    return (
      <LoginScreen
        onLogin={(id, profile) => {
          localStorage.setItem('rider_id', id);
          setCurrentRiderId(id);
          if (profile) {
            setRiderProfile(profile);
            setTodayEarnings(Number(profile.today_earnings));
            setCompletedDeliveries(profile.today_deliveries);
            setCashInHand(Number(profile.cod_wallet));
            setIsOnline(profile.status === 'Active');
          } else {
            setRiderProfile({
              ...initialRiderProfile,
              id: id,
            });
            setTodayEarnings(initialRiderProfile.today_earnings);
            setCompletedDeliveries(initialRiderProfile.today_deliveries);
            setCashInHand(initialRiderProfile.cod_wallet);
            setIsOnline(initialRiderProfile.status === 'Active');
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col items-center justify-start select-none">
      <div className="w-full max-w-md bg-[#f8f9ff] min-h-screen relative shadow-2xl flex flex-col border-x border-gray-100 overflow-x-hidden">
        {/* Render Active Screen Content */}
        {currentScreen === 'dashboard' && (
          <Dashboard
            isOnline={isOnline}
            setIsOnline={handleToggleOnline}
            todayEarnings={todayEarnings}
            completedDeliveries={completedDeliveries}
            pendingOrder={pendingOrder}
            onAcceptOrder={handleAcceptOrder}
            onRejectOrder={handleRejectOrder}
            onNavigateToWallet={() => setCurrentScreen('wallet')}
            onNavigateToEarnings={() => setCurrentScreen('earnings')}
          />
        )}

        {currentScreen === 'earnings' && (
          <EarningsScreen
            todayEarnings={todayEarnings}
            completedOrders={completedOrders}
            onBack={() => setCurrentScreen('dashboard')}
          />
        )}

        {currentScreen === 'navigation' && activeOrder && (
          <NavigationScreen
            order={activeOrder}
            onBack={() => setCurrentScreen('dashboard')}
            onArrivedAtPickup={handleArrivedAtPickup}
          />
        )}

        {currentScreen === 'pickup_verification' && activeOrder && (
          <PickupVerification
            order={activeOrder}
            onBack={() => setCurrentScreen('navigation')}
            onConfirmPickup={handleConfirmPickup}
          />
        )}

        {currentScreen === 'final_step' && activeOrder && (
          <FinalStep
            order={activeOrder}
            onBack={() => setCurrentScreen('pickup_verification')}
            onCompleteDelivery={handleCompleteDelivery}
          />
        )}

        {currentScreen === 'wallet' && (
          <WalletScreen
            cashInHand={cashInHand}
            transactions={transactions}
            onBack={() => setCurrentScreen('dashboard')}
            onClearCash={handleClearCash}
          />
        )}

        {currentScreen === 'profile' && (
          <ProfileScreen
            riderProfile={riderProfile}
            onBack={() => setCurrentScreen('dashboard')}
            onLogout={handleLogout}
          />
        )}

        {/* Persistent Bottom Nav Bar (Mobile Metaphor) */}
        {currentScreen !== 'pickup_verification' && (
          <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 h-18 px-6 z-40 flex justify-around items-center rounded-t-2xl shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
            {/* Orders Tab */}
            <button 
              onClick={() => setCurrentScreen('dashboard')}
              className="flex flex-col items-center justify-center relative cursor-pointer group"
            >
              {currentScreen === 'dashboard' ? (
                <div className="bg-orange-500 text-[#5c2400] rounded-full px-5 py-1.5 flex flex-col items-center justify-center transition-all">
                  <span className="material-symbols-outlined text-[20px] fill-1">local_shipping</span>
                  <span className="text-[10px] font-bold mt-0.5">Orders</span>
                </div>
              ) : (
                <div className="flex flex-col items-center py-1.5 text-gray-400 group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                  <span className="text-[10px] font-semibold mt-0.5">Orders</span>
                </div>
              )}
            </button>

            {/* Navigation Tab */}
            <button 
              onClick={() => {
                if (activeOrder) {
                  if (activeOrder.status === 'accepted' || activeOrder.status === 'arrived_at_pickup') {
                    setCurrentScreen('navigation');
                  } else if (activeOrder.status === 'picked_up') {
                    setCurrentScreen('final_step');
                  }
                }
              }}
              disabled={!activeOrder}
              className={`flex flex-col items-center justify-center relative ${!activeOrder ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer group'}`}
            >
              {currentScreen === 'navigation' ? (
                <div className="bg-orange-500 text-[#5c2400] rounded-full px-5 py-1.5 flex flex-col items-center justify-center transition-all">
                  <span className="material-symbols-outlined text-[20px] fill-1">directions_run</span>
                  <span className="text-[10px] font-bold mt-0.5">Navigation</span>
                </div>
              ) : (
                <div className="flex flex-col items-center py-1.5 text-gray-400 group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">directions_run</span>
                  <span className="text-[10px] font-semibold mt-0.5">Navigation</span>
                </div>
              )}
            </button>

            {/* Wallet Tab */}
            <button 
              onClick={() => setCurrentScreen('wallet')}
              className="flex flex-col items-center justify-center relative cursor-pointer group"
            >
              {currentScreen === 'wallet' ? (
                <div className="bg-orange-500 text-[#5c2400] rounded-full px-5 py-1.5 flex flex-col items-center justify-center transition-all">
                  <span className="material-symbols-outlined text-[20px] fill-1">account_balance_wallet</span>
                  <span className="text-[10px] font-bold mt-0.5">Wallet</span>
                </div>
              ) : (
                <div className="flex flex-col items-center py-1.5 text-gray-400 group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                  <span className="text-[10px] font-semibold mt-0.5">Wallet</span>
                </div>
              )}
            </button>

            {/* Profile Tab */}
            <button 
              onClick={() => setCurrentScreen('profile')}
              className="flex flex-col items-center justify-center relative cursor-pointer group"
            >
              {currentScreen === 'profile' ? (
                <div className="bg-orange-500 text-[#5c2400] rounded-full px-5 py-1.5 flex flex-col items-center justify-center transition-all">
                  <span className="material-symbols-outlined text-[20px] fill-1">person</span>
                  <span className="text-[10px] font-bold mt-0.5">Profile</span>
                </div>
              ) : (
                <div className="flex flex-col items-center py-1.5 text-gray-400 group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                  <span className="text-[10px] font-semibold mt-0.5">Profile</span>
                </div>
              )}
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
