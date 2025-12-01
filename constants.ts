
import { Game, Package, Review } from './types';
import { getSportsSeasonYear } from './utils';

const SPORTS_YEAR = getSportsSeasonYear();

// Generic Packages for games that don't have specific ones
export const PACKAGES: Package[] = [
  { id: 'p1', amount: 80, bonus: 0, price: 0.49, currency: '$' },
  { id: 'p2', amount: 420, bonus: 20, price: 2.85, currency: '$', popular: true },
  { id: 'p3', amount: 880, bonus: 80, price: 5.99, currency: '$' },
  { id: 'p4', amount: 2400, bonus: 300, price: 14.50, currency: '$' },
  { id: 'p5', amount: 5000, bonus: 800, price: 29.99, currency: '$' },
  { id: 'p6', amount: 10800, bonus: 2500, price: 59.00, currency: '$' },
];

// --- VOUCHER & SUBSCRIPTION PACKAGES ---

// 1. Steam
const STEAM_PACKAGES: Package[] = [
  { id: 'stm_5', name: '$5 Wallet Code', amount: 5, bonus: 0, price: 4.50, currency: '$' },
  { id: 'stm_10', name: '$10 Wallet Code', amount: 10, bonus: 0, price: 8.99, currency: '$' },
  { id: 'stm_20', name: '$20 Wallet Code', amount: 20, bonus: 0, price: 17.50, currency: '$', popular: true },
  { id: 'stm_50', name: '$50 Wallet Code', amount: 50, bonus: 0, price: 44.00, currency: '$' },
  { id: 'stm_100', name: '$100 Wallet Code', amount: 100, bonus: 0, price: 85.00, currency: '$' },
];

// 2. Netflix
const NETFLIX_PACKAGES: Package[] = [
  { id: 'nf_week', name: '1 Week Trial', amount: 1, bonus: 0, price: 2.50, currency: '$' },
  { id: 'nf_1m', name: '1 Month Premium', amount: 1, bonus: 0, price: 9.99, currency: '$', popular: true },
  { id: 'nf_3m', name: '3 Months Premium', amount: 3, bonus: 0, price: 26.50, currency: '$' },
  { id: 'nf_1y', name: '1 Year Premium', amount: 12, bonus: 0, price: 85.00, currency: '$' },
];

// 3. Spotify
const SPOTIFY_PACKAGES: Package[] = [
  { id: 'sp_week', name: '1 Week Premium', amount: 1, bonus: 0, price: 1.99, currency: '$' },
  { id: 'sp_1m', name: '1 Month Individual', amount: 1, bonus: 0, price: 5.99, currency: '$' },
  { id: 'sp_3m', name: '3 Months Duo', amount: 3, bonus: 0, price: 14.99, currency: '$', popular: true },
  { id: 'sp_1y', name: '1 Year Family', amount: 12, bonus: 0, price: 55.00, currency: '$' },
];

// 4. Xbox
const XBOX_PACKAGES: Package[] = [
  { id: 'xb_week', name: '1 Week Game Pass', amount: 1, bonus: 0, price: 2.99, currency: '$' },
  { id: 'xb_1m', name: '1 Month Ultimate', amount: 1, bonus: 0, price: 8.50, currency: '$', popular: true },
  { id: 'xb_3m', name: '3 Months Ultimate', amount: 3, bonus: 0, price: 22.00, currency: '$' },
  { id: 'xb_1y', name: '12 Months Gold/Core', amount: 12, bonus: 0, price: 45.00, currency: '$' },
];

// 5. PlayStation
const PLAYSTATION_PACKAGES: Package[] = [
  { id: 'ps_1m', name: '1 Month Essential', amount: 1, bonus: 0, price: 7.50, currency: '$' },
  { id: 'ps_3m', name: '3 Months Extra', amount: 3, bonus: 0, price: 24.99, currency: '$', popular: true },
  { id: 'ps_1y', name: '12 Months Deluxe', amount: 12, bonus: 0, price: 75.00, currency: '$' },
];

// 6. Apple
const APPLE_PACKAGES: Package[] = [
  { id: 'apl_10', name: '$10 App Store Card', amount: 10, bonus: 0, price: 9.00, currency: '$' },
  { id: 'apl_25', name: '$25 App Store Card', amount: 25, bonus: 0, price: 22.50, currency: '$', popular: true },
  { id: 'apl_music', name: 'Apple Music 1 Month', amount: 1, bonus: 0, price: 4.99, currency: '$' },
  { id: 'apl_50', name: '$50 App Store Card', amount: 50, bonus: 0, price: 45.00, currency: '$' },
];

