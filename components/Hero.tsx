
import React from 'react';
import { Zap, ShieldCheck, Globe, Star } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-slate-900 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-br from-blue-900/20 via-slate-900/50 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 w-1/3 h-full bg-cyan-900/10 blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative z-10">
        <div className="flex flex-col items-center text-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Star className="w-3 h-3 fill-cyan-400" />
            Official E-Sports Partner
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-5xl">
            Level Up Your Game <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 filter drop-shadow-lg">
              Instantly & Securely
            </span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-16">
            The premier destination for in-game currency. Get CP, Diamonds, UC, and more delivered straight to your ID in seconds.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-slate-800/50 pt-10 w-full max-w-4xl">
            <div className="flex flex-col items-center p-4 rounded-2xl hover:bg-slate-800/30 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                   <Zap className="w-5 h-5 text-yellow-400" />
                </div>
                <span className="font-bold text-white text-lg">Instant</span>
              </div>
              <span className="text-sm text-slate-500">Auto-Delivery System</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-2xl hover:bg-slate-800/30 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/20">
                   <ShieldCheck className="w-5 h-5 text-green-400" />
                </div>
                <span className="font-bold text-white text-lg">Secure</span>
              </div>
              <span className="text-sm text-slate-500">SSL Encrypted Payments</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-2xl hover:bg-slate-800/30 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                   <Globe className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="font-bold text-white text-lg">Global</span>
              </div>
              <span className="text-sm text-slate-500">Multi-Currency Support</span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Hero;
