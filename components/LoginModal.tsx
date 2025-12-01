
import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, Github, Check } from 'lucide-react';
import { User as UserType } from '../types';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (user: UserType) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for admin credentials (Username 'Alvin' or specific email)
    const isAdmin = name.trim().toLowerCase() === 'alvin' || 
                    email.toLowerCase().includes('admin') || 
                    email.toLowerCase() === 'alvinmondi0@gmail.com';

    // Simulate auth
    const user: UserType = {
      id: Date.now().toString(),
      name: name || email.split('@')[0] || 'Gamer',
      email: email,
      joinDate: new Date().toLocaleDateString(),
      isAdmin: isAdmin
    };

    // Handle Remember Me
    if (rememberMe) {
      localStorage.setItem('zenith_user', JSON.stringify(user));
    }

    onLogin(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700 animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {isRegistering ? 'Join Zenith Loot' : 'Welcome Back'}
          </h2>
          <p className="text-slate-400 text-sm">
            {isRegistering ? 'Create an account to track orders & earn rewards.' : 'Sign in to access your account and wishlist.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required={isRegistering}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                  placeholder="Your Gamer Tag"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          {!isRegistering && (
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${rememberMe ? 'bg-cyan-600 border-cyan-600' : 'bg-slate-900 border-slate-600 group-hover:border-slate-500'}`}>
                  {rememberMe && <Check className="w-3 h-3 text-white" />}
                </div>
                <input 
                  type="checkbox" 
                  className="hidden"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="text-xs text-slate-400 group-hover:text-slate-300">Remember Me</span>
              </label>
              <button type="button" className="text-xs text-cyan-400 hover:text-cyan-300">
                Forgot Password?
              </button>
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 mt-6"
          >
            {isRegistering ? 'Create Account' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm text-cyan-400 hover:text-cyan-300 font-medium"
          >
            {isRegistering ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
