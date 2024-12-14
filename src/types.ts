interface Market {
  id: bigint;
  description: string;
  endTime: bigint;
  status: number; // Match MarketStatus enum
  totalPool: bigint;
  yesPool: bigint;
  noPool: bigint;
  image?: string;
}

interface Bet {
  marketId: bigint;
  better: string;
  amount: bigint;
  prediction: bigint;
  claimed: boolean;
}
