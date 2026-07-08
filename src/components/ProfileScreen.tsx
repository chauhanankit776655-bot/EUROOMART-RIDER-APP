import React from 'react';
import { RiderProfile } from '../types';

interface ProfileScreenProps {
  onBack: () => void;
  riderProfile: RiderProfile;
}

export default function ProfileScreen({ onBack, riderProfile }: ProfileScreenProps) {
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
        <span className="text-base font-extrabold text-[#0b1c30]">Profile</span>
        <div className="w-10"></div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-18 px-4 flex flex-col gap-6 w-full max-w-md mx-auto bg-[#f8f9ff]">
        {/* Rider Identification Card */}
        <section className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 flex flex-col items-center text-center">
          <div className="relative">
            <img 
              className="w-20 h-20 rounded-full border-4 border-primary/10 object-cover shadow-sm"
              alt="Rider Portrait"
              src={riderProfile.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuBY0P7NKiglTLw4dzxBgDcIosrtxAcAXC7IpwKyPDEN5XT9F_wQ5c0PzgT7fv7G_RoxXs7_UB37PCR_LBfqye8cBObUVm8mGhYcI9-KiS7pO3gDlcHkr9jh1NL4jH5jgNSgLtifSaYzITNGWHgFqv5SMeh_rMLts_64FBlCCf4jIGg6j71jx6JeqWKqI24N0D0o-zXYKqjYBLl1R66wvASqclsIrnxyUUC2cixTxpAMI9xEXIP06KBt"} 
            />
            <span className="absolute bottom-0 right-0 bg-green-500 border-2 border-white w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
              L4
            </span>
          </div>

          <h2 className="text-lg font-black text-[#0b1c30] mt-3">{riderProfile.name}</h2>
          <p className="text-xs text-gray-500 mt-0.5">{riderProfile.email || 'rider@euromart.com'}</p>
          
          <div className="flex items-center gap-1.5 bg-blue-50 text-primary px-3 py-1 rounded-full text-xs font-bold mt-3 border border-blue-100">
            <span className="material-symbols-outlined text-xs fill-1">star</span>
            <span>{riderProfile.rating} Rating</span>
            <span className="text-gray-300">•</span>
            <span>Premium Partner</span>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 w-full flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
            <span className="material-symbols-outlined text-sm text-primary">
              {riderProfile.vehicle_type.toLowerCase() === 'bicycle' ? 'directions_bike' : 'motorcycle'}
            </span>
            <span>{riderProfile.vehicle_model || riderProfile.vehicle_type} • {riderProfile.vehicle_number || 'N/A'}</span>
          </div>
        </section>

        {/* Dynamic Statistics Grid */}
        <section className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Weekly Online</span>
            <span className="text-lg font-black text-primary block mt-1">{riderProfile.weekly_online_hours}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Acceptance Rate</span>
            <span className="text-lg font-black text-green-600 block mt-1">{riderProfile.acceptance_rate}%</span>
          </div>
        </section>

        {/* Credentials and Verification Info */}
        <section className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-3">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Rider Verification</h3>
          
          <div className="flex items-center justify-between text-xs py-1 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">badge</span>
              <span className="font-semibold text-gray-700">Driving License</span>
            </div>
            {riderProfile.driving_license_verified ? (
              <span className="text-green-600 font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm fill-1">check_circle</span> Verified
              </span>
            ) : (
              <span className="text-red-500 font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm fill-1">cancel</span> Pending
              </span>
            )}
          </div>
          <div className="flex items-center justify-between text-xs py-1 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">fingerprint</span>
              <span className="font-semibold text-gray-700">Aadhaar KYC Verification</span>
            </div>
            {riderProfile.aadhaar_verified ? (
              <span className="text-green-600 font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm fill-1">check_circle</span> Verified
              </span>
            ) : (
              <span className="text-red-500 font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm fill-1">cancel</span> Pending
              </span>
            )}
          </div>
          <div className="flex items-center justify-between text-xs py-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">assignment</span>
              <span className="font-semibold text-gray-700">Vehicle Insurance</span>
            </div>
            {riderProfile.insurance_active ? (
              <span className="text-green-600 font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm fill-1">check_circle</span> Active
              </span>
            ) : (
              <span className="text-red-500 font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm fill-1">cancel</span> Pending
              </span>
            )}
          </div>
        </section>


        {/* Utility / SOS Support */}
        <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100">
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-left cursor-pointer text-xs">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">support_agent</span>
              <span className="font-bold text-gray-800">Support & Help Center</span>
            </div>
            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
          </button>
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-red-50 text-left text-red-600 cursor-pointer text-xs">
            <div className="flex items-center gap-3 font-extrabold">
              <span className="material-symbols-outlined text-red-600 animate-pulse fill-1">emergency</span>
              <span>Emergency SOS Contact</span>
            </div>
            <span className="material-symbols-outlined text-red-600">chevron_right</span>
          </button>
        </section>

        {/* App Info Footer */}
        <div className="text-center text-[10px] text-gray-400 font-medium py-3">
          EurooMart Velocity Rider App v2.4.12-Prod
          <br />
          Built for high-precision hyperlocal operations
        </div>
      </main>
    </div>
  );
}