// 7. Google Play
const GOOGLE_PACKAGES: Package[] = [
  { id: 'gp_10', name: '$10 Play Code', amount: 10, bonus: 0, price: 9.00, currency: '$' },
  { id: 'gp_25', name: '$25 Play Code', amount: 25, bonus: 0, price: 22.50, currency: '$', popular: true },
  { id: 'gp_pass', name: 'Google Play Pass 1 Mo', amount: 1, bonus: 0, price: 2.99, currency: '$' },
  { id: 'gp_100', name: '$100 Play Code', amount: 100, bonus: 0, price: 88.00, currency: '$' },
];

// 8. Amazon
const AMAZON_PACKAGES: Package[] = [
  { id: 'amz_10', name: '$10 Gift Card', amount: 10, bonus: 0, price: 9.50, currency: '$' },
  { id: 'amz_25', name: '$25 Gift Card', amount: 25, bonus: 0, price: 23.50, currency: '$', popular: true },
  { id: 'amz_prime', name: 'Amazon Prime 1 Month', amount: 1, bonus: 0, price: 12.99, currency: '$' },
  { id: 'amz_100', name: '$100 Gift Card', amount: 100, bonus: 0, price: 92.00, currency: '$' },
];

// 9. Discord Nitro
const DISCORD_PACKAGES: Package[] = [
  { id: 'dsc_basic', name: 'Nitro Basic 1 Month', amount: 1, bonus: 0, price: 2.50, currency: '$' },
  { id: 'dsc_nitro', name: 'Nitro 1 Month', amount: 1, bonus: 0, price: 8.50, currency: '$', popular: true },
  { id: 'dsc_year', name: 'Nitro 1 Year', amount: 12, bonus: 0, price: 85.00, currency: '$' },
];

// 10. Nintendo
const NINTENDO_PACKAGES: Package[] = [
  { id: 'nt_10', name: '$10 eShop Card', amount: 10, bonus: 0, price: 9.00, currency: '$' },
  { id: 'nt_20', name: '$20 eShop Card', amount: 20, bonus: 0, price: 18.50, currency: '$' },
  { id: 'nt_online', name: 'Switch Online 12 Mos', amount: 12, bonus: 0, price: 16.50, currency: '$', popular: true },
  { id: 'nt_50', name: '$50 eShop Card', amount: 50, bonus: 0, price: 45.00, currency: '$' },
];

// --- GAME SPECIFIC PACKAGES ---

const COD_PACKAGES: Package[] = [
  { id: 'cod_1', amount: 80, bonus: 0, price: 0.55, currency: '$' },
  { id: 'cod_2', amount: 420, bonus: 20, price: 3.20, currency: '$' },
  { id: 'cod_3', name: 'Battle Pass', amount: 880, bonus: 0, price: 5.50, currency: '$', popular: true },
  { id: 'cod_4', name: 'Premium Pass Bundle', amount: 2400, bonus: 0, price: 15.99, currency: '$' },
  { id: 'cod_5', amount: 5000, bonus: 1200, price: 32.50, currency: '$' },
  { id: 'cod_6', amount: 10800, bonus: 3500, price: 65.00, currency: '$' },
];

const PUBG_PACKAGES: Package[] = [
  { id: 'pubg_1', amount: 60, bonus: 0, price: 0.65, currency: '$' },
  { id: 'pubg_2', amount: 325, bonus: 25, price: 3.50, currency: '$' },
  { id: 'pubg_3', name: 'Royale Pass', amount: 660, bonus: 60, price: 5.99, currency: '$', popular: true },
  { id: 'pubg_4', name: 'Elite Pass Plus', amount: 1800, bonus: 100, price: 16.99, currency: '$' },
  { id: 'pubg_5', amount: 3850, bonus: 350, price: 35.00, currency: '$' },
  { id: 'pubg_6', amount: 8100, bonus: 1100, price: 68.00, currency: '$' },
];

const GENSHIN_PACKAGES: Package[] = [
  { id: 'gen_1', amount: 60, bonus: 0, price: 0.60, currency: '$' },
  { id: 'gen_welkin', name: 'Blessing of the Welkin Moon', amount: 300, bonus: 2700, price: 3.50, currency: '$', popular: true },
  { id: 'gen_2', amount: 300, bonus: 30, price: 3.25, currency: '$' },
  { id: 'gen_3', amount: 980, bonus: 110, price: 9.99, currency: '$' },
  { id: 'gen_4', amount: 1980, bonus: 260, price: 19.50, currency: '$' },
  { id: 'gen_5', amount: 3280, bonus: 600, price: 32.00, currency: '$' },
  { id: 'gen_6', amount: 6480, bonus: 1600, price: 65.00, currency: '$' },
];

