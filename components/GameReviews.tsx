
import React, { useState } from 'react';
import { Star, MessageCircle, Send, User } from 'lucide-react';
import { Review, User as UserType } from '../types';

interface GameReviewsProps {
  reviews: Review[];
  user: UserType | null;
  onAddReview: (rating: number, comment: string) => void;
  onLoginRequest: () => void;
}

const GameReviews: React.FC<GameReviewsProps> = ({ reviews, user, onAddReview, onLoginRequest }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    onAddReview(rating, comment);
    setRating(0);
    setComment('');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      {/* Summary Header */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            {averageRating} <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
          </h2>
          <p className="text-slate-400 text-sm">{reviews.length} Customer Reviews</p>
        </div>
        <div className="hidden sm:block">
           <div className="flex gap-1">
             {[1,2,3,4,5].map(i => (
               <div key={i} className={`w-2 h-8 rounded-full ${i <= Math.round(Number(averageRating)) ? 'bg-yellow-400' : 'bg-slate-700'}`}></div>
             ))}
           </div>
        </div>
      </div>

      {/* Review Form */}
      <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
        {!user ? (
          <div className="text-center py-4">
             <p className="text-slate-400 mb-3">Login to leave a review</p>
             <button 
               onClick={onLoginRequest}
               className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors text-sm"
             >
               Login Now
             </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
             <h3 className="text-white font-bold text-sm">Write a Review</h3>
             
             {/* Star Selector */}
             <div className="flex gap-1">
               {[1, 2, 3, 4, 5].map((star) => (
                 <button
                   type="button"
                   key={star}
                   onClick={() => setRating(star)}
                   onMouseEnter={() => setHoverRating(star)}
                   onMouseLeave={() => setHoverRating(0)}
                   className="p-1 transition-transform hover:scale-110"
                 >
                   <Star 
                     className={`w-6 h-6 ${
                       star <= (hoverRating || rating) 
                         ? 'fill-yellow-400 text-yellow-400' 
                         : 'text-slate-600'
                     }`} 
                   />
                 </button>
               ))}
             </div>

             <div className="relative">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  required
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm focus:ring-1 focus:ring-cyan-500 focus:outline-none placeholder:text-slate-600 resize-none"
                />
             </div>
             
             <div className="flex justify-end">
               <button 
                 type="submit"
                 disabled={rating === 0 || !comment.trim()}
                 className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors text-xs flex items-center gap-2"
               >
                 Post Review <Send className="w-3 h-3" />
               </button>
             </div>
          </form>
        )}
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-20" />
            <p>No reviews yet. Be the first!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
               <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                     <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                        <User className="w-4 h-4 text-slate-400" />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-white">{review.userName}</p>
                        <p className="text-[10px] text-slate-500">{review.date}</p>
                     </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-slate-700'}`} 
                      />
                    ))}
                  </div>
               </div>
               <p className="text-slate-300 text-sm leading-relaxed pl-10">"{review.comment}"</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameReviews;
