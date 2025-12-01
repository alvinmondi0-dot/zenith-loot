
import React from 'react';
import { Game } from '../types';
import { PACKAGES } from '../constants';
import { Heart, Zap, RefreshCw, Star } from 'lucide-react';
import { getSportsSeasonYear, formatPrice, convertPrice } from '../utils';

interface GameCardProps {
  game: Game;
  isWishlisted: boolean;
  onToggleWishlist: (e: React.MouseEvent, game: Game) => void;
  onClick: (game: Game) => void;
  onBuyNow: (e: React.MouseEvent, game: Game) => void;
  currency: string;
  rating?: number;
}

const GameCard: React.FC<GameCardProps> = ({ game, isWishlisted, onToggleWishlist, onClick, onBuyNow, currency, rating = 0 }) => {
  // Check if game is the updated version (contains current sports year)
  const seasonYear = getSportsSeasonYear().toString();
  const isUpdatedSeason = game.name.includes(seasonYear);

  // Calculate "Starts From" price for display
  const availablePackages = game.packages || PACKAGES;
  const lowestPriceUSD = Math.min(...availablePackages.map(p => p.price));
  const convertedPrice = convertPrice(lowestPriceUSD, currency);
  const displayPrice = formatPrice(convertedPrice, currency);

  return (
    <div 
      onClick={() => onClick(game)}
      className="group relative rounded-2xl overflow-hidden cursor-pointer bg-slate-800 border border-slate-700 transition-all duration-500 ease-out transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/25 hover:border-cyan-400/50"
    >
      <div className="aspect-[3/4] overflow-hidden relative">
        {/* Image with cinematic zoom */}
        <img 
          src={game.image} 
          alt={game.name} 
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 opacity-90 group-hover:opacity-100" 
        />
        
        {/* Dynamic Color Glow Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t ${game.primaryColor} opacity-0 group-hover:opacity-40 transition-opacity duration-500 mix-blend-overlay`} />
        
        {/* Text Protection Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent opacity-90" />
        
        {/* Badge: New Season Update */}
        {isUpdatedSeason && (
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-[10px] font-extrabold px-2 py-1 rounded-md shadow-lg border border-white/20">
             <RefreshCw className="w-3 h-3 animate-spin-slow" />
             <span>NEW SEASON</span>
          </div>
        )}

        {/* Wishlist Button */}
        <button 
          onClick={(e) => onToggleWishlist(e, game)}
          className="absolute top-3 right-3 p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-rose-500 hover:text-white transition-all z-20 border border-white/10 hover:border-rose-500"
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
        </button>

        {/* Content */}
        <div className="absolute bottom-0 left-0 p-5 w-full transform transition-transform duration-300 group-hover:-translate-y-1">
          <div className="flex justify-between items-end mb-1">
             <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider opacity-80 group-hover:opacity-100 flex items-center gap-1">
               {game.developer}
             </p>
             {rating > 0 && (
               <div className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded backdrop-blur border border-white/10">
                 <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                 <span className="text-xs font-bold text-white">{rating.toFixed(1)}</span>
               </div>
             )}
          </div>
          
          <h3 className="text-xl font-extrabold text-white leading-tight mb-2 group-hover:text-cyan-50 transition-colors shadow-black drop-shadow-lg">
            {game.name}
          </h3>

          {/* Price Badge */}
          <div className="inline-block px-2 py-1 bg-slate-800/80 backdrop-blur border border-slate-600 rounded mb-3 text-[10px] text-slate-300">
             Starts at <span className="text-white font-bold">{displayPrice}</span>
          </div>

          {/* Buy Now Button - Visible on hover or always visible for better UX */}
          <button
            onClick={(e) => onBuyNow(e, game)}
            className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-95 border border-cyan-400/30"
          >
            <Zap className="w-4 h-4 fill-white" />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