const FORTNITE_PACKAGES: Package[] = [
  { id: 'fn_1', name: 'Starter Pack', amount: 600, bonus: 0, price: 2.99, currency: '$' },
  { id: 'fn_2', name: 'Battle Pass', amount: 1000, bonus: 0, price: 5.99, currency: '$', popular: true },
  { id: 'fn_3', amount: 2800, bonus: 0, price: 15.50, currency: '$' },
  { id: 'fn_4', amount: 5000, bonus: 0, price: 24.99, currency: '$' },
  { id: 'fn_5', amount: 13500, bonus: 0, price: 59.99, currency: '$' },
];

const FREEFIRE_PACKAGES: Package[] = [
  { id: 'ff_1', amount: 100, bonus: 10, price: 0.65, currency: '$' },
  { id: 'ff_weekly', name: 'Weekly Membership', amount: 450, bonus: 0, price: 0.99, currency: '$', popular: true },
  { id: 'ff_monthly', name: 'Monthly Membership', amount: 2600, bonus: 0, price: 4.99, currency: '$' },
  { id: 'ff_2', amount: 1060, bonus: 100, price: 6.99, currency: '$' },
  { id: 'ff_3', amount: 2180, bonus: 220, price: 13.50, currency: '$' },
  { id: 'ff_4', amount: 5600, bonus: 600, price: 34.99, currency: '$' },
];

// --- VOUCHERS LIST ---

export const VOUCHERS: Game[] = [
  {
    id: 'v1',
    name: 'Steam Wallet',
    developer: 'Valve',
    image: 'https://image.pollinations.ai/prompt/Steam%20Wallet%20Gift%20Card%20digital%20code%20blue%20vaporwave?width=400&height=600&nologo=true&seed=201',
    currencyName: 'Credit',
    primaryColor: 'from-blue-800 to-indigo-900',
    category: 'Voucher',
    packages: STEAM_PACKAGES
  },
  {
    id: 'v2',
    name: 'PlayStation Plus',
    developer: 'Sony',
    image: 'https://image.pollinations.ai/prompt/Playstation%20Plus%20Card%20yellow%20geometric%20shapes?width=400&height=600&nologo=true&seed=202',
    currencyName: 'Sub',
    primaryColor: 'from-blue-600 to-blue-800',
    category: 'Voucher',
    packages: PLAYSTATION_PACKAGES
  },
  {
    id: 'v3',
    name: 'Xbox Game Pass',
    developer: 'Microsoft',
    image: 'https://image.pollinations.ai/prompt/Xbox%20Game%20Pass%20Ultimate%20green%20modern%20design?width=400&height=600&nologo=true&seed=203',
    currencyName: 'Sub',
    primaryColor: 'from-green-600 to-green-800',
    category: 'Voucher',
    packages: XBOX_PACKAGES
  },
  {
    id: 'v4',
    name: 'Amazon',
    developer: 'Amazon',
    image: 'https://image.pollinations.ai/prompt/Amazon%20Gift%20Card%20box%20smile%20logo%20orange?width=400&height=600&nologo=true&seed=204',
    currencyName: 'Balance',
    primaryColor: 'from-orange-400 to-yellow-500',
    category: 'Voucher',
    packages: AMAZON_PACKAGES
  },
  {
    id: 'v5',
    name: 'Netflix',
    developer: 'Netflix',
    image: 'https://image.pollinations.ai/prompt/Netflix%20Gift%20Card%20red%20N%20logo%20black%20background?width=400&height=600&nologo=true&seed=205',
    currencyName: 'Sub',
    primaryColor: 'from-red-600 to-red-900',
    category: 'Voucher',
    packages: NETFLIX_PACKAGES
  },
  {
    id: 'v6',
    name: 'Spotify Premium',
    developer: 'Spotify',
    image: 'https://image.pollinations.ai/prompt/Spotify%20Premium%20Gift%20Card%20green%20soundwaves?width=400&height=600&nologo=true&seed=206',
    currencyName: 'Sub',
    primaryColor: 'from-green-500 to-green-700',
    category: 'Voucher',
    packages: SPOTIFY_PACKAGES
  },
  {
    id: 'v7',
    name: 'Apple Gift Card',
    developer: 'Apple',
    image: 'https://image.pollinations.ai/prompt/Apple%20Gift%20Card%20white%20apple%20logo%20colorful?width=400&height=600&nologo=true&seed=207',
    currencyName: 'Credit',
    primaryColor: 'from-gray-700 to-gray-900',
    category: 'Voucher',
    packages: APPLE_PACKAGES
  },
  {
    id: 'v8',
    name: 'Google Play',
    developer: 'Google',
    image: 'https://image.pollinations.ai/prompt/Google%20Play%20Gift%20Card%20colorful%20triangle?width=400&height=600&nologo=true&seed=208',
    currencyName: 'Credit',
    primaryColor: 'from-blue-500 to-green-500',
    category: 'Voucher',
    packages: GOOGLE_PACKAGES
  },
  {
    id: 'v9',
    name: 'Discord Nitro',
    developer: 'Discord',
    image: 'https://image.pollinations.ai/prompt/Discord%20Nitro%20Gift%20Card%20wumpus%20blurple%20tech?width=400&height=600&nologo=true&seed=209',
    currencyName: 'Sub',
    primaryColor: 'from-indigo-600 to-violet-600',
    category: 'Voucher',
    packages: DISCORD_PACKAGES
  },
  {
    id: 'v10',
    name: 'Nintendo eShop',
    developer: 'Nintendo',
    image: 'https://image.pollinations.ai/prompt/Nintendo%20eShop%20Card%20red%20switch%20controller?width=400&height=600&nologo=true&seed=210',
    currencyName: 'Credit',
    primaryColor: 'from-red-600 to-red-800',
    category: 'Voucher',
    packages: NINTENDO_PACKAGES
  }
];

