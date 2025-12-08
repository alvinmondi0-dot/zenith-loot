
import { Game } from '../types';

interface VerificationResult {
  isValid: boolean;
  nickname?: string;
  region?: string;
  error?: string;
}

interface FulfillmentResult {
  success: boolean;
  transactionId?: string;
  message: string;
}

// Mock database of player names for realism
const MOCK_NICKNAMES = [
  'ShadowHunter', 'Viper_X', 'NoobMaster69', 'ProGamer_YT', 
  'GhostRider', 'MysticMage', 'CaptainPrice', 'LootGoblin',
  'ZenithKing', 'HyperBeast', 'SilentNinja', 'AlphaWolf'
];

const getRandomNickname = () => MOCK_NICKNAMES[Math.floor(Math.random() * MOCK_NICKNAMES.length)];

// Simulator for Game API responses
export const verifyPlayerId = async (game: Game, playerId: string): Promise<VerificationResult> => {
  return new Promise((resolve) => {
    // Simulate API Network Delay (500ms - 1.5s)
    const delay = Math.floor(Math.random() * 1000) + 500;

    setTimeout(() => {
      // Basic validation logic
      if (!playerId || playerId.length < 5) {
        resolve({ isValid: false, error: 'Invalid Player ID format' });
        return;
      }

      // Logic for Vouchers (Email validation)
      if (game.category === 'Voucher') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(playerId)) {
          resolve({ isValid: true, nickname: 'Verified Email' });
        } else {
          resolve({ isValid: false, error: 'Invalid Email Address' });
        }
        return;
      }

      // Mock Success for Games
      // In a real app, this would be: await axios.post(`https://api.activision.com/verify/${playerId}`)
      const mockName = getRandomNickname();
      resolve({ 
        isValid: true, 
        nickname: mockName,
        region: 'Global'
      });

    }, delay);
  });
};

export const processGameTopUp = async (gameId: string, packageId: string, playerId: string): Promise<FulfillmentResult> => {
  return new Promise((resolve) => {
    // Simulate Injection Delay
    setTimeout(() => {
      // 95% Success Rate
      const isSuccess = Math.random() > 0.05;

      if (isSuccess) {
        resolve({
          success: true,
          transactionId: `GW-${Math.floor(Math.random() * 10000000)}`,
          message: 'Successfully injected currency to account.'
        });
      } else {
        resolve({
          success: false,
          message: 'Connection timed out. Retrying...'
        });
      }
    }, 2000);
  });
};
