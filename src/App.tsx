import React, { useState, useEffect, useCallback } from 'react';
import { Order, Transaction, ScreenType } from './types';
import Dashboard from './components/Dashboard';
import NavigationScreen from './components/NavigationScreen';
import PickupVerification from './components/PickupVerification';
import FinalStep from './components/FinalStep';
import WalletScreen from './components/WalletScreen';
import ProfileScreen from './components/ProfileScreen';
import EarningsScreen from './components/EarningsScreen';

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

export default function App() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [todayEarnings, setTodayEarnings] = useState<number>(845);
  const [completedDeliveries, setCompletedDeliveries] = useState<number>(12);
  const [completedOrders, setCompletedOrders] = useState<Order[]>(initialCompletedOrders);
  const [cashInHand, setCashInHand] = useState<number>(3240);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dashboard');
  
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);

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

  // Generate initial pending order when online
  useEffect(() => {
    if (isOnline && !activeOrder && !pendingOrder) {
      const timer = setTimeout(() => {
        // First order matches Screen 5 (Indiranagar to Koramangala 4th Block, 4.2 km, ₹65 payout)
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

  const handleAcceptOrder = useCallback((order: Order) => {
    const accepted: Order = {
      ...order,
      status: 'accepted',
    };
    setActiveOrder(accepted);
    setPendingOrder(null);
    setCurrentScreen('navigation');
  }, []);

  const handleRejectOrder = useCallback(() => {
    setPendingOrder(null);
    // Wait 5 seconds and generate another fresh order request
    setTimeout(() => {
      setPendingOrder(generateNewOrder());
    }, 5000);
  }, []);

  const handleArrivedAtPickup = useCallback(() => {
    if (activeOrder) {
      setActiveOrder({
        ...activeOrder,
        status: 'arrived_at_pickup',
      });
      setCurrentScreen('pickup_verification');
    }
  }, [activeOrder]);

  const handleConfirmPickup = useCallback(() => {
    if (activeOrder) {
      setActiveOrder({
        ...activeOrder,
        status: 'picked_up',
      });
      setCurrentScreen('final_step');
    }
  }, [activeOrder]);

  const handleCompleteDelivery = useCallback(() => {
    if (activeOrder) {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const completedOrder: Order = {
        ...activeOrder,
        status: 'delivered' as const,
        note: `Delivered at ${timeStr}`
      };
      
      // Update statistics
      setTodayEarnings((prev) => prev + completedOrder.estPayout);
      setCompletedDeliveries((prev) => prev + 1);
      setCompletedOrders((prev) => [completedOrder, ...prev]);
      
      if (completedOrder.codAmount > 0) {
        setCashInHand((prev) => prev + completedOrder.codAmount);
        
        // Add transaction
        const newTx: Transaction = {
          id: 'tx-' + Date.now(),
          type: 'cod_collected',
          orderId: completedOrder.id,
          details: `COD Collected - #ORD-${completedOrder.id.split('-')[0]}`,
          time: `Today, ${timeStr}`,
          amount: completedOrder.codAmount,
        };
        setTransactions((prev) => [newTx, ...prev]);
      }

      setActiveOrder(null);
      setCurrentScreen('dashboard');

      // Schedule a new order dispatch in 8 seconds
      setTimeout(() => {
        setPendingOrder(generateNewOrder());
      }, 8000);
    }
  }, [activeOrder]);

  const handleClearCash = useCallback(() => {
    if (cashInHand > 0) {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newTx: Transaction = {
        id: 'tx-' + Date.now(),
        type: 'hub_submission',
        details: 'Hub Submission - North Zone',
        time: `Today, ${timeStr}`,
        amount: -cashInHand,
      };
      setTransactions((prev) => [newTx, ...prev]);
      setCashInHand(0);
    }
  }, [cashInHand]);

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col items-center justify-start select-none">
      <div className="w-full max-w-md bg-[#f8f9ff] min-h-screen relative shadow-2xl flex flex-col border-x border-gray-100 overflow-x-hidden">
        {/* Render Active Screen Content */}
        {currentScreen === 'dashboard' && (
          <Dashboard
            isOnline={isOnline}
            setIsOnline={setIsOnline}
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
            onBack={() => setCurrentScreen('dashboard')}
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
