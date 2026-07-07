import React, { useState, useEffect } from 'react';
import { Order } from '../types';

interface DashboardProps {
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  todayEarnings: number;
  completedDeliveries: number;
  pendingOrder: Order | null;
  onAcceptOrder: (order: Order) => void;
  onRejectOrder: () => void;
  onNavigateToWallet: () => void;
  onNavigateToEarnings: () => void;
}

export default function Dashboard({
  isOnline,
  setIsOnline,
  todayEarnings,
  completedDeliveries,
  pendingOrder,
  onAcceptOrder,
  onRejectOrder,
  onNavigateToWallet,
  onNavigateToEarnings,
}: DashboardProps) {
  const [countdown, setCountdown] = useState(45);

  // Real countdown timer for the order request card
  useEffect(() => {
    if (!pendingOrder || !isOnline) {
      setCountdown(45);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [pendingOrder, isOnline]);

  // Handle countdown completion side-effect safely
  useEffect(() => {
    if (countdown === 0 && pendingOrder && isOnline) {
      onRejectOrder();
      setCountdown(45);
    }
  }, [countdown, pendingOrder, isOnline, onRejectOrder]);

  // Reset countdown if order changes
  useEffect(() => {
    setCountdown(45);
  }, [pendingOrder]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col w-full pb-28">
      {/* Top App Bar */}
      <header className="bg-white shadow-xs fixed top-0 left-0 right-0 h-14 z-40 flex items-center justify-between px-4 max-w-md mx-auto border-b border-gray-100">
        <button className="text-primary hover:bg-gray-100 transition-colors p-2 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>
        <h1 className="text-xl font-bold text-primary tracking-tight">EurooMart Rider</h1>
        <button 
          onClick={onNavigateToWallet}
          className="text-gray-500 hover:text-primary hover:bg-gray-100 transition-colors p-2 rounded-full flex items-center justify-center relative"
        >
          <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full"></span>
        </button>
      </header>

      {/* Main Content (padded for top bar) */}
      <main className="px-4 pt-18 flex flex-col gap-6 w-full max-w-md mx-auto">
        {/* Duty Status Card */}
        <section className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between border border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-[#0b1c30]">Duty Status</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {isOnline ? 'You are currently receiving orders.' : 'You are currently offline.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-semibold transition-colors ${isOnline ? 'text-green-600' : 'text-gray-400'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
            {/* Custom Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={isOnline} 
                onChange={(e) => setIsOnline(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
        </section>

        {/* Summary Card Bento Grid */}
        <section className="grid grid-cols-2 gap-3">
          {/* Today's Earnings */}
          <div 
            onClick={onNavigateToEarnings}
            className="bg-primary rounded-2xl shadow-sm p-4 text-white flex flex-col justify-between min-h-[110px] relative overflow-hidden group hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 cursor-pointer hover:shadow-md"
          >
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-center gap-2 opacity-95 mb-2">
              <span className="material-symbols-outlined text-[20px] text-green-300">payments</span>
              <span className="text-xs font-semibold uppercase tracking-wider">Today's Earnings</span>
            </div>
            <div>
              <div className="text-3xl font-bold tracking-tight">₹{todayEarnings}</div>
              <div className="flex items-center justify-between text-[10px] text-white/70 mt-1">
                <span>Payout finalized</span>
                <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </div>
          </div>

          {/* Completed Deliveries */}
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 flex flex-col justify-between min-h-[110px] hover:scale-[1.02] transition-transform duration-200">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <span className="material-symbols-outlined text-[20px] text-green-600">check_circle</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Completed</span>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary tracking-tight">{completedDeliveries}</div>
              <span className="text-[10px] text-green-600 font-medium">100% success rate</span>
            </div>
          </div>
        </section>

        {/* Map Overview */}
        <section className="relative w-full h-[240px] rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50">
          <img 
            alt="Map Route" 
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNTndIyN_zjNbfCUuBht1D0chsFlCkoai2ahEooan4CL79kym51fPAn26EMX4WCaDVWCz67W1aeNQy7ZsJXR1LUgr861jImNZaNLr9uwocG67c6LGt5_z2Fl1bLJZXuaphnaLdKBgoTVD8PQjaqyaChHjSzjs7xiq7I83_2pdYy7dDlOFgScmG4LnagqC0vmYF2-gEGgNZkIeCf4cB-zypK5ODSGFbeoBoqAGEEDOh2tTJn3O46p4O" 
          />
          {/* Map Overlay UI */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 z-10 pointer-events-none"></div>
          
          <div className="absolute top-3 left-3 right-3 z-20 flex justify-between items-center">
            <div className="bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-full shadow-md flex items-center gap-2 border border-gray-100">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-xs font-semibold text-[#0b1c30]">
                {isOnline ? 'Zone A - Active' : 'Offline Mode'}
              </span>
            </div>
            <button className="bg-white hover:bg-gray-100 p-2 rounded-full shadow-md border border-gray-100 text-gray-700 transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">my_location</span>
            </button>
          </div>

          {!isOnline && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs z-30 flex flex-col items-center justify-center text-center px-6">
              <span className="material-symbols-outlined text-4xl text-white mb-2">wifi_off</span>
              <h3 className="text-white font-bold text-lg">You are Offline</h3>
              <p className="text-white/80 text-xs mt-1 max-w-[240px]">
                Toggle the switch above to start receiving delivery requests in your area.
              </p>
            </div>
          )}
        </section>

        {/* Floating New Order Request Card */}
        {isOnline && pendingOrder && (
          <section className="bg-white rounded-2xl shadow-xl border-2 border-primary/10 overflow-hidden mt-2 animate-in slide-in-from-bottom duration-300">
            {/* Attention Header */}
            <div className="bg-blue-50 px-4 py-3 flex items-center justify-between border-b border-blue-100">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-[20px] animate-bounce">notifications_active</span>
                <span className="text-sm font-bold">New Order Request</span>
              </div>
              <span className="text-xs font-bold text-white bg-primary px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <span className="material-symbols-outlined text-xs">timer</span>
                {formatTime(countdown)}
              </span>
            </div>
            
            <div className="p-4 flex flex-col gap-4">
              {/* Route Details */}
              <div className="relative pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-200 flex flex-col gap-4">
                {/* Pickup */}
                <div className="relative">
                  <div className="absolute left-[-23px] top-1 w-3 h-3 rounded-full border-2 border-primary bg-white z-10"></div>
                  <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Pickup Address</p>
                  <p className="text-sm font-semibold text-[#0b1c30] mt-0.5">{pendingOrder.pickupAddress}</p>
                </div>
                {/* Drop */}
                <div className="relative">
                  <div className="absolute left-[-23px] top-1 w-3 h-3 rounded-full bg-secondary z-10"></div>
                  <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Drop Location</p>
                  <p className="text-sm font-semibold text-[#0b1c30] mt-0.5">{pendingOrder.dropAddress}</p>
                </div>
              </div>

              {/* Meta Details Row */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-1">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Distance</span>
                  <span className="text-sm font-bold text-gray-900 mt-0.5">{pendingOrder.distance} km</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Est. Payout</span>
                  <span className="text-sm font-bold text-green-600 mt-0.5 flex items-center gap-0.5">
                    ₹{pendingOrder.estPayout.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-1">
                <button 
                  onClick={onRejectOrder}
                  className="flex-1 py-3 px-4 rounded-xl border border-red-500 text-red-500 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-red-50 transition-colors active:scale-95 duration-150"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                  Reject
                </button>
                <button 
                  onClick={() => onAcceptOrder(pendingOrder)}
                  className="flex-[2] py-3 px-4 rounded-xl bg-primary text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors shadow-md active:scale-95 duration-150"
                >
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  Accept Order
                </button>
              </div>
            </div>
          </section>
        )}

        {isOnline && !pendingOrder && (
          <div className="bg-blue-50/50 rounded-2xl p-4 text-center border border-dashed border-primary/20 flex flex-col items-center justify-center mt-2">
            <span className="material-symbols-outlined text-primary text-2xl animate-pulse mb-1">hourglass_empty</span>
            <p className="text-xs font-semibold text-primary">Waiting for incoming requests...</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Orders in Zone A are normally dispatched in 10-30 seconds.</p>
          </div>
        )}
      </main>
    </div>
  );
}
