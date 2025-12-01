
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import GameCard from './components/GameCard';
import TopUpModal from './components/TopUpModal';
import LoginModal from './components/LoginModal';
import ProfileModal from './components/ProfileModal';
import AdminDashboard from './components/AdminDashboard';
import SupportChat from './components/SupportChat';
import CartModal from './components/CartModal';
import { GAMES, PACKAGES, VOUCHERS, INITIAL_REVIEWS } from './constants';
import { Game, Package, User, Order, Review, CartItem } from './types';
import { Facebook, Twitter, Instagram, Mail, Gift } from 'lucide-react';
import { detectUserCurrency } from './utils';
import { sendOrderConfirmationEmail } from './services/emailService';

const App: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [preSelectedPackageId, setPreSelectedPackageId] = useState<string | null>(null);
  
  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // User State
  const [user, setUser] = useState<User | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  
  // Orders State
  const [allOrders, setAllOrders] = useState<Order[]>([]);

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  
  // Currency State
  const [currency, setCurrency] = useState('USD');

  // Filter & Search State
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = ['All', 'FPS', 'MOBA', 'RPG', 'Strategy', 'Sports', 'Racing', 'Sandbox', 'Adventure', 'Puzzle'];

  // Initialize: Detect Currency & Check Local Storage for User
  useEffect(() => {
    const detected = detectUserCurrency();
    setCurrency(detected);

    // Check for "Remember Me" session
    const storedUser = localStorage.getItem('zenith_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.id) {
          setUser(parsedUser);
        }
      } catch (e) {
        console.error("Failed to restore session", e);
        localStorage.removeItem('zenith_user');
      }
    }
  }, []);

  const handleGameClick = (game: Game) => {
    setSelectedGame(game);
    setPreSelectedPackageId(null); // Regular flow
  };

  const handleBuyNow = (e: React.MouseEvent, game: Game) => {
    e.stopPropagation();
    // Find the popular package to pre-select
    // Use game specific packages if available, otherwise generic
    const availablePkgs = game.packages || PACKAGES;
    const popularPkg = availablePkgs.find(p => p.popular) || availablePkgs[1]; // Default to second if no popular
    setSelectedGame(game);
    setPreSelectedPackageId(popularPkg.id);
  };

  const handleToggleWishlist = (e: React.MouseEvent, game: Game) => {
    e.stopPropagation();
    if (!user) {
      setIsLoginOpen(true);
      return;
    }
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(game.id)) {
        next.delete(game.id);
      } else {
        next.add(game.id);
      }
      return next;
    });
  };

  const handleAddReview = (gameId: string, rating: number, comment: string) => {
    if (!user) return;
    
    const newReview: Review = {
      id: `new_${Date.now()}`,
      gameId,
      userName: user.name,
      rating,
      comment,
      date: 'Just now'
    };
    
    setReviews(prev => [newReview, ...prev]);
  };

  // --- CART FUNCTIONS ---

  const handleAddToCart = (game: Game, pkg: Package, quantity: number, recipientId: string) => {
     const newItem: CartItem = {
       gameId: game.id,
       packageId: pkg.id,
       gameName: game.name,
       amount: pkg.amount,
       price: pkg.price,
       currency: game.currencyName,
       quantity,
       recipientId,
       package_name: pkg.name
     };
     
     setCartItems(prev => [...prev, newItem]);
     // We don't close the modal or switch views, just maybe show a toast (omitted for brevity)
     console.log("Added to cart:", newItem);
  };

  const handleRemoveFromCart = (index: number) => {
     setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleCheckout = (method: string, email: string, discount: number) => {
    // Process all items in cart
    cartItems.forEach(item => {
       const game = GAMES.find(g => g.id === item.gameId) || VOUCHERS.find(v => v.id === item.gameId);
       if (!game) return;

       // Calculate price with discount
       const itemTotal = item.price * item.quantity;
       const discountedTotal = itemTotal - (itemTotal * discount); // Apply promo discount
       
       createOrder(
         game, 
         item.package_name || `${item.amount} ${item.currency}`, 
         discountedTotal, 
         method, 
         item.quantity, 
         email
       );
    });

    setCartItems([]);
    setIsCartOpen(false);
  };

  // --- ORDER CREATION (Single & Batch) ---

  const handleOrderCreation = (game: Game, pkg: Package, amount: number, method: string, quantity: number, guestEmail: string) => {
     // Wrapper for single buy now flow
     const itemName = pkg.name || `${pkg.amount} ${game.currencyName}`;
     createOrder(game, itemName, amount, method, quantity, guestEmail);
  };

  const createOrder = (game: Game, itemName: string, finalPrice: number, method: string, quantity: number, emailToSend: string) => {
    // Generate a realistic Transaction ID
    const txnId = `TXN-${Math.random().toString(36).substr(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Create detailed timestamp
    const now = new Date();
    const timestampStr = now.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const itemDescription = quantity > 1 
      ? `${quantity} x [${itemName}]` 
      : itemName;

    // Determine Location based on currency/random
    const locations = [
      'Nairobi, Kenya', 'Mombasa, Kenya', 'Lagos, Nigeria', 'Accra, Ghana', 
      'London, UK', 'New York, USA', 'Mumbai, India', 'Berlin, Germany', 
      'Cape Town, South Africa', 'Dubai, UAE'
    ];
    let userLocation = locations[Math.floor(Math.random() * locations.length)];
    if (currency === 'KES') userLocation = 'Nairobi, Kenya';
    if (currency === 'NGN') userLocation = 'Lagos, Nigeria';
    if (currency === 'INR') userLocation = 'Mumbai, India';
    if (currency === 'ZAR') userLocation = 'Johannesburg, SA';
    if (currency === 'GHS') userLocation = 'Accra, Ghana';

    // Determine Name
    const orderUserName = user ? user.name : `Guest-${Math.floor(Math.random() * 1000)}`;

    // Create mock order
    const newOrder: Order = {
      id: txnId,
      date: timestampStr,
      timestampRaw: now.getTime(),
      gameName: game.name,
      amount: itemDescription,
      price: finalPrice,
      status: 'Completed',
      paymentMethod: method,
      userName: orderUserName,
      location: userLocation
    };

    // Add to global orders list (persists for admin view)
    setAllOrders(prev => [newOrder, ...prev]);
    
    console.log(`Order ${txnId} created successfully`);

    // Send Confirmation Email
    if (emailToSend) {
      sendOrderConfirmationEmail(emailToSend, newOrder);
    }
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    // Clear session storage
    localStorage.removeItem('zenith_user');
    
    setUser(null);
    setIsProfileOpen(false);
    setIsAdminDashboardOpen(false);
    setWishlist(new Set());
    setCartItems([]);
  };

  // Filter Logic
  const filteredGames = GAMES.filter(game => {
    const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // Calculate reviews metadata for passing to GameCard
  const getReviewStats = (gameId: string) => {
    const gameReviews = reviews.filter(r => r.gameId === gameId);
    if (gameReviews.length === 0) return { rating: 0, count: 0 };
    const avg = gameReviews.reduce((acc, r) => acc + r.rating, 0) / gameReviews.length;
    return { rating: avg, count: gameReviews.length };
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Navbar 
        cartCount={cartItems.length} 
        user={user}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAdmin={() => setIsAdminDashboardOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        currency={currency}
        onCurrencyChange={setCurrency}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
      />
      
      <main className="flex-grow">
        <Hero />
        
        {/* Games Grid Section */}
        <div id="games" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Trending Games</h2>
              <p className="text-slate-400">Select a game to start your top-up</p>
            </div>
            
            {/* Filter Chips */}
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all whitespace-nowrap ${
                    activeCategory === cat 
                      ? 'bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-500/25' 
                      : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredGames.length > 0 ? (
              filteredGames.map((game) => {
                const { rating } = getReviewStats(game.id);
                return (
                  <GameCard 
                    key={game.id} 
                    game={game} 
                    isWishlisted={wishlist.has(game.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onClick={handleGameClick}
                    onBuyNow={handleBuyNow}
                    currency={currency}
                    rating={rating}
                  />
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center">
                <p className="text-slate-500 text-lg">No games found matching "{searchQuery}" in {activeCategory}.</p>
                <button 
                  onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                  className="mt-4 text-cyan-400 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Vouchers & Gift Cards Section */}
        <div id="vouchers" className="bg-slate-900 border-t border-slate-800 py-16">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-10">
                 <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <Gift className="w-6 h-6 text-purple-400" />
                 </div>
                 <div>
                    <h2 className="text-3xl font-bold text-white">Digital Gift Cards</h2>
                    <p className="text-slate-400 text-sm">Instant codes for your favorite platforms.</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {VOUCHERS.map((voucher) => {
                   const { rating } = getReviewStats(voucher.id);
                   return (
                     <GameCard 
                      key={voucher.id} 
                      game={voucher} 
                      isWishlisted={wishlist.has(voucher.id)}
                      onToggleWishlist={handleToggleWishlist}
                      onClick={handleGameClick}
                      onBuyNow={handleBuyNow}
                      currency={currency}
                      rating={rating}
                    />
                  );
                })}
              </div>
           </div>
        </div>

        {/* Features / Trust Section */}
        <div className="bg-slate-800/50 py-16 border-y border-slate-800">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { title: "Official Distributor", desc: "Direct partnerships with publishers" },
                    { title: "Secure Payment", desc: "Encrypted SSL transactions" },
                    { title: "24/7 Support", desc: "Live chat assistance always ready" },
                    { title: "Loyalty Rewards", desc: "Earn points with every purchase" }
                  ].map((item, idx) => (
                    <div key={idx} className="p-6 bg-slate-900 rounded-xl border border-slate-700/50">
                       <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                       <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                  ))}
              </div>
           </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                ZENITH LOOT
              </span>
              <p className="mt-4 text-slate-400 text-sm">
                Your trusted partner for digital game currency. Powering gamers globally with instant delivery and secure payments.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-cyan-400">Help Center</a></li>
                <li><a href="#" className="hover:text-cyan-400">Track Order</a></li>
                <li><a href="#" className="hover:text-cyan-400">Report Issue</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-cyan-400">Terms of Service</a></li>
                <li><a href="#" className="hover:text-cyan-400">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-cyan-400">Refund Policy</a></li>
                <li><a href="#" className="hover:text-cyan-400">Cookie Policy</a></li>
              </ul>
            </div>

            <div>
               <h4 className="text-white font-bold mb-4">Connect</h4>
               <div className="flex gap-4">
                 <a href="#" className="p-2 bg-slate-900 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"><Facebook className="w-5 h-5"/></a>
                 <a href="#" className="p-2 bg-slate-900 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"><Twitter className="w-5 h-5"/></a>
                 <a href="#" className="p-2 bg-slate-900 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"><Instagram className="w-5 h-5"/></a>
                 <a href="#" className="p-2 bg-slate-900 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"><Mail className="w-5 h-5"/></a>
               </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Zenith Loot. All rights reserved. <span className="text-slate-700 ml-2">v1.0.0 (Live)</span>
            </p>
            <div className="flex gap-4">
               {/* Payment Icons Mock */}
               <div className="h-6 w-10 bg-slate-800 rounded"></div>
               <div className="h-6 w-10 bg-slate-800 rounded"></div>
               <div className="h-6 w-10 bg-slate-800 rounded"></div>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Elements */}
      <TopUpModal 
        game={selectedGame} 
        initialPackageId={preSelectedPackageId}
        onClose={() => { setSelectedGame(null); setPreSelectedPackageId(null); }} 
        onSuccess={handleOrderCreation}
        onAddToCart={handleAddToCart}
        currency={currency}
        user={user}
        reviews={reviews}
        onAddReview={handleAddReview}
        onLoginRequest={() => { setIsLoginOpen(true); }}
      />
      
      {isLoginOpen && (
        <LoginModal 
          onClose={() => setIsLoginOpen(false)}
          onLogin={handleLogin}
        />
      )}

      {isProfileOpen && user && (
        <ProfileModal 
          user={user}
          orders={allOrders} // In real app, filter by user.id
          wishlist={GAMES.filter(g => wishlist.has(g.id)).concat(VOUCHERS.filter(v => wishlist.has(v.id)))}
          onClose={() => setIsProfileOpen(false)}
          onLogout={handleLogout}
          onRemoveFromWishlist={(g) => handleToggleWishlist({ stopPropagation: () => {} } as React.MouseEvent, g)}
        />
      )}
      
      {isCartOpen && (
        <CartModal 
          items={cartItems}
          onClose={() => setIsCartOpen(false)}
          onRemove={handleRemoveFromCart}
          onCheckout={handleCheckout}
          currency={currency}
          user={user}
        />
      )}
      
      {isAdminDashboardOpen && user && user.isAdmin && (
        <AdminDashboard 
          orders={allOrders}
          onClose={() => setIsAdminDashboardOpen(false)}
          currency={currency}
        />
      )}
      
      <SupportChat />
    </div>
  );
};

export default App;