export const GAMES: Game[] = [
  {
    id: 'g1',
    name: 'Call of Duty: Mobile',
    developer: 'Activision',
    image: 'https://image.pollinations.ai/prompt/Call%20of%20Duty%20Mobile%20official%20game%20cover%20art%20soldier%20tactical%20shooter?width=400&height=600&nologo=true&seed=101',
    currencyName: 'CP',
    primaryColor: 'from-yellow-500 to-orange-600',
    category: 'FPS',
    packages: COD_PACKAGES
  },
  {
    id: 'g2',
    name: 'Free Fire',
    developer: 'Garena',
    image: 'https://image.pollinations.ai/prompt/Free%20Fire%20mobile%20game%20character%20battle%20royale%20cover%20art?width=400&height=600&nologo=true&seed=102',
    currencyName: 'Diamonds',
    primaryColor: 'from-orange-500 to-red-600',
    category: 'FPS',
    packages: FREEFIRE_PACKAGES
  },
  {
    id: 'g3',
    name: 'PUBG Mobile',
    developer: 'Tencent',
    image: 'https://image.pollinations.ai/prompt/PUBG%20Mobile%20game%20cover%20art%20battleground%20soldier%20helmet?width=400&height=600&nologo=true&seed=103',
    currencyName: 'UC',
    primaryColor: 'from-yellow-400 to-yellow-600',
    category: 'FPS',
    packages: PUBG_PACKAGES
  },
  {
    id: 'g4',
    name: 'Mobile Legends: BB',
    developer: 'Moonton',
    image: 'https://image.pollinations.ai/prompt/Mobile%20Legends%20Bang%20Bang%20hero%20fantasy%20art%20epic?width=400&height=600&nologo=true&seed=104',
    currencyName: 'Diamonds',
    primaryColor: 'from-blue-500 to-purple-600',
    category: 'MOBA'
  },
  {
    id: 'g5',
    name: 'Genshin Impact',
    developer: 'HoYoverse',
    image: 'https://image.pollinations.ai/prompt/Genshin%20Impact%20anime%20style%20landscape%20and%20character%20art?width=400&height=600&nologo=true&seed=105',
    currencyName: 'Genesis Crystals',
    primaryColor: 'from-purple-400 to-pink-500',
    category: 'RPG',
    packages: GENSHIN_PACKAGES
  },
  {
    id: 'g6',
    name: 'Valorant',
    developer: 'Riot Games',
    image: 'https://image.pollinations.ai/prompt/Valorant%20game%20agent%20tactical%20shooter%20neon%20style%20art?width=400&height=600&nologo=true&seed=106',
    currencyName: 'VP',
    primaryColor: 'from-red-500 to-rose-700',
    category: 'FPS'
  },
  {
    id: 'g7',
    name: 'League of Legends',
    developer: 'Riot Games',
    image: 'https://image.pollinations.ai/prompt/League%20of%20Legends%20champion%20fantasy%20battle%20art?width=400&height=600&nologo=true&seed=107',
    currencyName: 'RP',
    primaryColor: 'from-blue-600 to-cyan-500',
    category: 'MOBA'
  },
  {
    id: 'g8',
    name: 'Roblox',
    developer: 'Roblox Corp',
    image: 'https://image.pollinations.ai/prompt/Roblox%20game%20avatars%203d%20blocky%20style%20colorful?width=400&height=600&nologo=true&seed=108',
    currencyName: 'Robux',
    primaryColor: 'from-gray-600 to-gray-800',
    category: 'Sandbox'
  },
  {
    id: 'g9',
    name: 'FC Mobile',
    developer: 'EA Sports',
    image: 'https://image.pollinations.ai/prompt/FC%20Mobile%20soccer%20star%20dynamic%20action%20shot%20football?width=400&height=600&nologo=true&seed=109',
    currencyName: 'FC Points',
    primaryColor: 'from-green-500 to-emerald-700',
    category: 'Sports'
  },
  {
    id: 'g10',
    name: 'Clash of Clans',
    developer: 'Supercell',
    image: 'https://image.pollinations.ai/prompt/Clash%20of%20Clans%20barbarian%20king%20battle%20scene%203d%20cartoon?width=400&height=600&nologo=true&seed=110',
    currencyName: 'Gems',
    primaryColor: 'from-yellow-500 to-orange-500',
    category: 'Strategy'
  },
  {
    id: 'g11',
    name: 'Brawl Stars',
    developer: 'Supercell',
    image: 'https://image.pollinations.ai/prompt/Brawl%20Stars%20characters%20colorful%20action%20pose%20cartoon?width=400&height=600&nologo=true&seed=111',
    currencyName: 'Gems',
    primaryColor: 'from-yellow-400 to-red-500',
    category: 'MOBA'
  },
  {
    id: 'g12',
    name: 'Clash Royale',
    developer: 'Supercell',
    image: 'https://image.pollinations.ai/prompt/Clash%20Royale%20king%20and%20prince%20tower%20defense%20art?width=400&height=600&nologo=true&seed=112',
    currencyName: 'Gems',
    primaryColor: 'from-blue-500 to-red-500',
    category: 'Strategy'
  },
   {
    id: 'g13',
    name: `eFootball ${SPORTS_YEAR}`,
    developer: 'Konami',
    image: `https://image.pollinations.ai/prompt/eFootball%20${SPORTS_YEAR}%20soccer%20stadium%20player%20realistic?width=400&height=600&nologo=true&seed=113`,
    currencyName: 'eFootball Coins',
    primaryColor: 'from-blue-700 to-indigo-900',
    category: 'Sports'
  },
   {
    id: 'g14',
    name: 'Pokemon GO',
    developer: 'Niantic',
    image: 'https://image.pollinations.ai/prompt/Pokemon%20GO%20pikachu%20outdoors%20augmented%20reality%20vibe?width=400&height=600&nologo=true&seed=114',
    currencyName: 'PokeCoins',
    primaryColor: 'from-teal-500 to-green-600',
    category: 'Adventure'
  },
  {
    id: 'g15',
    name: 'Candy Crush Saga',
    developer: 'King',
    image: 'https://image.pollinations.ai/prompt/Candy%20Crush%20colorful%20candies%20explosion%20puzzle%20game?width=400&height=600&nologo=true&seed=115',
    currencyName: 'Gold Bars',
    primaryColor: 'from-pink-500 to-purple-500',
    category: 'Puzzle'
  },
  {
    id: 'g16',
    name: 'Asphalt 9: Legends',
    developer: 'Gameloft',
    image: 'https://image.pollinations.ai/prompt/Asphalt%209%20supercar%20racing%20nitro%20boost%20neon%20city?width=400&height=600&nologo=true&seed=116',
    currencyName: 'Tokens',
    primaryColor: 'from-blue-600 to-pink-600',
    category: 'Racing'
  },
  {
    id: 'g17',
    name: 'Fortnite',
    developer: 'Epic Games',
    image: 'https://image.pollinations.ai/prompt/Fortnite%20battle%20royale%20character%20action%20building%20colorful?width=400&height=600&nologo=true&seed=117',
    currencyName: 'V-Bucks',
    primaryColor: 'from-purple-500 to-blue-500',
    category: 'FPS',
    packages: FORTNITE_PACKAGES
  },
  {
    id: 'g18',
    name: 'Minecraft',
    developer: 'Mojang',
    image: 'https://image.pollinations.ai/prompt/Minecraft%20steve%20diamond%20sword%20landscape%20blocky?width=400&height=600&nologo=true&seed=118',
    currencyName: 'Minecoins',
    primaryColor: 'from-green-600 to-emerald-800',
    category: 'Sandbox'
  },
  {
    id: 'g19',
    name: 'Honkai: Star Rail',
    developer: 'HoYoverse',
    image: 'https://image.pollinations.ai/prompt/Honkai%20Star%20Rail%20anime%20space%20fantasy%20train?width=400&height=600&nologo=true&seed=119',
    currencyName: 'Oneiric Shards',
    primaryColor: 'from-indigo-500 to-purple-800',
    category: 'RPG'
  },
  {
    id: 'g20',
    name: 'Rise of Kingdoms',
    developer: 'Lilith Games',
    image: 'https://image.pollinations.ai/prompt/Rise%20of%20Kingdoms%20historical%20commander%20battle?width=400&height=600&nologo=true&seed=120',
    currencyName: 'Gems',
    primaryColor: 'from-yellow-600 to-orange-700',
    category: 'Strategy'
  },
  {
    id: 'g21',
    name: `NBA 2K${SPORTS_YEAR.toString().slice(-2)} Mobile`,
    developer: '2K',
    image: `https://image.pollinations.ai/prompt/NBA%202K${SPORTS_YEAR}%20basketball%20dunk%20action%20arena?width=400&height=600&nologo=true&seed=121`,
    currencyName: 'Coins',
    primaryColor: 'from-blue-700 to-red-700',
    category: 'Sports'
  },
  {
    id: 'g22',
    name: 'Lords Mobile',
    developer: 'IGG',
    image: 'https://image.pollinations.ai/prompt/Lords%20Mobile%20medieval%20fantasy%20battle%20hero?width=400&height=600&nologo=true&seed=122',
    currencyName: 'Diamonds',
    primaryColor: 'from-blue-600 to-indigo-700',
    category: 'Strategy'
  },
  {
    id: 'g23',
    name: '8 Ball Pool',
    developer: 'Miniclip',
    image: 'https://image.pollinations.ai/prompt/8%20Ball%20Pool%20billiards%20table%20cue%20ball?width=400&height=600&nologo=true&seed=123',
    currencyName: 'Cash',
    primaryColor: 'from-green-500 to-teal-600',
    category: 'Sports'
  },
  {
    id: 'g24',
    name: 'Among Us',
    developer: 'Innersloth',
    image: 'https://image.pollinations.ai/prompt/Among%20Us%20space%20impostor%20cartoon%20style?width=400&height=600&nologo=true&seed=124',
    currencyName: 'Stars',
    primaryColor: 'from-red-600 to-rose-600',
    category: 'Strategy'
  }
];

