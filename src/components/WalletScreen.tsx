import React, { useState } from 'react';
import { Transaction } from '../types';

interface WalletScreenProps {
  cashInHand: number;
  transactions: Transaction[];
  onBack: () => void;
  onClearCash: () => void; // Simulated hub cash submission
}

export default function WalletScreen({
  cashInHand,
  transactions,
  onBack,
  onClearCash,
}: WalletScreenProps) {
  const [showHubs, setShowHubs] = useState(false);
  const [cashDepositing, setCashDepositing] = useState(false);

  const handleDepositCash = () => {
    setCashDepositing(true);
    setTimeout(() => {
      onClearCash();
      setCashDepositing(false);
      setShowHubs(false);
    }, 1500);
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
        <span className="text-base font-extrabold text-[#0b1c30]">Rider Wallet</span>
        <button className="text-gray-500 hover:bg-gray-100 transition-colors p-2 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-[24px]">info</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-18 px-4 flex flex-col gap-6 w-full max-w-md mx-auto bg-[#f8f9ff]">
        {/* Wallet Header / Cash in Hand */}
        <section className="bg-primary text-white rounded-2xl p-5 shadow-md flex flex-col items-center text-center relative overflow-hidden group">
          {/* Decorative blurs */}
          <div className="absolute -right-8 -top-8 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-300"></div>
          <div className="absolute -left-8 -bottom-8 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-300"></div>

          <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest mb-1.5">Cash in Hand</span>
          <h1 className="text-4xl font-black tracking-tight mb-3">₹{cashInHand.toLocaleString()}</h1>
          
          <div className={`flex items-center gap-2 bg-white/10 border px-4 py-2 rounded-full backdrop-blur-xs ${
            cashInHand > 2500 
              ? 'border-red-400 text-red-200 bg-red-500/10' 
              : 'border-white/10 text-white/95'
          }`}>
            <span className="material-symbols-outlined text-sm">info</span>
            <span className="text-[11px] font-medium">
              {cashInHand > 2500 
                ? 'Exceeds recommended limit (₹2,500)' 
                : 'Safe Limit (Maximum limit: ₹2,500)'}
            </span>
          </div>
        </section>

        {/* Action Buttons Grid */}
        <section className="grid grid-cols-2 gap-3">
          <button className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 active:scale-98 transition-all shadow-3xs cursor-pointer">
            <div className="w-11 h-11 rounded-full bg-orange-50 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[20px]">sync_alt</span>
            </div>
            <span className="text-xs font-bold text-gray-700">Transfer History</span>
          </button>
          <button className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 active:scale-98 transition-all shadow-3xs cursor-pointer">
            <div className="w-11 h-11 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <span className="material-symbols-outlined text-[20px]">account_balance</span>
            </div>
            <span className="text-xs font-bold text-gray-700">Bank Setup</span>
          </button>
        </section>

        {/* Recent Transactions List */}
        <section className="flex flex-col gap-3">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-base font-extrabold text-[#0b1c30]">Recent Transactions</h2>
            <button className="text-xs font-bold text-primary hover:underline cursor-pointer">View All</button>
          </div>
          
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-2xs divide-y divide-gray-100">
            {transactions.map((tx) => (
              <div 
                key={tx.id} 
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'cod_collected' 
                      ? 'bg-blue-50 text-primary' 
                      : 'bg-orange-50 text-secondary'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">
                      {tx.type === 'cod_collected' ? 'call_received' : 'publish'}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">{tx.details}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{tx.time}</p>
                  </div>
                </div>
                <span className={`text-sm font-extrabold ${
                  tx.amount > 0 ? 'text-green-600' : 'text-secondary'
                }`}>
                  {tx.amount > 0 ? '+' : ''}₹{tx.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA sticky buttons */}
        <div className="mt-4">
          <button 
            onClick={() => setShowHubs(true)}
            className="w-full bg-primary hover:bg-blue-800 active:scale-[0.98] transition-all duration-150 text-white rounded-xl py-4 flex items-center justify-center gap-2 font-semibold text-sm shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">location_on</span>
            Find Nearest Hub to Submit Cash
          </button>
        </div>
      </main>

      {/* NEAREST HUBS MAP POPUP */}
      {showHubs && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-scale-in">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-[#0b1c30]">Submit Cash at Hub</h3>
                <p className="text-[10px] text-gray-400">Cash limit to clear: ₹{cashInHand}</p>
              </div>
              <button 
                onClick={() => setShowHubs(false)}
                className="text-gray-500 hover:bg-gray-100 p-1 rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            {/* Simulation map snippet */}
            <div className="h-44 bg-gray-200 relative overflow-hidden">
              <img 
                alt="Mini Map Hub" 
                className="w-full h-full object-cover opacity-80"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNTndIyN_zjNbfCUuBht1D0chsFlCkoai2ahEooan4CL79kym51fPAn26EMX4WCaDVWCz67W1aeNQy7ZsJXR1LUgr861jImNZaNLr9uwocG67c6LGt5_z2Fl1bLJZXuaphnaLdKBgoTVD8PQjaqyaChHjSzjs7xiq7I83_2pdYy7dDlOFgScmG4LnagqC0vmYF2-gEGgNZkIeCf4cB-zypK5ODSGFbeoBoqAGEEDOh2tTJn3O46p4O" 
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                <span className="material-symbols-outlined text-primary text-4xl animate-bounce">location_on</span>
                <span className="bg-primary text-white text-[10px] font-bold py-1 px-2.5 rounded-full shadow-md">North Hub</span>
              </div>
            </div>

            <div className="p-4 overflow-y-auto flex flex-col gap-3">
              <div className="border border-primary/20 bg-blue-50/50 p-3 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-primary">North Zone Hub (Nearest)</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">Indiranagar Sector 2 • 1.2 km away</p>
                </div>
                <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">Open</span>
              </div>
              <div className="border border-gray-100 p-3 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-800">East Zone Hub</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">Koramangala 3rd Block • 3.5 km away</p>
                </div>
                <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">Open</span>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex flex-col gap-2">
              <button 
                onClick={handleDepositCash}
                disabled={cashDepositing || cashInHand === 0}
                className="w-full bg-primary hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {cashDepositing ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-sm">autorenew</span>
                    Depositing Cash...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">local_shipping</span>
                    Simulate Deposit (Clear Cash)
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
