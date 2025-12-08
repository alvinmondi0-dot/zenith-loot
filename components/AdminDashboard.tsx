
import React, { useState, useEffect } from 'react';
import { X, DollarSign, TrendingUp, Users, CreditCard, ArrowUpRight, Download, Building, Wallet, CheckCircle, AlertCircle, Clock, MapPin, User, Activity, Smartphone, ExternalLink } from 'lucide-react';
import { Order } from '../types';
import { formatPrice, convertPrice } from '../utils';
import { GAMES } from '../constants';

interface AdminDashboardProps {
  orders: Order[];
  onClose: () => void;
  currency: string;
  onUpdateStatus: (orderId: string, status: 'Completed' | 'Pending' | 'Failed') => void;
}

interface Withdrawal {
  id: string;
  date: string;
  amount: number;
  status: 'Completed' | 'Processing';
  method: string;
}

const MOCK_NAMES = ['GhostRider', 'PixelWarrior', 'LootMaster', 'Speedy', 'ProGamer123', 'Shadow', 'Phoenix', 'Viper', 'NeonNinja', 'CyberWolf'];
const MOCK_LOCATIONS = ['New York, USA', 'London, UK', 'Tokyo, Japan', 'Berlin, Germany', 'Paris, France', 'Toronto, Canada', 'Sydney, Australia', 'Nairobi, Kenya', 'Lagos, Nigeria', 'Mumbai, India'];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, onClose, currency, onUpdateStatus }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'payouts'>('overview');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showWithdrawSuccess, setShowWithdrawSuccess] = useState(false);
  
  // State for withdrawal simulation
  const [withdrawnAmount, setWithdrawnAmount] = useState(0);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);

  // State for simulated live orders to make the dashboard feel alive
  const [simulatedOrders, setSimulatedOrders] = useState<Order[]>([]);

  // Timer for forcing re-renders to update "time ago"
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  // Live Order Simulation Effect
  useEffect(() => {
    // Add a new mock order every 5-15 seconds to simulate live traffic
    const interval = setInterval(() => {
      // 40% chance to skip a beat for realism
      if (Math.random() > 0.4) {
        const randomGame = GAMES[Math.floor(Math.random() * GAMES.length)];
        const randomAmount = Math.floor(Math.random() * 5000) + 100;
        const randomPrice = Math.random() * 50 + 5; // $5 - $55
        
        const newMockOrder: Order = {
          id: `LIVE-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          date: new Date().toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' }),
          timestampRaw: Date.now(),
          gameName: randomGame.name,
          amount: `${randomAmount} ${randomGame.currencyName}`,
          price: randomPrice,
          status: 'Completed',
          paymentMethod: 'credit_card',
          userName: MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)],
          location: MOCK_LOCATIONS[Math.floor(Math.random() * MOCK_LOCATIONS.length)],
          mapLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MOCK_LOCATIONS[Math.floor(Math.random() * MOCK_LOCATIONS.length)])}`
        };

        setSimulatedOrders(prev => [newMockOrder, ...prev].slice(0, 50)); // Keep last 50
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Merge real orders with simulated ones for display
  const displayOrders = [...orders, ...simulatedOrders].sort((a, b) => b.timestampRaw - a.timestampRaw);

  // Calculate stats based on ALL orders (real + simulated) for the "Live" feel
  const totalRevenue = displayOrders.reduce((acc, order) => acc + order.price, 0);
  const totalOrders = displayOrders.length;
  const activeUsers = 120 + displayOrders.length; // Mock base + live activity
  
  // Dynamic Available Balance
  const availableBalance = Math.max(0, totalRevenue - withdrawnAmount);

  const handleWithdraw = () => {
    if (availableBalance <= 0) return;

    setIsWithdrawing(true);
    
    // Capture amount at start of transaction
    const amountToWithdraw = availableBalance;

    // Simulate API call
    setTimeout(() => {
      const newWithdrawal: Withdrawal = {
        id: `PO-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        date: new Date().toLocaleString(),
        amount: amountToWithdraw,
        status: 'Completed', // Instant withdrawal for PayPal
        method: 'PayPal (avinxp953@gmail.com)'
      };

      // Update state
      setWithdrawnAmount(prev => prev + amountToWithdraw);
      setWithdrawals(prev => [newWithdrawal, ...prev]);
      
      setIsWithdrawing(false);
      setShowWithdrawSuccess(true);
      
      // Reset success message
      setTimeout(() => setShowWithdrawSuccess(false), 4000);

    }, 2000);
  };

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `Just now`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return '1d+ ago';
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-6xl bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700 flex flex-col h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Sidebar / Mobile Header */}
        <div className="flex flex-col md:flex-row h-full">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-slate-900 border-r border-slate-700 flex flex-col">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xl">
                 <Building className="w-6 h-6" />
                 <span>Admin Panel</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Manage store & finances</p>
            </div>
            
            <nav className="flex-1 p-4 space-y-2">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'overview' ? 'bg-cyan-600/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              >
                <TrendingUp className="w-5 h-5" /> Overview
              </button>
              <button 
                onClick={() => setActiveTab('transactions')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'transactions' ? 'bg-cyan-600/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              >
                <Download className="w-5 h-5" /> Transactions
              </button>
              <button 
                onClick={() => setActiveTab('payouts')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'payouts' ? 'bg-cyan-600/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              >
                <Wallet className="w-5 h-5" /> Payouts
              </button>
            </nav>

            <div className="p-4 border-t border-slate-700">
               <button onClick={onClose} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm">
                 <X className="w-4 h-4" /> Close Dashboard
               </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto bg-slate-800/50 p-6 md:p-10">
            
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                   <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
                   <p className="text-slate-400">Welcome back, Admin. Real-time store activity.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                   <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                         <DollarSign className="w-24 h-24 text-green-500" />
                      </div>
                      <div className="relative z-10">
                         <p className="text-slate-400 font-medium mb-2">Total Revenue</p>
                         <h3 className="text-3xl font-bold text-white transition-all duration-300">{formatPrice(totalRevenue, currency)}</h3>
                         <div className="flex items-center gap-1 text-green-400 text-sm mt-2">
                            <ArrowUpRight className="w-4 h-4" /> Live
                         </div>
                      </div>
                   </div>

                   <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                         <Download className="w-24 h-24 text-blue-500" />
                      </div>
                      <div className="relative z-10">
                         <p className="text-slate-400 font-medium mb-2">Total Orders</p>
                         <h3 className="text-3xl font-bold text-white transition-all duration-300">{totalOrders}</h3>
                         <div className="flex items-center gap-1 text-blue-400 text-sm mt-2">
                            <ArrowUpRight className="w-4 h-4" /> Updating
                         </div>
                      </div>
                   </div>

                   <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                         <Users className="w-24 h-24 text-purple-500" />
                      </div>
                      <div className="relative z-10">
                         <p className="text-slate-400 font-medium mb-2">Active Users</p>
                         <h3 className="text-3xl font-bold text-white transition-all duration-300">{activeUsers}</h3>
                         <div className="flex items-center gap-1 text-purple-400 text-sm mt-2">
                            <ArrowUpRight className="w-4 h-4" /> Current
                         </div>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent Activity Chart Area (Mock) */}
                  <div className="lg:col-span-2 bg-slate-900 border border-slate-700 rounded-2xl p-6">
                     <h3 className="text-lg font-bold text-white mb-6">Revenue Analytics</h3>
                     <div className="h-64 flex items-end justify-between gap-2 px-4">
                        {[35, 45, 30, 60, 75, 50, 65, 80, 55, 90, 70, 85].map((h, i) => (
                          <div key={i} className="w-full bg-slate-800 rounded-t-lg relative group transition-all hover:bg-cyan-600/20">
                             <div 
                               style={{ height: `${h}%` }} 
                               className="absolute bottom-0 w-full bg-gradient-to-t from-cyan-600 to-blue-500 rounded-t-lg transition-all duration-500 group-hover:to-cyan-400"
                             />
                          </div>
                        ))}
                     </div>
                     <div className="flex justify-between mt-4 text-xs text-slate-500 uppercase tracking-wider">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                     </div>
                  </div>

                  {/* Live Activity Feed */}
                  <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 flex flex-col h-[400px]">
                     <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-cyan-400" /> Live Feed
                        </h3>
                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-400 uppercase tracking-wide animate-pulse">
                           <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Live
                        </span>
                     </div>
                     
                     <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                        {displayOrders.length === 0 ? (
                           <p className="text-slate-500 text-sm text-center py-10">Waiting for live transactions...</p>
                        ) : (
                           displayOrders.map((order, idx) => (
                              <div key={order.id} className={`flex gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 transition-all ${idx === 0 ? 'animate-in slide-in-from-top-2 ring-1 ring-cyan-500/30' : ''}`}>
                                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center flex-shrink-0 text-white font-bold shadow-lg shadow-cyan-500/20">
                                    {order.userName.charAt(0).toUpperCase()}
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                       <p className="text-white text-sm font-semibold truncate">{order.userName}</p>
                                       <span className="text-[10px] text-slate-400 whitespace-nowrap">{order.timestampRaw ? getTimeAgo(order.timestampRaw) : 'Now'}</span>
                                    </div>
                                    <p className="text-xs text-slate-300 truncate">Bought <span className="text-cyan-400 font-medium">{order.amount}</span></p>
                                    <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500">
                                       <MapPin className="w-3 h-3 text-slate-600" /> {order.location || 'Unknown Location'}
                                    </div>
                                 </div>
                              </div>
                           ))
                        )}
                     </div>
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="space-y-6">
                 <div>
                   <h2 className="text-2xl font-bold text-white">All Transactions</h2>
                   <p className="text-slate-400">Detailed record of real and simulated orders.</p>
                </div>
                
                <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
                   <table className="w-full text-left">
                     <thead>
                       <tr className="bg-slate-950 border-b border-slate-700">
                         <th className="p-4 text-xs font-bold text-slate-400 uppercase">Transaction ID</th>
                         <th className="p-4 text-xs font-bold text-slate-400 uppercase">User / Location</th>
                         <th className="p-4 text-xs font-bold text-slate-400 uppercase">Game</th>
                         <th className="p-4 text-xs font-bold text-slate-400 uppercase">Amount</th>
                         <th className="p-4 text-xs font-bold text-slate-400 uppercase">Price</th>
                         <th className="p-4 text-xs font-bold text-slate-400 uppercase">Status</th>
                         <th className="p-4 text-xs font-bold text-slate-400 uppercase">Actions</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-800">
                       {displayOrders.length === 0 ? (
                         <tr>
                           <td colSpan={7} className="p-8 text-center text-slate-500">
                             No transactions found.
                           </td>
                         </tr>
                       ) : (
                         displayOrders.map((order) => (
                           <tr key={order.id} className="hover:bg-slate-800/50 transition-colors">
                             <td className="p-4 font-mono text-xs text-slate-400">{order.id}</td>
                             <td className="p-4">
                                <div className="text-white font-medium text-sm">{order.userName}</div>
                                <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                   <MapPin className="w-3 h-3"/> 
                                   {order.location}
                                   {order.mapLink && (
                                     <a href={order.mapLink} target="_blank" rel="noopener noreferrer" className="ml-1 text-cyan-400 hover:text-cyan-300" title="View Exact Location">
                                       <ExternalLink className="w-3 h-3" />
                                     </a>
                                   )}
                                </div>
                             </td>
                             <td className="p-4 text-slate-300 text-sm">{order.gameName}</td>
                             <td className="p-4 text-slate-400 text-sm">{order.amount}</td>
                             <td className="p-4 text-green-400 font-bold">{formatPrice(order.price, currency)}</td>
                             <td className="p-4">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border ${
                                  order.status === 'Completed' 
                                    ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                    : order.status === 'Failed'
                                    ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                    : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                }`}>
                                   {order.status === 'Completed' ? <CheckCircle className="w-3 h-3" /> : order.status === 'Failed' ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3 animate-pulse" />}
                                   {order.status}
                                </span>
                             </td>
                             <td className="p-4">
                               {order.status === 'Pending' && (
                                 <div className="flex gap-2">
                                    <button 
                                      onClick={() => onUpdateStatus(order.id, 'Completed')}
                                      className="px-2 py-1 text-xs font-bold bg-green-600 hover:bg-green-500 text-white rounded transition-colors"
                                    >
                                      Complete
                                    </button>
                                    <button 
                                      onClick={() => onUpdateStatus(order.id, 'Failed')}
                                      className="px-2 py-1 text-xs font-bold bg-slate-700 hover:bg-rose-600 text-white rounded transition-colors"
                                    >
                                      Reject
                                    </button>
                                 </div>
                               )}
                             </td>
                           </tr>
                         ))
                       )}
                     </tbody>
                   </table>
                </div>
              </div>
            )}

            {activeTab === 'payouts' && (
              <div className="space-y-8">
                 <div>
                   <h2 className="text-2xl font-bold text-white">Payouts</h2>
                   <p className="text-slate-400">Withdraw your earnings to your connected accounts.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {/* Balance Card */}
                   <div className="bg-gradient-to-br from-blue-900 to-slate-900 border border-blue-800 p-8 rounded-2xl text-center md:text-left shadow-lg shadow-blue-900/20">
                      <p className="text-blue-300 font-medium mb-1">Available Balance</p>
                      <h3 className="text-5xl font-extrabold text-white mb-2">{formatPrice(availableBalance, currency)}</h3>
                      <p className="text-sm text-slate-400 mb-6">Total Lifetime Revenue: {formatPrice(totalRevenue, currency)}</p>
                      
                      {showWithdrawSuccess ? (
                        <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center gap-3 text-green-400 animate-in fade-in slide-in-from-bottom-2">
                           <CheckCircle className="w-5 h-5" />
                           <span className="font-bold">Withdrawal Initiated!</span>
                        </div>
                      ) : (
                        <button 
                          onClick={handleWithdraw}
                          disabled={availableBalance === 0 || isWithdrawing}
                          className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                          {isWithdrawing ? (
                            <>Processing...</>
                          ) : (
                            <>Withdraw Funds <ArrowUpRight className="w-5 h-5" /></>
                          )}
                        </button>
                      )}
                      {availableBalance === 0 && !showWithdrawSuccess && totalRevenue > 0 && (
                         <p className="text-sm text-slate-500 mt-3 flex items-center justify-center md:justify-start gap-2">
                           <AlertCircle className="w-4 h-4" /> No new funds available.
                         </p>
                      )}
                   </div>

                   {/* Linked Methods */}
                   <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
                      <h4 className="text-white font-bold mb-4">Linked Accounts</h4>
                      <div className="space-y-3">
                         {/* M-Pesa Replacement */}
                         <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded bg-green-900/30 flex items-center justify-center text-green-500">
                                  <Smartphone className="w-5 h-5" />
                               </div>
                               <div>
                                  <p className="text-white font-medium text-sm">M-Pesa</p>
                                  <p className="text-slate-500 text-xs">0769063728</p>
                               </div>
                            </div>
                         </div>
                         
                         <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded bg-blue-900/30 flex items-center justify-center text-blue-500">
                                  <Wallet className="w-5 h-5" />
                               </div>
                               <div>
                                  <p className="text-white font-medium text-sm">PayPal</p>
                                  <p className="text-slate-500 text-xs">avinxp953@gmail.com</p>
                               </div>
                            </div>
                            <span className="text-xs text-green-400 font-bold bg-green-900/20 px-2 py-1 rounded">Primary</span>
                         </div>
                         <button className="w-full py-3 border border-dashed border-slate-600 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium">
                            + Link New Method
                         </button>
                      </div>
                   </div>
                </div>

                {/* Recent Payouts Table */}
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-white mb-4">Withdrawal History</h3>
                  <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-950 border-b border-slate-700">
                          <th className="p-4 text-xs font-bold text-slate-400 uppercase">Payout ID</th>
                          <th className="p-4 text-xs font-bold text-slate-400 uppercase">Amount</th>
                          <th className="p-4 text-xs font-bold text-slate-400 uppercase">Method</th>
                          <th className="p-4 text-xs font-bold text-slate-400 uppercase">Date</th>
                          <th className="p-4 text-xs font-bold text-slate-400 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {withdrawals.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-500">
                              No recent withdrawals.
                            </td>
                          </tr>
                        ) : (
                          withdrawals.map((w) => (
                            <tr key={w.id} className="hover:bg-slate-800/50 transition-colors">
                              <td className="p-4 font-mono text-xs text-slate-400">{w.id}</td>
                              <td className="p-4 text-white font-bold">{formatPrice(w.amount, currency)}</td>
                              <td className="p-4 text-slate-300 text-sm flex items-center gap-2">
                                <CreditCard className="w-3 h-3 text-slate-500" />
                                {w.method}
                              </td>
                              <td className="p-4 text-slate-400 text-sm">{w.date}</td>
                              <td className="p-4">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border ${
                                  w.status === 'Completed' 
                                    ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                    : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                }`}>
                                  {w.status === 'Completed' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3 animate-pulse" />}
                                  {w.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
