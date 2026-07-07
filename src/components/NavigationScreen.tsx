import React, { useState } from 'react';
import { Order } from '../types';

interface NavigationScreenProps {
  order: Order;
  onBack: () => void;
  onArrivedAtPickup: () => void;
}

export default function NavigationScreen({
  order,
  onBack,
  onArrivedAtPickup,
}: NavigationScreenProps) {
  const [showCallSim, setShowCallSim] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isCalling, setIsCalling] = useState(false);

  // Simple call simulator interval
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCalling) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [isCalling]);

  const handleCallCustomer = () => {
    setShowCallSim(true);
    setIsCalling(true);
  };

  const handleEndCall = () => {
    setIsCalling(false);
    setShowCallSim(false);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col w-full pb-28 relative min-h-screen">
      {/* Top App Bar */}
      <header className="bg-white shadow-xs fixed top-0 left-0 right-0 h-14 z-40 flex items-center justify-between px-4 max-w-md mx-auto border-b border-gray-100">
        <button 
          onClick={onBack}
          className="text-gray-600 hover:bg-gray-100 p-2 rounded-full flex items-center justify-center transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <div className="bg-primary/5 px-4 py-1.5 rounded-full flex items-center gap-2 border border-primary/10">
          <span className="material-symbols-outlined text-[18px] text-primary">qr_code_scanner</span>
          <span className="text-sm font-bold text-primary tracking-tight">{order.id}</span>
        </div>
        <div className="w-10"></div> {/* Spacer for symmetry */}
      </header>

      {/* Main Container */}
      <main className="flex-grow pt-14 flex flex-col w-full max-w-md mx-auto relative bg-[#f8f9ff]">
        {/* Map View Section */}
        <section className="relative w-full h-[280px] bg-gray-100 overflow-hidden shadow-xs">
          <img 
            alt="City Grid Map" 
            className="absolute inset-0 w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNc1lcluueg7rQ5rC9bX9rbj526F_rfP1giby08IzqUmVD_Rl_9b97A5n65yfbqo5eoqwsHv6XbCnwjRbQRqBi8zkOBhGqnmvc3XG1RCci9tgeSN0xTIO6Oc2_tEZUI5uCJKDxPQwU0dD5SUC4YyaFtG_FOxs3l67G-r0k8c_QZzpYTRROTfR7BAotGu0BcfOtybIuUPC-ZlAqxUU850YRbZoeTPbUF2r_vqt-jEJxs6xMP-bO_3Kr" 
          />
          {/* Map Overlay Gradients */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#f8f9ff] to-transparent z-10 pointer-events-none"></div>
          
          {/* Floating Status Badge */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur-xs shadow-md rounded-full px-4 py-2 border border-gray-100 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            <span className="text-xs font-bold text-primary">Heading to Pickup</span>
          </div>
        </section>

        {/* Swipe Sheet details */}
        <section className="flex-grow px-4 pt-1 pb-6 flex flex-col gap-4 relative z-20 -mt-5 bg-[#f8f9ff]">
          {/* Pull handle styling */}
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-2 opacity-60"></div>

          {/* Order Info Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-[#0b1c30]">Order #{order.id}</h2>
              <p className="text-xs text-gray-500 mt-0.5">Est. {order.estTime} mins • {order.distance} km</p>
            </div>
            <div className="bg-orange-50 px-3 py-1 rounded-full border border-orange-100 shadow-3xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse"></span>
              <span className="text-xs font-bold text-secondary">Flash Delivery</span>
            </div>
          </div>

          {/* Pickup Details Card */}
          <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-4 flex flex-col gap-3 relative overflow-hidden group hover:shadow-sm transition-all duration-200">
            {/* Urgency Highlight Left bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary"></div>
            
            <div className="flex items-start gap-3">
              <div className="bg-orange-50 p-2.5 rounded-full mt-0.5 text-secondary">
                <span className="material-symbols-outlined text-[20px] fill-1">storefront</span>
              </div>
              <div className="flex-grow">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Pickup Location</h3>
                <p className="text-sm font-bold text-[#0b1c30] mt-0.5">{order.pickupAddress}</p>
                <p className="text-xs text-gray-400 mt-0.5">Logistics Hub, Zone A</p>
              </div>
            </div>
          </div>

          {/* Customer Details Card */}
          <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-4 flex flex-col gap-3 hover:shadow-sm transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  className="w-11 h-11 rounded-full object-cover border border-gray-100 shadow-3xs"
                  alt="Customer Avatar"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBY0P7NKiglTLw4dzxBgDcIosrtxAcAXC7IpwKyPDEN5XT9F_wQ5c0PzgT7fv7G_RoxXs7_UB37PCR_LBfqye8cBObUVm8mGhYcI9-KiS7pO3gDlcHkr9jh1NL4jH5jgNSgLtifSaYzITNGWHgFqv5SMeh_rMLts_64FBlCCf4jIGg6j71jx6JeqWKqI24N0D0o-zXYKqjYBLl1R66wvASqclsIrnxyUUC2cixTxpAMI9xEXIP06KBt" 
                />
                <div>
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Customer</h3>
                  <p className="text-sm font-bold text-[#0b1c30] mt-0.5">{order.customerName}</p>
                </div>
              </div>
              
              <button 
                onClick={handleCallCustomer}
                className="bg-primary/5 hover:bg-primary hover:text-white text-primary transition-all duration-200 p-2.5 rounded-full flex items-center justify-center border border-primary/10 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] fill-1">call</span>
              </button>
            </div>
            
            {order.note && (
              <>
                <div className="h-px w-full bg-gray-100 my-0.5"></div>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="material-symbols-outlined text-[16px] text-primary">info</span>
                  <p className="text-xs text-gray-500">{order.note}</p>
                </div>
              </>
            )}
          </div>

          {/* Action button */}
          <div className="mt-4">
            <button 
              onClick={onArrivedAtPickup}
              className="w-full bg-primary hover:bg-blue-800 active:scale-[0.98] transition-all duration-150 text-white font-bold text-base py-4 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              Arrived at Pickup
              <span className="material-symbols-outlined text-[20px] fill-1 animate-pulse">check_circle</span>
            </button>
          </div>
        </section>
      </main>

      {/* CALL SIMULATION POPUP */}
      {showCallSim && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-[#111827] text-white w-full max-w-sm rounded-3xl p-6 flex flex-col items-center shadow-2xl border border-white/10 animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4 animate-pulse">
              <span className="material-symbols-outlined text-3xl">call</span>
            </div>
            <h3 className="text-lg font-bold">{order.customerName}</h3>
            <p className="text-xs text-gray-400 mt-1">Calling customer via masked proxy...</p>
            <p className="text-2xl font-mono mt-4 text-green-400">{formatDuration(callDuration)}</p>
            
            <div className="flex gap-4 mt-8 w-full">
              <button 
                onClick={handleEndCall}
                className="w-full bg-red-600 hover:bg-red-700 active:scale-95 transition-all text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined">call_end</span>
                Hang Up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
