import React, { useState } from 'react';
import { ShoppingCart, Menu, Search, Gamepad2, User, LogIn, Globe, LayoutDashboard, ChevronDown, X, Package, Heart, CreditCard } from 'lucide-react';
import { User as UserType } from '../types';
import { CURRENCY_SYMBOLS } from '../utils';

interface NavbarProps {
  cartCount: number;
  user: UserType | null;
  onOpenLogin: () => void;
  onOpenProfile: () => void;
  onOpenAdmin: () => void;
  onOpenCart: () => void;
  currency: string;
  onCurrencyChange: (currency: string) => void;
  searchQuery: string;
  onSearch: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  cartCount, user, onOpenLogin, onOpenProfile, onOpenAdmin, onOpenCart, currency, onCurrencyChange, searchQuery, onSearch 
}) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const availableCurrencies = Object.keys(CURRENCY_SYMBOLS);

  const handleCurrencySelect = (c: string) => {
    onCurrencyChange(c);
    setIsCurrencyMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsMobileSearchOpen(false); // Close search if menu opens
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Gamepad2 className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 hidden sm:block">
              PRIME LOOT
            </span>
             <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 sm:hidden">
              PRIME
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-8">
            <a href="#" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">Home</a>
            <a href="#games" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">Games</a>
            <a href="#vouchers" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">Vouchers</a>
            <a href="#support" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">Support</a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Desktop Search */}
            <div className="hidden md:block relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
               <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                  placeholder="Search games..."
                  className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-full pl-9 pr-4 py-1.5 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all w-48 focus:w-64 placeholder:text-slate-500"
               />
            </div>

            {/* Mobile Search Toggle */}
            <button 
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Currency Selector */}
            <div className="relative hidden sm:block">
              <button 
                onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-500 transition-all"
              >
                <Globe className="w-3 h-3" />
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              
              {isCurrencyMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsCurrencyMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-32 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    {availableCurrencies.map((c) => (
                      <button
                        key={c}
                        onClick={() => handleCurrencySelect(c)}
                        className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-slate-700 flex justify-between items-center ${
                          currency === c ? 'text-cyan-400 bg-slate-700/50' : 'text-slate-300'
                        }`}
                      >
                        {c}
                        {currency === c && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button onClick={onOpenCart} className="relative cursor-pointer">
              <ShoppingCart className="w-6 h-6 text-slate-300 hover:text-white transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            
            {/* Auth Button (Desktop) */}
            <div className="hidden lg:flex items-center gap-2">
              {user ? (
                 <div className="flex items-center gap-2">
                   {/* Admin Dashboard Button */}
                   {user.isAdmin && (
                     <button
                       onClick={onOpenAdmin}
                       className="p-1.5 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/20 rounded-lg transition-colors"
                       title="Admin Dashboard"
                     >
                       <LayoutDashboard className="w-5 h-5" />
                     </button>
                   )}
                   
                   <button 
                     onClick={onOpenProfile}
                     className="flex items-center gap-2 pl-2 pr-4 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-full border border-slate-700 transition-colors"
                   >
                     <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                       {user.name.charAt(0).toUpperCase()}
                     </div>
                     <span className="text-sm font-medium text-white hidden sm:block">{user.name}</span>
                   </button>
                 </div>
              ) : (
                <button 
                  onClick={onOpenLogin}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Login</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar (Conditionally Rendered) */}
      {isMobileSearchOpen && !isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 p-4 animate-in slide-in-from-top-2">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search for games..."
                autoFocus
                className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
           </div>
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bg-slate-900 border-b border-slate-800 shadow-2xl animate-in slide-in-from-top-5 z-40 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-4 space-y-4">
            
            {/* Mobile Auth / Profile Section */}
            <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-lg font-bold text-white">
                       {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-bold">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => { onOpenProfile(); setIsMobileMenuOpen(false); }}
                      className="flex flex-col items-center justify-center p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors gap-1"
                    >
                      <Package className="w-5 h-5 text-cyan-400" />
                      <span className="text-xs font-medium text-slate-200">My Orders</span>
                    </button>
                    <button 
                       onClick={() => { onOpenProfile(); setIsMobileMenuOpen(false); }}
                       className="flex flex-col items-center justify-center p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors gap-1"
                    >
                      <User className="w-5 h-5 text-blue-400" />
                      <span className="text-xs font-medium text-slate-200">Account</span>
                    </button>
                  </div>

                  {user.isAdmin && (
                    <button 
                      onClick={() => { onOpenAdmin(); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center justify-center gap-2 p-3 bg-cyan-900/30 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-900/50 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-slate-400 text-sm mb-3">Login to track orders & view history</p>
                  <button 
                    onClick={() => { onOpenLogin(); setIsMobileMenuOpen(false); }}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" /> Login / Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <div className="space-y-1">
              <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg font-medium transition-colors">
                Home
              </a>
              <a href="#games" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg font-medium transition-colors">
                Games Catalog
              </a>
              <a href="#vouchers" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg font-medium transition-colors">
                Gift Cards & Vouchers
              </a>
              <a href="#support" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg font-medium transition-colors">
                Support Center
              </a>
            </div>

            {/* Mobile Currency Selector */}
            <div className="pt-4 border-t border-slate-800">
               <p className="text-xs font-bold text-slate-500 uppercase px-2 mb-2">Currency</p>
               <div className="grid grid-cols-4 gap-2">
                 {availableCurrencies.map((c) => (
                   <button
                     key={c}
                     onClick={() => { handleCurrencySelect(c); setIsMobileMenuOpen(false); }}
                     className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                       currency === c 
                         ? 'bg-cyan-900/30 text-cyan-400 border-cyan-500/30' 
                         : 'bg-slate-800 text-slate-400 border-slate-700'
                     }`}
                   >
                     {c}
                   </button>
                 ))}
               </div>
            </div>

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;