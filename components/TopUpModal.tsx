
import React, { useState, useEffect } from 'react';
import { Game, Package, PaymentMethod, User, Review } from '../types';
import { PACKAGES } from '../constants';
import { X, Check, Star, ArrowRight, ArrowLeft, Tag, Zap, Shield, Minus, Plus, AlertCircle, Loader2, CheckCircle2, Mail, Gift, UserCheck, Terminal, Copy, RefreshCcw, Smartphone } from 'lucide-react';
import { formatPrice, convertPrice } from '../utils';
import GameReviews from './GameReviews';
import { verifyPlayerId, processGameTopUp } from '../services/fulfillmentService';

interface TopUpModalProps {
  game: Game | null;
  initialPackageId: string | null;
  onClose: () => void;
  onSuccess: (game: Game, pkg: Package, amount: number, method: string, quantity: number, guestEmail: string, status: 'Completed' | 'Pending') => void;
  onAddToCart: (game: Game, pkg: Package, quantity: number, recipientId: string) => void;
  currency: string;
  user: User | null;
  reviews: Review[];
  onAddReview: (gameId: string, rating: number, comment: string) => void;
  onLoginRequest: () => void;
}

const TopUpModal: React.FC<TopUpModalProps> = ({ 
  game, initialPackageId, onClose, onSuccess, onAddToCart, currency, user, 
  reviews, onAddReview, onLoginRequest 
}) => {
  const [activeTab, setActiveTab] = useState<'topup' | 'reviews'>('topup');
  const [step, setStep] = useState(1);
  const [playerId, setPlayerId] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  // Verification State
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedNickname, setVerifiedNickname] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [transactionId, setTransactionId] = useState<string>('');
  
  // Payment Authorization Simulation
  const [waitingForAuth, setWaitingForAuth] = useState(false);

  // Initialize with passed props
  useEffect(() => {
    if (initialPackageId) {
      setSelectedPackageId(initialPackageId);
    }
  }, [initialPackageId]);

  // Reset phone error when method changes
  useEffect(() => {
    setPhoneError('');
    setPhoneNumber('');
  }, [selectedPaymentMethod]);

  if (!game) return null;

  const isVoucher = game.category === 'Voucher';
  const gameReviews = reviews.filter(r => r.gameId === game.id);

  // Use game-specific packages if available, otherwise generic
  const packages = game.packages || PACKAGES;
  const selectedPackage = packages.find(p => p.id === selectedPackageId);

  // Discount Logic
  const getDiscountPercent = (qty: number) => {
    if (qty >= 6) return 0.10; // 10% off
    if (qty >= 3) return 0.05; // 5% off
    return 0;
  };

  const discountPercent = getDiscountPercent(quantity);

  // Price Calculations
  const basePriceUSD = selectedPackage ? selectedPackage.price : 0;
  const convertedUnitPrice = convertPrice(basePriceUSD, currency);
  
  const subtotal = convertedUnitPrice * quantity;
  const quantityDiscountAmount = subtotal * discountPercent;
  let total = subtotal - quantityDiscountAmount;
  let promoDiscountAmount = 0;

  // Admin Override
  if (user?.isAdmin) {
    total = 0;
  } else if (promoCode.trim().toLowerCase() === 'alvin') {
    // 40% Discount logic
    promoDiscountAmount = total * 0.40;
    total = total - promoDiscountAmount;
  }

  const validatePhoneNumber = (number: string) => {
    const phoneRegex = /^(?:254|\+254|0)?([17][0-9]{8})$/;
    
    if (!number) {
      setPhoneError('');
      return false;
    }
    
    if (!phoneRegex.test(number)) {
      setPhoneError('Invalid phone number format. Use 07XX... or 01XX...');
      return false;
    }
    
    setPhoneError('');
    return true;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, ''); 
    setPhoneNumber(val);
    if (val.length > 3) validatePhoneNumber(val);
  };

  const handleVerifyId = async () => {
    if (!playerId) return;
    setIsVerifying(true);
    setVerificationError(null);
    setVerifiedNickname(null);

    const result = await verifyPlayerId(game, playerId);
    setIsVerifying(false);

    if (result.isValid && result.nickname) {
      setVerifiedNickname(result.nickname);
    } else {
      setVerificationError(result.error || 'Player not found');
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (isVoucher) {
        if (!email.trim() && !user) return;
      } else {
        if (!playerId.trim()) return;
        if (!user && !email.trim()) return;
        
        // Auto-verify if not done yet
        if (!verifiedNickname && !isVerifying) {
          handleVerifyId();
          // Don't proceed yet, let user see verification
          return; 
        }
      }

      if (initialPackageId && selectedPackageId) {
        setStep(3);
      } else {
        setStep(2);
      }
    } else if (step === 2 && selectedPackageId) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step === 3) {
       setStep(2);
    } else {
       setStep(step - 1);
    }
  };
  
  const handleResetForNewPurchase = () => {
    // Go back to package selection (Step 2)
    // Keep the PlayerID and Verification intact for convenience
    setStep(2);
    setSelectedPackageId(null);
    setQuantity(1);
    setTransactionId('');
    setIsProcessing(false);
    setWaitingForAuth(false);
  };

  const handlePayment = async () => {
    if (!selectedPackage) return;
    
    if (selectedPaymentMethod === 'mpesa') {
      if (!validatePhoneNumber(phoneNumber)) {
        setPhoneError('Please enter a valid phone number to proceed.');
        return;
      }
    }

    setIsProcessing(true);
    
    // Simulate Authorization Prompt (STK Push or Gateway Redirect)
    setWaitingForAuth(true);
    if (selectedPaymentMethod === 'mpesa') {
       setProcessingStage('Sending M-Pesa Prompt...');
    } else {
       setProcessingStage('Redirecting to Secure Gateway...');
    }

    // Wait for user "action" simulation (e.g. entering PIN)
    setTimeout(() => {
       setWaitingForAuth(false);
       setProcessingStage('Secure Handshake...');

       // Simulate Fulfillment Steps
       setTimeout(() => setProcessingStage('Verifying Payment...'), 1000);
       setTimeout(() => setProcessingStage('Connecting to Game Server...'), 2500);
       setTimeout(async () => {
         setProcessingStage('Injecting Currency...');
         
         // Call Fulfillment Service
         const result = await processGameTopUp(game.id, selectedPackage.id, playerId);
         
         if (result.success) {
           setProcessingStage('Success!');
           if (result.transactionId) setTransactionId(result.transactionId);
           
           // Trigger App-level order creation (sends email internally)
           onSuccess(game, selectedPackage, total, selectedPaymentMethod, quantity, email, 'Completed');
           
           setTimeout(() => {
             setIsProcessing(false);
             setStep(4); // Move to success step instead of closing
           }, 800);
         } else {
           setProcessingStage('Failed. Contact Support.');
           setIsProcessing(false);
         }
       }, 4500);
    }, 6000); // 6 Seconds wait for "PIN entry"
  };

  const handleAddToCartClick = () => {
    if (!game || !selectedPackage) return;
    const recipient = isVoucher ? email : playerId;
    
    if (isVoucher && !user && !email) return;
    if (!isVoucher && !playerId) return;

    onAddToCart(game, selectedPackage, quantity, recipient);
    onClose();
  };

  const handleAddReview = (rating: number, comment: string) => {
    onAddReview(game.id, rating, comment);
  };

  const renderPaymentMethod = (id: PaymentMethod, logoUrl: string, label: string) => {
    const isSelected = selectedPaymentMethod === id;
    return (
      <button
        onClick={() => setSelectedPaymentMethod(id)}
        className={`relative flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 ${
          isSelected
            ? 'border-cyan-500 bg-slate-800 shadow-lg shadow-cyan-900/20 scale-[1.02] z-10'
            : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800 opacity-70 hover:opacity-100'
        }`}
      >
        <div className="w-14 h-9 bg-white rounded-lg flex items-center justify-center p-1.5 overflow-hidden flex-shrink-0 shadow-sm">
          <img src={logoUrl} alt={label} className="w-full h-full object-contain" />
        </div>
        <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-400'}`}>
          {label}
        </span>
        {isSelected && (
          <div className="absolute top-0 right-0 p-1.5">
            <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center shadow-md">
              <Check className="w-3 h-3 text-white stroke-[3]" />
            </div>
          </div>
        )}
      </button>
    );
  };

  const isPayDisabled = () => {
    if (step === 1) {
      if (isVoucher) {
        if (!user && !email) return true;
        if (user && !user.email && !email) return true;
      } else {
        if (!playerId) return true;
        if (!user && !email) return true;
      }
    } 
    if (step === 2 && !selectedPackageId) return true;
    if (isProcessing) return true;
    if (step === 3 && selectedPaymentMethod === 'mpesa' && (!phoneNumber || !!phoneError)) return true;
    return false;
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" 
        onClick={step === 4 ? onClose : undefined}
      />
      
      <div className="relative w-full max-w-lg bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-800/50 p-4 border-b border-slate-700">
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-600">
                    <img src={game.image} alt={game.name} className="w-full h-full object-cover" />
                 </div>
                 <div>
                    <h3 className="text-white font-bold text-sm leading-tight">{game.name}</h3>
                    <p className="text-xs text-slate-400">{isVoucher ? 'Digital Code' : 'Instant Top-Up'}</p>
                 </div>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
           </div>
           
           {/* Tabs - Hide if in success step */}
           {step !== 4 && (
             <div className="flex gap-4">
               <button
                 onClick={() => setActiveTab('topup')}
                 className={`flex-1 pb-2 text-sm font-bold border-b-2 transition-colors ${
                   activeTab === 'topup' 
                     ? 'text-cyan-400 border-cyan-400' 
                     : 'text-slate-500 border-transparent hover:text-slate-300'
                 }`}
               >
                 Top Up
               </button>
               <button
                 onClick={() => setActiveTab('reviews')}
                 className={`flex-1 pb-2 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${
                   activeTab === 'reviews' 
                     ? 'text-cyan-400 border-cyan-400' 
                     : 'text-slate-500 border-transparent hover:text-slate-300'
                 }`}
               >
                 Reviews <span className="bg-slate-800 px-1.5 py-0.5 rounded-full text-xs">{gameReviews.length}</span>
               </button>
             </div>
           )}
        </div>

        {/* TOP UP CONTENT */}
        {activeTab === 'topup' && (
          <>
            {step !== 4 && (
              <div className="h-1 w-full bg-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700 relative">
              
              {/* STEP 1: PLAYER ID OR EMAIL */}
              {step === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                   <div className="text-center">
                      <h2 className="text-xl font-bold text-white mb-2">{isVoucher ? 'Recipient Details' : 'Enter Player Details'}</h2>
                      <p className="text-slate-400 text-sm">
                        {isVoucher 
                          ? 'We need an email address to send the digital code.' 
                          : 'Enter your ID to verify account before purchase.'}
                      </p>
                   </div>

                   <div className="space-y-4">
                      {!isVoucher && (
                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Player ID / UID</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={playerId}
                              onChange={(e) => {
                                setPlayerId(e.target.value);
                                setVerifiedNickname(null); // Reset verification on change
                                setVerificationError(null);
                              }}
                              placeholder="e.g. 1234567890"
                              className={`flex-1 bg-slate-800 border ${verificationError ? 'border-rose-500' : 'border-slate-700'} rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all placeholder:text-slate-600 font-mono`}
                            />
                            <button
                              onClick={handleVerifyId}
                              disabled={!playerId || isVerifying}
                              className="px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
                            >
                              {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify'}
                            </button>
                          </div>
                          
                          {/* Verification Result */}
                          {verifiedNickname && (
                             <div className="mt-2 flex items-center gap-2 text-green-400 bg-green-900/10 p-2 rounded-lg border border-green-500/20 animate-in fade-in">
                               <UserCheck className="w-4 h-4" />
                               <span className="text-sm font-medium">Username: <strong>{verifiedNickname}</strong></span>
                             </div>
                          )}
                          
                          {verificationError && (
                             <div className="mt-2 flex items-center gap-2 text-rose-400 bg-rose-900/10 p-2 rounded-lg border border-rose-500/20 animate-in fade-in">
                               <AlertCircle className="w-4 h-4" />
                               <span className="text-sm">{verificationError}</span>
                             </div>
                          )}
                        </div>
                      )}
                      
                      {(!user || isVoucher) && (
                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">
                            {isVoucher ? 'Email for Code Delivery' : 'Email Address'}
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input 
                              type="email" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder={user ? user.email : "name@example.com"}
                              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all placeholder:text-slate-600"
                            />
                          </div>
                        </div>
                      )}
                   </div>
                </div>
              )}

              {/* STEP 2: SELECT PACKAGE */}
              {step === 2 && (
                 <div className="space-y-6 animate-in slide-in-from-right-4">
                    <div className="text-center">
                      <h2 className="text-xl font-bold text-white mb-2">Select {isVoucher ? 'Gift Card' : 'Package'}</h2>
                      <p className="text-slate-400 text-sm">Choose the amount you want to top up.</p>
                   </div>

                   <div className="grid grid-cols-2 gap-3">
                      {packages.map((pkg) => {
                        const isSelected = selectedPackageId === pkg.id;
                        const price = user?.isAdmin ? 0 : convertPrice(pkg.price, currency);
                        
                        return (
                          <button
                            key={pkg.id}
                            onClick={() => { setSelectedPackageId(pkg.id); setQuantity(1); }}
                            className={`relative p-3 rounded-xl border-2 text-left transition-all group ${
                              isSelected 
                                ? 'border-cyan-500 bg-slate-800 shadow-lg shadow-cyan-900/20' 
                                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'
                            }`}
                          >
                            {pkg.popular && (
                              <div className="absolute -top-2.5 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                                 <Star className="w-3 h-3 fill-white" /> BEST
                              </div>
                            )}
                            
                            {pkg.name && (
                               <div className="flex items-center gap-1 mb-1 text-xs font-bold text-purple-400">
                                  <Gift className="w-3 h-3" /> {pkg.name}
                               </div>
                            )}

                            <div className="flex items-baseline gap-1 mb-1">
                               <span className={`text-lg font-extrabold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                                 {pkg.amount}
                               </span>
                               <span className="text-xs font-medium text-slate-500">{game.currencyName}</span>
                            </div>
                            
                            {pkg.bonus > 0 && (
                              <div className="text-[10px] text-green-400 font-bold mb-2">
                                +{pkg.bonus} Bonus
                              </div>
                            )}

                            <div className={`text-sm font-bold ${isSelected ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'}`}>
                               {user?.isAdmin ? 'FREE' : formatPrice(price, currency)}
                            </div>
                          </button>
                        );
                      })}
                   </div>

                   {selectedPackageId && (
                     <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-center justify-between mb-2">
                           <span className="text-sm font-medium text-slate-300">Quantity</span>
                           <div className="flex items-center gap-3 bg-slate-900 rounded-lg p-1 border border-slate-700">
                              <button 
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="text-white font-bold w-4 text-center">{quantity}</span>
                              <button 
                                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                           </div>
                        </div>
                        {discountPercent > 0 && (
                           <div className="text-xs text-orange-400 flex items-center gap-1.5 font-medium bg-orange-500/10 p-2 rounded-lg border border-orange-500/20">
                              <Zap className="w-3 h-3 fill-orange-400" />
                              Bulk Discount: {discountPercent * 100}% off applied!
                           </div>
                        )}
                     </div>
                   )}
                 </div>
              )}

              {/* STEP 3: PAYMENT */}
              {step === 3 && selectedPackage && (
                 <div className="space-y-6 animate-in slide-in-from-right-4">
                    {isProcessing ? (
                      <div className="flex flex-col items-center justify-center py-10 space-y-6">
                        <div className="relative">
                          <div className="w-20 h-20 rounded-full border-4 border-slate-700 border-t-cyan-500 animate-spin"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            {waitingForAuth ? (
                              <Smartphone className="w-8 h-8 text-cyan-400 animate-pulse" />
                            ) : (
                              <Zap className="w-8 h-8 text-cyan-400 fill-cyan-400/20 animate-pulse" />
                            )}
                          </div>
                        </div>
                        <div className="text-center space-y-2">
                          <h3 className="text-xl font-bold text-white">
                            {waitingForAuth ? 'Authorize Transaction' : 'Processing Order'}
                          </h3>
                          <p className="text-cyan-400 font-mono text-sm">{processingStage}</p>
                          {waitingForAuth && selectedPaymentMethod === 'mpesa' && (
                            <p className="text-yellow-400 text-xs animate-pulse">
                              Please check your phone ({phoneNumber}) and enter your PIN.
                            </p>
                          )}
                        </div>
                        
                        {/* Terminal Log */}
                        <div className="w-full bg-black/50 rounded-lg border border-slate-700 p-3 font-mono text-xs text-slate-400 space-y-1">
                          <div className="flex items-center gap-2"><Terminal className="w-3 h-3" /> Initializing secure connection...</div>
                          <div className="flex items-center gap-2 text-green-400"><Check className="w-3 h-3" /> Player ID Verified</div>
                          {processingStage.includes('Injecting') && <div className="flex items-center gap-2 text-yellow-400"><Loader2 className="w-3 h-3 animate-spin" /> Connecting to Game API...</div>}
                        </div>
                      </div>
                    ) : (
                    <>
                    <div className="text-center">
                      <h2 className="text-xl font-bold text-white mb-2">Checkout</h2>
                      <p className="text-slate-400 text-sm">Select a payment method to complete purchase.</p>
                   </div>
                   
                   <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-slate-400 text-sm">Item</span>
                         <span className="text-white font-medium">
                            {quantity}x {selectedPackage.name || `${selectedPackage.amount} ${game.currencyName}`}
                         </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-slate-400 text-sm">Price</span>
                         <span className="text-slate-300">{user?.isAdmin ? 'FREE' : formatPrice(subtotal, currency)}</span>
                      </div>
                      {quantityDiscountAmount > 0 && !user?.isAdmin && (
                        <div className="flex justify-between items-center mb-2 text-green-400 text-sm">
                           <span>Bulk Discount ({discountPercent * 100}%)</span>
                           <span>-{formatPrice(quantityDiscountAmount, currency)}</span>
                        </div>
                      )}
                      {promoDiscountAmount > 0 && !user?.isAdmin && (
                        <div className="flex justify-between items-center mb-2 text-green-400 text-sm">
                           <span>Promo Code (ALVIN)</span>
                           <span>-{formatPrice(promoDiscountAmount, currency)}</span>
                        </div>
                      )}

                      <div className="h-px bg-slate-700 my-2" />
                      <div className="flex justify-between items-center">
                         <span className="text-slate-300 font-bold">Total</span>
                         <span className="text-xl font-extrabold text-white">
                            {user?.isAdmin ? (
                               <span className="flex items-center gap-2 text-green-400">
                                 FREE <span className="text-[10px] bg-green-500/20 px-1.5 rounded text-green-300 border border-green-500/30">ADMIN</span>
                               </span>
                            ) : formatPrice(total, currency)}
                         </span>
                      </div>
                   </div>

                   {/* Promo Code */}
                   {!user?.isAdmin && (
                     <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                          type="text" 
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Promo Code (Optional)"
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-1 focus:ring-cyan-500 focus:outline-none text-sm uppercase"
                        />
                        {promoCode.toLowerCase() === 'alvin' && (
                           <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 text-xs font-bold flex items-center gap-1">
                              <Check className="w-3 h-3" /> 40% OFF
                           </span>
                        )}
                     </div>
                   )}

                   <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Payment Method</h3>
                        <span className="text-xs text-cyan-400 font-medium animate-pulse">
                          {selectedPaymentMethod.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())} Selected
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {renderPaymentMethod('credit_card', 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg', 'Visa')}
                        {renderPaymentMethod('paypal', 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg', 'PayPal')}
                        {renderPaymentMethod('mpesa', 'https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg', 'M-Pesa')}
                        {renderPaymentMethod('google_pay', 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg', 'Google Pay')}
                        {renderPaymentMethod('apple_pay', 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg', 'Apple Pay')}
                      </div>
                      
                      <div className="mt-2 p-3 bg-cyan-900/10 border border-cyan-500/20 rounded-lg flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-cyan-100">
                            Paying via <span className="font-bold text-cyan-400 capitalize">{selectedPaymentMethod.replace(/_/g, ' ')}</span>
                          </p>
                          <p className="text-[10px] text-slate-400">Secure transaction encrypted by SSL.</p>
                        </div>
                      </div>
                   </div>
                   
                   {selectedPaymentMethod === 'mpesa' && (
                     <div className="animate-in slide-in-from-top-2 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                        <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">
                          M-Pesa Number
                        </label>
                        <div className="relative">
                          <input 
                            type="tel" 
                            value={phoneNumber}
                            onChange={handlePhoneChange}
                            placeholder="07XX XXX XXX"
                            className={`w-full bg-slate-900 border ${phoneError ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:ring-cyan-500'} rounded-xl px-4 py-3 text-white text-lg tracking-wide focus:ring-2 focus:outline-none transition-all font-mono`}
                          />
                          {!phoneError && phoneNumber.length >= 10 && (
                            <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
                          )}
                        </div>
                        {phoneError ? (
                          <div className="flex items-center gap-1.5 mt-2 text-rose-400 text-xs font-medium">
                            <AlertCircle className="w-3.5 h-3.5" /> {phoneError}
                          </div>
                        ) : (
                          <p className="text-[10px] text-slate-500 mt-2">
                            Enter the number that will receive the payment prompt.
                          </p>
                        )}
                     </div>
                   )}
                   </>
                   )}
                 </div>
              )}

              {/* STEP 4: SUCCESS CONFIRMATION */}
              {step === 4 && (
                <div className="h-full flex flex-col items-center justify-center space-y-8 animate-in zoom-in-95 py-6">
                   <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center border-4 border-green-500 shadow-xl shadow-green-900/40">
                      <Check className="w-12 h-12 text-green-400 stroke-[3]" />
                   </div>
                   
                   <div className="text-center space-y-2">
                      <h2 className="text-3xl font-bold text-white">Purchase Successful!</h2>
                      <p className="text-slate-400 max-w-xs mx-auto">
                         Your transaction has been completed and your items have been delivered.
                      </p>
                   </div>

                   <div className="w-full max-w-sm bg-slate-800 rounded-xl border border-slate-700 p-4 space-y-4">
                      {/* Email Confirmation */}
                      <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                         <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                         <div className="text-sm">
                            <p className="text-slate-300">Confirmation sent to:</p>
                            <p className="text-white font-bold">{email || user?.email}</p>
                         </div>
                      </div>

                      {/* Transaction ID */}
                      <div className="space-y-1">
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Transaction Reference</label>
                         <div className="flex items-center justify-between bg-slate-900 p-3 rounded-lg border border-slate-700/50 font-mono text-sm text-cyan-400">
                            {transactionId || 'PROCESSING...'}
                            <Copy className="w-4 h-4 text-slate-600 cursor-pointer hover:text-white" />
                         </div>
                      </div>
                   </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            {!isProcessing && (
            <div className="p-4 bg-slate-800/50 border-t border-slate-700 flex gap-3">
              {step > 1 && step < 4 && (
                <button 
                  onClick={handleBack}
                  disabled={isProcessing}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-colors disabled:opacity-50"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}

              {step >= 2 && step < 4 && !user?.isAdmin && (
                  <button
                    onClick={handleAddToCartClick}
                    disabled={isPayDisabled() && step === 3}
                    className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Add to Cart"
                  >
                     <Plus className="w-5 h-5" />
                  </button>
              )}
              
              {step < 4 ? (
                <button 
                  onClick={step === 3 ? handlePayment : handleNext}
                  disabled={isPayDisabled()}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 font-bold rounded-xl transition-all shadow-lg text-white ${
                    isPayDisabled()
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-cyan-500/25'
                  }`}
                >
                  {step === 3 ? (
                      <>
                        Pay {user?.isAdmin ? 'FREE' : formatPrice(total, currency)} <Shield className="w-5 h-5 ml-1" />
                      </>
                  ) : (
                      <>
                        Next Step <ArrowRight className="w-5 h-5" />
                      </>
                  )}
                </button>
              ) : (
                <div className="w-full flex gap-3">
                  <button 
                    onClick={handleResetForNewPurchase}
                    className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCcw className="w-4 h-4" /> Buy Another
                  </button>
                  <button 
                    onClick={onClose}
                    className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-green-500/20"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
            )}
          </>
        )}

        {/* REVIEWS CONTENT */}
        {activeTab === 'reviews' && (
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700">
             <GameReviews 
               reviews={gameReviews} 
               user={user} 
               onAddReview={handleAddReview} 
               onLoginRequest={onLoginRequest}
             />
          </div>
        )}

      </div>
    </div>
  );
};

export default TopUpModal;
