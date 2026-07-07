import React, { useState } from 'react';
import { Order } from '../types';

interface FinalStepProps {
  order: Order;
  onBack: () => void;
  onCompleteDelivery: () => void;
}

export default function FinalStep({
  order,
  onBack,
  onCompleteDelivery,
}: FinalStepProps) {
  const [showPodPhoto, setShowPodPhoto] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [podUploaded, setPodUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setPodUploaded(true);
    }, 1200);
  };

  const handleDeliver = () => {
    if (podUploaded) {
      setShowSuccessModal(true);
    }
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
          <span className="text-sm font-bold text-primary tracking-tight">Order #{order.id}</span>
        </div>
        <div className="w-10"></div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-18 px-4 flex flex-col gap-6 w-full max-w-md mx-auto bg-[#f8f9ff]">
        {/* Header Text */}
        <div className="text-center mt-2">
          <h1 className="text-2xl font-black text-[#0b1c30] tracking-tight">Final Step</h1>
          <p className="text-sm text-gray-500 mt-1">Complete delivery at destination.</p>
        </div>

        {/* Proof of Delivery Card */}
        <section className={`bg-white rounded-2xl shadow-xs p-4 flex items-center gap-4 border transition-all duration-200 ${
          podUploaded ? 'border-gray-100 hover:shadow-sm' : 'border-dashed border-orange-300 bg-orange-50/20'
        }`}>
          {isUploading ? (
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-primary">
              <span className="material-symbols-outlined text-[30px] animate-spin">autorenew</span>
            </div>
          ) : podUploaded ? (
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 text-green-500">
              <span className="material-symbols-outlined text-[30px] fill-1">check_circle</span>
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 text-orange-600 animate-pulse">
              <span className="material-symbols-outlined text-[30px]">add_a_photo</span>
            </div>
          )}
          
          <div className="flex-grow">
            <h3 className="text-sm font-bold text-[#0b1c30]">Proof of Delivery (POD)</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {isUploading 
                ? 'Uploading POD photo...' 
                : podUploaded 
                  ? 'Photo successfully uploaded.' 
                  : 'Photo required to complete delivery.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {podUploaded && !isUploading && (
              <>
                <button 
                  onClick={() => setShowPodPhoto(true)}
                  className="text-primary font-bold text-xs hover:underline hover:text-blue-800 transition-colors cursor-pointer"
                >
                  View
                </button>
                <button 
                  onClick={handleSimulateUpload}
                  className="text-gray-500 font-medium text-xs hover:underline transition-colors cursor-pointer"
                >
                  Retake
                </button>
              </>
            )}
            {!podUploaded && !isUploading && (
              <button 
                onClick={handleSimulateUpload}
                className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-800 transition-colors cursor-pointer"
              >
                Upload
              </button>
            )}
          </div>
        </section>

        {/* Collect Cash Box (COD Collection) */}
        {order.codAmount > 0 && (
          <section className="bg-orange-50/70 rounded-2xl shadow-xs p-6 border border-orange-200/50 flex flex-col items-center justify-center py-8 relative overflow-hidden group">
            {/* Decorative blurs */}
            <div className="absolute -right-8 -top-8 w-28 h-28 bg-secondary/10 rounded-full blur-xl pointer-events-none group-hover:scale-110 transition-transform"></div>
            
            <div className="flex items-center gap-1.5 text-secondary mb-1.5 z-10 font-bold">
              <span className="material-symbols-outlined text-[20px] fill-1">payments</span>
              <span className="text-xs uppercase tracking-wider">Collect Cash</span>
            </div>
            
            <div className="text-4xl font-extrabold text-[#5c2400] z-10 tracking-tight">
              ₹{order.codAmount.toFixed(2)}
            </div>
            
            <p className="text-[11px] text-[#783200] mt-3 text-center z-10 max-w-[85%] leading-relaxed font-medium">
              Ensure exact change is collected before completing the delivery.
            </p>
          </section>
        )}

        {/* Bento Detail Cards */}
        <section className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Items</span>
            <span className="text-base font-extrabold text-primary block mt-1">{order.itemsCount} Packages</span>
          </div>
          <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Customer</span>
            <span className="text-base font-extrabold text-primary block mt-1 truncate">{order.customerName}</span>
          </div>
        </section>

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* Deliver Sticky Action Button */}
        <div className="mt-4">
          <button 
            disabled={!podUploaded}
            onClick={handleDeliver}
            className={`w-full font-bold text-base py-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all duration-150 ${
              podUploaded 
                ? 'bg-primary hover:bg-blue-800 active:scale-[0.98] text-white cursor-pointer shadow-md' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {podUploaded ? 'how_to_reg' : 'lock'}
            </span>
            {podUploaded ? 'Deliver Order' : 'Upload Photo to Proceed'}
          </button>
        </div>
      </main>

      {/* POD PHOTO VIEW OVERLAY */}
      {showPodPhoto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl flex flex-col relative animate-scale-in">
            <button 
              onClick={() => setShowPodPhoto(false)}
              className="absolute top-4 right-4 bg-black/50 text-white h-8 w-8 rounded-full flex items-center justify-center hover:bg-black/70 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
            <div className="p-4 bg-gray-50 border-b border-gray-100">
              <h3 className="font-bold text-[#0b1c30]">Uploaded POD Photo</h3>
              <p className="text-xs text-gray-500">ORD-{order.id} timestamp: {new Date().toLocaleTimeString()}</p>
            </div>
            <div className="relative h-64 w-full bg-black">
              <img 
                alt="POD" 
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPMWTn7MyNKQFgbl0HPAm6eoyU3qN2_fzHK6Gr_Ko-g2fmv1KalF750hEuRT0KQXs-b1VG1a-Ts6XD2foWfSRXITUS-7nQF5dwh4wIZnlbeSZlXgPqtwlQ2PzDCdlMHqDx5n8VNcEyRsBxSdXuYO8gTx5eC7PdNaNqr-asBqvgnu5AlXN163xHbTyjP0fre4dteQogf0cg6ckSP51y3x7WDjo3C8L3AXXryJCJJeBSkPcAllyZU5FG" 
              />
            </div>
            <div className="p-4 flex gap-3">
              <button 
                onClick={() => setShowPodPhoto(false)}
                className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-blue-800 transition-colors cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL POPUP */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white text-center rounded-3xl p-6 shadow-2xl border border-gray-100 max-w-xs w-full flex flex-col items-center animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4 animate-bounce">
              <span className="material-symbols-outlined text-3xl fill-1">check_circle</span>
            </div>
            <h3 className="text-xl font-black text-[#0b1c30]">Delivery Completed!</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Fantastic work! Payout of <strong className="text-green-600">₹{order.estPayout.toFixed(2)}</strong> has been credited to your active session wallet.
            </p>
            {order.codAmount > 0 && (
              <div className="bg-orange-50 text-orange-800 font-bold text-xs py-2 px-4 rounded-full mt-4 flex items-center gap-1.5 border border-orange-100">
                <span className="material-symbols-outlined text-sm">payments</span>
                Cash in Hand: +₹{order.codAmount.toFixed(2)}
              </div>
            )}
            <button 
              onClick={() => {
                setShowSuccessModal(false);
                onCompleteDelivery();
              }}
              className="w-full bg-primary hover:bg-blue-800 active:scale-95 transition-all text-white py-3 rounded-xl font-bold mt-6 cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
