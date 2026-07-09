import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { RiderProfile } from '../types';

interface LoginScreenProps {
  onLogin: (riderId: string, profile?: RiderProfile) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [riderId, setRiderId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = riderId.trim();
    if (!cleanId) {
      setError('Please enter a valid Rider ID.');
      return;
    }

    setError(null);
    setLoading(true);

    if (isSupabaseConfigured) {
      try {
        const { data, error: fetchErr } = await supabase
          .from('riders')
          .select('*')
          .eq('id', cleanId)
          .maybeSingle();

        if (fetchErr) {
          console.error('Error verifying rider:', fetchErr);
          setError('Connection error. Please try again.');
        } else if (!data) {
          setError(`Rider ID "${cleanId}" not found in database.`);
        } else {
          // Success
          onLogin(cleanId, data as RiderProfile);
        }
      } catch (err) {
        console.error(err);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    } else {
      // In Mock mode, allow logging in with any ID.
      // If it's R-8088, App will initialize with the default profile.
      setTimeout(() => {
        onLogin(cleanId);
        setLoading(false);
      }, 500);
    }
  };

  const handleQuickLogin = async () => {
    setRiderId('R-8088');
    setError(null);
    setLoading(true);
    
    if (isSupabaseConfigured) {
      try {
        const { data, error: fetchErr } = await supabase
          .from('riders')
          .select('*')
          .eq('id', 'R-8088')
          .maybeSingle();

        if (fetchErr || !data) {
          console.error('Error fetching demo profile:', fetchErr);
          // Fallback in case R-8088 doesn't exist in DB yet
          onLogin('R-8088');
        } else {
          onLogin('R-8088', data as RiderProfile);
        }
      } catch (err) {
        console.error('Error during quick login:', err);
        onLogin('R-8088');
      } finally {
        setLoading(false);
      }
    } else {
      setTimeout(() => {
        onLogin('R-8088');
        setLoading(false);
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1c30] to-[#00288e] flex flex-col justify-between py-12 px-6 w-full max-w-md mx-auto relative overflow-hidden text-white shadow-2xl">
      {/* Background Micro-animations / Decorative elements */}
      <div className="absolute top-[-20%] left-[-20%] w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 rounded-full bg-orange-500/10 blur-3xl pointer-events-none"></div>

      {/* Header Branding */}
      <div className="flex flex-col items-center text-center mt-8 z-10">
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg">
          <span className="material-symbols-outlined text-[36px] text-orange-400 fill-1">local_shipping</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight mt-4">EurooMart Velocity</h1>
        <p className="text-xs text-blue-200 font-semibold mt-1">Hyperlocal Operations Rider Portal</p>
      </div>

      {/* Login Card Form */}
      <div className="bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 flex flex-col gap-5 text-gray-800 z-10 my-auto">
        <div className="flex flex-col">
          <h2 className="text-lg font-black text-[#0b1c30]">Welcome back!</h2>
          <p className="text-xs text-gray-500 mt-0.5">Please sign in to access your deliveries dashboard.</p>
        </div>

        <form onSubmit={handleSignIn} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rider ID</label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-gray-400 text-[20px]">badge</span>
              <input 
                type="text" 
                value={riderId}
                onChange={(e) => setRiderId(e.target.value)}
                placeholder="e.g. R-8088"
                className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold transition-all placeholder:text-gray-300"
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 text-red-700 p-3 rounded-xl border border-red-100 text-xs font-bold">
              <span className="material-symbols-outlined text-sm shrink-0">error</span>
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            className={`w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-[#5c2400] font-black py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm text-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <span className="text-xs font-bold animate-pulse">Authenticating...</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px] font-black">login</span>
                <span>Sign In as Rider</span>
              </>
            )}
          </button>
        </form>

        <div className="flex items-center justify-center my-1">
          <div className="h-px bg-gray-100 flex-grow"></div>
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mx-3">OR</span>
          <div className="h-px bg-gray-100 flex-grow"></div>
        </div>

        {/* Demo Fast Login */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Quick Access for Testing</span>
          <button 
            onClick={handleQuickLogin}
            disabled={loading}
            className="bg-primary/5 hover:bg-primary/10 text-primary border border-primary/15 rounded-full px-4 py-2 text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <span className="material-symbols-outlined text-sm font-bold">flash_on</span>
            <span>Quick Demo Login (R-8088)</span>
          </button>
        </div>
      </div>

      {/* Footer / Status info */}
      <div className="flex flex-col items-center text-center gap-1 z-10">
        <span className="text-[10px] text-blue-200 font-medium">
          Database Status: {isSupabaseConfigured ? (
            <span className="text-green-400 font-bold flex items-center justify-center gap-1 inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span> Live Supabase
            </span>
          ) : (
            <span className="text-orange-300 font-bold">Local Demo Offline</span>
          )}
        </span>
        <span className="text-[9px] text-blue-300/60 font-medium mt-1">
          v2.4.12-Prod • Security compliance enforced
        </span>
      </div>
    </div>
  );
}