// Initial reviews to populate the system
export const INITIAL_REVIEWS: Review[] = [
  { id: 'r1', gameId: 'g1', userName: 'SniperWolf', rating: 5, comment: 'Instant delivery! Got my CP in seconds. The prices are unbeatable.', date: '2 days ago' },
  { id: 'r2', gameId: 'g1', userName: 'Ghost42', rating: 4, comment: 'Great service, but M-Pesa took a minute to process.', date: '1 week ago' },
  { id: 'r3', gameId: 'g3', userName: 'PUBG_King', rating: 5, comment: 'Cheapest UC store I have found. Will buy again.', date: '3 days ago' },
  { id: 'r4', gameId: 'g5', userName: 'Traveler_Lumine', rating: 5, comment: 'Got my Welkin Moon instantly. Safe and secure.', date: '1 day ago' },
  { id: 'r5', gameId: 'g17', userName: 'BuilderPro', rating: 4, comment: 'V-Bucks loaded fast. Battle pass secured!', date: '5 days ago' },
  { id: 'r6', gameId: 'v5', userName: 'MovieBuff', rating: 5, comment: 'Code worked perfectly on Netflix.', date: '2 weeks ago' },
  { id: 'r7', gameId: 'g1', userName: 'TacticalOps', rating: 5, comment: 'Love the admin support, very responsive.', date: 'Just now' },
  { id: 'r8', gameId: 'g13', userName: 'GoalScorer', rating: 3, comment: 'Good price, but site was a bit slow yesterday.', date: '1 month ago' },
];
