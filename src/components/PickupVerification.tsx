import React, { useState } from 'react';
import { Order } from '../types';

interface PickupVerificationProps {
  order: Order;
  onBack: () => void;
  onConfirmPickup: () => void;
}

export default function PickupVerification({
  order,
  onBack,
  onConfirmPickup,
}: PickupVerificationProps) {
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [cameraDirection, setCameraDirection] = useState<'back' | 'front'>('back');
  const [triggerFlash, setTriggerFlash] = useState(false);

  const handleCapturePhoto = () => {
    // Shutter button flash effect
    setTriggerFlash(true);
    setTimeout(() => {
      setTriggerFlash(false);
      setPhotoCaptured(true);
    }, 150);
  };

  return (
    <div className="relative h-screen w-full flex flex-col bg-black overflow-hidden select-none">
      {/* Transactional Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between pointer-events-none max-w-md mx-auto">
        <button 
          onClick={onBack}
          className="pointer-events-auto h-12 w-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="pointer-events-auto bg-black/40 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-white border border-white/5">
          <span className="material-symbols-outlined text-[20px] text-green-400">qr_code_scanner</span>
          <span className="font-semibold text-sm tracking-tight">{order.id}</span>
        </div>
      </header>

      {/* Camera Flash Screen Overlay */}
      {triggerFlash && (
        <div className="absolute inset-0 bg-white z-50 animate-flash-out"></div>
      )}

      {/* Main Viewfinder Area */}
      <main className="flex-grow relative w-full h-full">
        {/* Live Camera Feed Image */}
        <div className="absolute inset-0 z-0">
          <img 
            alt="Camera Feed" 
            className={`w-full h-full object-cover transition-all duration-300 ${
              photoCaptured ? 'brightness-110 contrast-105' : 'brightness-90'
            } ${cameraDirection === 'front' ? 'scale-x-[-1]' : ''}`}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPMWTn7MyNKQFgbl0HPAm6eoyU3qN2_fzHK6Gr_Ko-g2fmv1KalF750hEuRT0KQXs-b1VG1a-Ts6XD2foWfSRXITUS-7nQF5dwh4wIZnlbeSZlXgPqtwlQ2PzDCdlMHqDx5n8VNcEyRsBxSdXuYO8gTx5eC7PdNaNqr-asBqvgnu5AlXN163xHbTyjP0fre4dteQogf0cg6ckSP51y3x7WDjo3C8L3AXXryJCJJeBSkPcAllyZU5FG" 
          />
        </div>

        {/* Camera overlay dark mask */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none"></div>

        {/* Guidance Overlay */}
        <div className="absolute top-1/4 left-0 right-0 z-20 flex justify-center pointer-events-none px-6">
          <div className="bg-black/60 backdrop-blur-md text-white rounded-2xl p-4 text-center border border-white/10 shadow-xl max-w-xs w-full">
            <span className="material-symbols-outlined text-3xl mb-1.5 text-secondary-fixed-dim">info</span>
            <h2 className="font-bold text-base">Proof of Pickup</h2>
            <p className="text-xs text-white/80 mt-1 leading-relaxed">
              Please capture a clear photo of the package showing the label.
            </p>
          </div>
        </div>

        {/* Viewfinder Reticle */}
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 rounded-2xl z-20 pointer-events-none flex flex-col justify-between transition-all duration-300 ${
            photoCaptured ? 'border-green-400 bg-green-500/10' : 'border-white/40'
          }`}
        >
          <div className="flex justify-between w-full p-2.5">
            <div className={`w-4 h-4 border-t-4 border-l-4 transition-colors ${photoCaptured ? 'border-green-400' : 'border-primary-fixed-dim'}`}></div>
            <div className={`w-4 h-4 border-t-4 border-r-4 transition-colors ${photoCaptured ? 'border-green-400' : 'border-primary-fixed-dim'}`}></div>
          </div>
          <div className="flex justify-between w-full p-2.5">
            <div className={`w-4 h-4 border-b-4 border-l-4 transition-colors ${photoCaptured ? 'border-green-400' : 'border-primary-fixed-dim'}`}></div>
            <div className={`w-4 h-4 border-b-4 border-r-4 transition-colors ${photoCaptured ? 'border-green-400' : 'border-primary-fixed-dim'}`}></div>
          </div>
        </div>

        {/* Bottom controls overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-30 pb-10 pt-14 px-6 flex flex-col items-center justify-end bg-gradient-to-t from-black via-black/80 to-transparent">
          {/* Shutter panel */}
          <div className="flex items-center justify-between w-full max-w-sm mb-6 px-6">
            {/* Flash button */}
            <button 
              onClick={() => setFlashOn(!flashOn)}
              className={`h-11 w-11 rounded-full flex items-center justify-center transition-all backdrop-blur-sm cursor-pointer ${
                flashOn ? 'bg-yellow-400 text-black' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {flashOn ? 'flash_on' : 'flash_off'}
              </span>
            </button>

            {/* Shutter Button */}
            <button 
              onClick={handleCapturePhoto}
              className="w-18 h-18 rounded-full bg-white flex items-center justify-center border-4 border-black shadow-[0_0_0_4px_rgba(255,255,255,0.3)] hover:scale-95 active:scale-90 transition-all cursor-pointer"
            >
              <div className="w-13 h-13 rounded-full bg-white border-2 border-gray-200"></div>
            </button>

            {/* Flip camera button */}
            <button 
              onClick={() => setCameraDirection(cameraDirection === 'back' ? 'front' : 'back')}
              className="h-11 w-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all backdrop-blur-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">flip_camera_ios</span>
            </button>
          </div>

          {/* Confirm Pickup Action Button */}
          <div className="w-full max-w-sm">
            <button 
              onClick={() => {
                if (photoCaptured) onConfirmPickup();
              }}
              disabled={!photoCaptured}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all duration-300 ${
                photoCaptured 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 cursor-pointer active:scale-95' 
                  : 'bg-gray-800 text-gray-500 opacity-60 cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined">check_circle</span>
              Confirm Pickup
            </button>
          </div>

          {/* Est Value point */}
          <div className="mt-4 text-white/50 text-[11px] font-medium tracking-wide">
            Est. Cargo Value: ₹1,450
          </div>
        </div>
      </main>
    </div>
  );
}
