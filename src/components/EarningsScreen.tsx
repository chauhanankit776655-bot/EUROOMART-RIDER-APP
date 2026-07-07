import React from 'react';
import { Order } from '../types';

interface EarningsScreenProps {
  todayEarnings: number;
  completedOrders: Order[];
  onBack: () => void;
}

export default function EarningsScreen({
  todayEarnings,
  completedOrders,
  onBack,
}: EarningsScreenProps) {
  // Calculate breakdown proportions (ensuring they sum up to exactly todayEarnings)
  const baseFare = Math.round(todayEarnings * 0.75);
  const distancePay = Math.round(todayEarnings * 0.15);
  const tips = Math.round(todayEarnings * 0.06);
  const incentives = todayEarnings - baseFare - distancePay - tips;

  // Calculate stats
  const totalDistance = completedOrders.reduce((sum, order) => sum + order.distance, 0);
  const totalOrders = completedOrders.length;
  const avgEarnings = totalOrders > 0 ? Math.round(todayEarnings / totalOrders) : 0;

  return (
    <div className="flex flex-col w-full pb-28 relative min-h-screen">
      {/* Top App Bar */}
      <header className="bg-white shadow-xs fixed top-0 left-0 right-0 h-14 z-40 flex items-center justify-between px-4 max-w-md mx-auto border-b border-gray-100">
        <button 
          onClick={onBack}
          className="text-gray-600 hover:bg-gray-100 p-2 rounded-full flex items-center justify-center transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <span className="text-base font-extrabold text-[#0b1c30]">Today's Earnings</span>
        <button className="text-gray-500 hover:bg-gray-100 transition-colors p-2 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-[24px]">info</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-18 px-4 flex flex-col gap-6 w-full max-w-md mx-auto bg-[#f8f9ff]">
        {/* Earnings Card */}
        <section className="bg-primary text-white rounded-3xl p-5 shadow-md flex flex-col items-center text-center relative overflow-hidden group">
          {/* Decorative blurs */}
          <div className="absolute -right-8 -top-8 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-300"></div>
          <div className="absolute -left-8 -bottom-8 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-300"></div>

          <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest mb-1.5">Total Today</span>
          <h1 className="text-4xl font-black tracking-tight mb-2">₹{todayEarnings.toLocaleString()}</h1>
          
          <div className="flex items-center gap-1.5 bg-green-500/20 border border-green-400/35 px-3 py-1 rounded-full text-green-200">
            <span className="material-symbols-outlined text-sm animate-pulse">check_circle</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider">Payout Finalized</span>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-3 gap-2">
          <div className="bg-white border border-gray-100 rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-3xs">
            <span className="material-symbols-outlined text-primary text-[20px] mb-1">local_shipping</span>
            <span className="text-[10px] text-gray-400 font-medium">Deliveries</span>
            <span className="text-sm font-black text-gray-800 mt-0.5">{totalOrders}</span>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-3xs">
            <span className="material-symbols-outlined text-green-600 text-[20px] mb-1">distance</span>
            <span className="text-[10px] text-gray-400 font-medium">Distance</span>
            <span className="text-sm font-black text-gray-800 mt-0.5">{totalDistance.toFixed(1)} km</span>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-3xs">
            <span className="material-symbols-outlined text-secondary text-[20px] mb-1">equalizer</span>
            <span className="text-[10px] text-gray-400 font-medium">Avg / Order</span>
            <span className="text-sm font-black text-gray-800 mt-0.5">₹{avgEarnings}</span>
          </div>
        </section>

        {/* Earnings Breakdown */}
        <section className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs flex flex-col gap-3">
          <h2 className="text-sm font-extrabold text-[#0b1c30] mb-1">Fare Breakdown</h2>
          
          <div className="flex flex-col gap-2.5">
            {/* Base Fare Row */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-primary"></span>
                  Base Fare
                </span>
                <span className="font-bold text-gray-800">₹{baseFare}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${(baseFare / todayEarnings) * 100}%` }}></div>
              </div>
            </div>

            {/* Distance Pay Row */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-green-500"></span>
                  Distance Pay
                </span>
                <span className="font-bold text-gray-800">₹{distancePay}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${(distancePay / todayEarnings) * 100}%` }}></div>
              </div>
            </div>

            {/* Tips Row */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-secondary"></span>
                  Customer Tips
                </span>
                <span className="font-bold text-gray-800">₹{tips}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-secondary" style={{ width: `${(tips / todayEarnings) * 100}%` }}></div>
              </div>
            </div>

            {/* Incentives Row */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-orange-400"></span>
                  Incentives & Bonuses
                </span>
                <span className="font-bold text-gray-800">₹{incentives}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-400" style={{ width: `${(incentives / todayEarnings) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Completed Deliveries History */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-extrabold text-[#0b1c30]">Today's Deliveries</h2>
          
          <div className="flex flex-col gap-3">
            {completedOrders.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center text-gray-400 flex flex-col items-center">
                <span className="material-symbols-outlined text-4xl mb-1 text-gray-300">history</span>
                <span className="text-xs">No orders completed today yet.</span>
              </div>
            ) : (
              completedOrders.map((order, index) => {
                const deliveryTime = order.note?.replace('Delivered at ', '') || 'Today';
                return (
                  <div 
                    key={order.id + '-' + index}
                    className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs hover:shadow-2xs active:scale-[0.99] transition-all flex flex-col gap-3"
                  >
                    {/* Header Row */}
                    <div className="flex items-center justify-between border-b border-gray-55 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-50 text-primary text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                          #{order.id}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {deliveryTime}
                        </span>
                      </div>
                      <span className="text-sm font-extrabold text-green-600">
                        +₹{order.estPayout}
                      </span>
                    </div>

                    {/* Address snippet */}
                    <div className="relative pl-5 before:absolute before:left-[5px] before:top-1.5 before:bottom-1.5 before:w-[1px] before:bg-gray-200 flex flex-col gap-2 text-xs">
                      <div className="relative">
                        <div className="absolute left-[-22px] top-1 w-2.5 h-2.5 rounded-full border border-primary bg-white"></div>
                        <p className="text-gray-400 text-[10px]">Pickup</p>
                        <p className="font-semibold text-gray-700 truncate max-w-[280px]">{order.pickupAddress}</p>
                      </div>
                      <div className="relative">
                        <div className="absolute left-[-22px] top-1 w-2.5 h-2.5 rounded-full bg-secondary"></div>
                        <p className="text-gray-400 text-[10px]">Drop</p>
                        <p className="font-semibold text-gray-700 truncate max-w-[280px]">{order.dropAddress}</p>
                      </div>
                    </div>

                    {/* Footer Stats */}
                    <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">distance</span>
                        {order.distance} km
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">schedule</span>
                        {order.estTime} mins
                      </span>
                      <span className="flex items-center gap-1 text-green-600 font-medium">
                        <span className="material-symbols-outlined text-xs">check_circle</span>
                        Completed
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
