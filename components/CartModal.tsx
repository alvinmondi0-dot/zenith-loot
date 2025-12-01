
import React, { useState } from 'react';
import { X, Trash2, CreditCard, ShoppingBag, ArrowRight, Wallet, Smartphone, CheckCircle, Mail, AlertCircle } from 'lucide-react';
import { CartItem, User, PaymentMethod } from '../types';
import { formatPrice, convertPrice } from '../utils';

interface CartModalProps {
  items: CartItem[];
  onClose: () => void;
  onRemove: (index: number) => void;
  onCheckout: (method: string, email: string, discount: number) => void;
  currency: string;
  user: User | null;
}

const CartModal: React.FC<CartModalProps> = ({ items, onClose, onRemove, onCheckout, currency, user }) => {
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('credit_card');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate Totals
  const subtotalUSD = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const subtotal = convertPrice(subtotalUSD, currency);
  
  // Admin Free Access
  const total = user?.isAdmin ? 0 : subtotal;

  const handleCheckoutClick = () => {
    if (items.length === 0) return;
    setStep('checkout');
  };

  const handleFinalize = () => {
    // Validate Email if guest
    if (!user && !email.trim()) {
      setEmailError('Email is required for receipt');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      onCheckout(selectedMethod, user?.email || email, 0); // 0 discount for now, promo logic could be added here
      setIsProcessing(false);
    }, 1500);
  };

  const renderPaymentMethod = (id: PaymentMethod, logoUrl: string, label: string) => {
    const isSelected = selectedMethod === id;
    return (
      <button
        onClick={() => setSelectedMethod(id)}
        className={`relative flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 ${
          isSelected
            ? 'border-cyan-500 bg-slate-800 shadow-lg shadow-cyan-900/20 z-10'
            : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800 opacity-70 hover:opacity-100'
        }`}
      >
        <div className="w-12 h-8 bg-white rounded flex items-center justify-center p-1 overflow-hidden flex-shrink-0">
          <img src={logoUrl} alt={label} className="w-full h-full object-contain" />
        </div>
        <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-400'}`}>
          {label}
        </span>
        {isSelected && (
          <div className="absolute top-0 right-0 p-1.5">
            <CheckCircle className="w-4 h-4 text-cyan-500 fill-cyan-500/20" />
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Your Cart ({items.length})</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700">
          
          {items.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500">
              <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
              <p>Your cart is empty.</p>
              <button 
                onClick={onClose}
                className="mt-4 text-cyan-400 font-bold hover:underline"
              >
                Browse Games
              </button>
            </div>
          ) : step === 'cart' ? (
            <div className="space-y-4">
               {items.map((item, index) => (
                 <div key={index} className="flex gap-3 bg-slate-800 rounded-xl p-3 border border-slate-700">
                    <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-600 flex-shrink-0">
                       <span className="text-xs font-bold text-slate-400 text-center px-1">
                         {item.gameName.split(' ')[0]}
                       </span>
                    </div>
                    <div className="flex-1 min-w-0">
                       <h4 className="text-white font-bold text-sm truncate">{item.package_name || item.gameName}</h4>
                       <p className="text-xs text-slate-400">{item.amount} {item.currency}</p>
                       <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">
                             ID: {item.recipientId}
                          </span>
                          <span className="text-cyan-400 font-bold text-sm">
                            {user?.isAdmin ? 'FREE' : formatPrice(convertPrice(item.price, currency) * item.quantity, currency)}
                          </span>
                       </div>
                    </div>
                    <div className="flex flex-col justify-between items-end">
                       <button 
                         onClick={() => onRemove(index)}
                         className="text-slate-500 hover:text-rose-500 transition-colors"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                       <span className="text-xs font-bold text-slate-400">x{item.quantity}</span>
                    </div>
                 </div>
               ))}
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4">
               <div className="text-center">
                  <h3 className="text-white font-bold text-lg">Checkout Details</h3>
                  <p className="text-slate-400 text-sm">Review total and select payment</p>
               </div>

               {/* Email for Guest */}
               {!user && (
                 <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Email Receipt</label>
                    <div className="relative">
                       <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                       <input 
                         type="email" 
                         value={email}
                         onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                         placeholder="name@example.com"
                         className={`w-full bg-slate-800 border ${emailError ? 'border-rose-500' : 'border-slate-700'} rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500`}
                       />
                    </div>
                    {emailError && <p className="text-rose-500 text-xs mt-1">{emailError}</p>}
                 </div>
               )}

               {/* Payment Methods */}
               <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase">Select Payment Method</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {renderPaymentMethod('credit_card', 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg', 'Credit Card')}
                    {renderPaymentMethod('paypal', 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg', 'PayPal')}
                    {renderPaymentMethod('mpesa', 'https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg', 'M-Pesa')}
                    {renderPaymentMethod('airtel_money', 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Airtel_logo_2010.svg', 'Airtel Money')}
                  </div>
               </div>
            </div>
          )}

        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 bg-slate-800 border-t border-slate-700">
             <div className="flex justify-between items-end mb-4">
                <span className="text-slate-400 font-medium text-sm">Total</span>
                <span className="text-2xl font-extrabold text-white">
                  {user?.isAdmin ? 'FREE' : formatPrice(total, currency)}
                </span>
             </div>
             
             {step === 'cart' ? (
               <button 
                 onClick={handleCheckoutClick}
                 className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
               >
                 Proceed to Checkout <ArrowRight className="w-4 h-4" />
               </button>
             ) : (
               <div className="flex gap-3">
                 <button 
                   onClick={() => setStep('cart')}
                   disabled={isProcessing}
                   className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors"
                 >
                   Back
                 </button>
                 <button 
                   onClick={handleFinalize}
                   disabled={isProcessing}
                   className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 disabled:opacity-50"
                 >
                   {isProcessing ? 'Processing...' : 'Complete Payment'}
                 </button>
               </div>
             )}
          </div>
        )}

      </div>
    </div>
  );
};

export default CartModal;
