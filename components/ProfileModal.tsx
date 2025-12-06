

import React, { useState } from 'react';
import { X, Package as PackageIcon, Heart, User, LogOut, Clock, CheckCircle, Gamepad2, CreditCard, Smartphone, Wallet } from 'lucide-react';
import { User as UserType, Order, Game } from '../types';
import GameCard from './GameCard';

interface ProfileModalProps {
  user: UserType;
  orders: Order[];
  wishlist: Game[];
  onClose: () => void;
  onLogout: () => void;
  onRemoveFromWishlist: (game: Game) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ 
  user, orders, wishlist, onClose, onLogout, onRemoveFromWishlist 
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist'>('profile');

  const getPaymentIcon = (method: string) => {
    switch(method) {
      case 'paypal': return <Wallet className="w-3.5 h-3.5 text-blue-400" />;
      case 'mpesa': return <Smartphone className="w-3.5 h-3.5 text-green-500" />;
      case 'google_pay': return <Wallet className="w-3.5 h-3.5 text-white" />;
      case 'apple_pay': return <Wallet className="w-3.5 h-3.5 text-white" />;
      default: return <CreditCard className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-4xl bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700 flex flex-col h-[80vh]">
        
        {/* Header / Tabs */}
        <div className="flex flex-col sm:flex-row border-b border-slate-700">
           <div className="p-6 w-full sm:w-64 bg-slate-900/50 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-700">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-1 mb-3">
                 <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-3xl font-bold text-white">
                   {user.name.charAt(0).toUpperCase()}
                 </div>
              </div>
              <h3 className="text-xl font-bold text-white">{user.name}</h3>
              <p className="text-sm text-slate-400">{user.email}</p>
              <button 
                onClick={onLogout}
                className="mt-4 flex items-center gap-2 text-xs font-semibold text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 transition-colors"
              >
                <LogOut className="w-3 h-3" /> Sign Out
              </button>
           </div>
           
           <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                 <div className="flex gap-4">
                   <button 
                     onClick={() => setActiveTab('profile')}
                     className={`pb-1 text-sm font-medium transition-colors ${activeTab === 'profile' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'}`}
                   >
                     Overview
                   </button>
                   <button 
                     onClick={() => setActiveTab('orders')}
                     className={`pb-1 text-sm font-medium transition-colors ${activeTab === 'orders' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'}`}
                   >
                     Order History
                   </button>
                   <button 
                     onClick={() => setActiveTab('wishlist')}
                     className={`pb-1 text-sm font-medium transition-colors ${activeTab === 'wishlist' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'}`}
                   >
                     Wishlist ({wishlist.length})
                   </button>
                 </div>
                 <button onClick={onClose} className="text-slate-400 hover:text-white">
                   <X className="w-6 h-6" />
                 </button>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-800">
                 
                 {activeTab === 'profile' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-slate-900 border border-slate-700">
                          <div className="text-slate-400 text-xs uppercase font-bold mb-1">Total Spent</div>
                          <div className="text-2xl font-bold text-white">
                            ${orders.reduce((acc, curr) => acc + curr.price, 0).toFixed(2)}
                          </div>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-900 border border-slate-700">
                          <div className="text-slate-400 text-xs uppercase font-bold mb-1">Total Orders</div>
                          <div className="text-2xl font-bold text-white">{orders.length}</div>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-900 border border-slate-700">
                          <div className="text-slate-400 text-xs uppercase font-bold mb-1">Member Since</div>
                          <div className="text-lg font-medium text-white">{user.joinDate}</div>
                        </div>
                      </div>
                    </div>
                 )}

                 {activeTab === 'orders' && (
                    <div className="space-y-4">
                      {orders.length === 0 ? (
                        <div className="text-center py-12">
                          <PackageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                          <p className="text-slate-400">No orders yet.</p>
                        </div>
                      ) : (
                        orders.map(order => (
                          <div key={order.id} className="group p-5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/30 hover:bg-slate-800/80 transition-all shadow-sm hover:shadow-cyan-900/10">
                             <div className="flex flex-col gap-4">
                               {/* Top Row: Game & ID */}
                               <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 flex items-center justify-center text-cyan-400 shadow-inner">
                                        <Gamepad2 className="w-6 h-6" />
                                     </div>
                                     <div>
                                        <h4 className="font-bold text-white text-base">{order.gameName}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                           <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 select-all">
                                              #{order.id}
                                           </span>
                                        </div>
                                     </div>
                                  </div>
                                  <div className="text-right">
                                     <div className="font-bold text-white text-lg tracking-tight">${order.price.toFixed(2)}</div>
                                     <div className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border mt-1 ${
                                       order.status === 'Completed' 
                                         ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                         : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                     }`}>
                                       {order.status === 'Completed' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                       {order.status}
                                     </div>
                                  </div>
                               </div>

                               {/* Divider with dash */}
                               <div className="h-px bg-slate-800 w-full border-t border-dashed border-slate-700/50" />

                               {/* Bottom Row: Details */}
                               <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-400">
                                  <div className="flex flex-col gap-1">
                                     <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Item</span>
                                     <div className="flex items-center gap-2 text-slate-300 font-medium">
                                        <PackageIcon className="w-3.5 h-3.5 text-cyan-500" />
                                        {order.amount}
                                     </div>
                                  </div>
                                  
                                  <div className="flex flex-col gap-1">
                                     <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Date</span>
                                     <div className="flex items-center gap-2 text-slate-300 font-medium">
                                        <Clock className="w-3.5 h-3.5 text-cyan-500" />
                                        {order.date}
                                     </div>
                                  </div>

                                  <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                                     <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Payment</span>
                                     <div className="flex items-center gap-2 font-medium text-slate-300">
                                         {getPaymentIcon(order.paymentMethod)}
                                         <span className="capitalize">{order.paymentMethod.replace(/_/g, ' ')}</span>
                                     </div>
                                  </div>
                               </div>
                             </div>
                          </div>
                        ))
                      )}
                    </div>
                 )}

                 {activeTab === 'wishlist' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                       {wishlist.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                          <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                          <p className="text-slate-400">Your wishlist is empty.</p>
                        </div>
                      ) : (
                        wishlist.map(game => (
                          <div key={game.id} className="relative group">
                            <button 
                              onClick={() => onRemoveFromWishlist(game)}
                              className="absolute top-2 right-2 z-10 bg-black/50 p-1.5 rounded-full text-white hover:text-rose-500 hover:bg-white transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <div className="aspect-[3/4] rounded-lg overflow-hidden relative">
                               <img src={game.image} className="w-full h-full object-cover" />
                               <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                               <div className="absolute bottom-2 left-2 font-bold text-white text-sm">{game.name}</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                 )}

              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
