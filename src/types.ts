interface Market {
  id: bigint;
  description: string;
  predictionX: string;
  predictionY: string;
  endTime: bigint;
  status: bigint;
  winningPrediction: bigint;
  totalPool: bigint;
  poolX: bigint;
  poolY: bigint;
  image: string;
}

interface Bet {
  marketId: bigint;
  better: string;
  amount: bigint;
  prediction: bigint;
  claimed: boolean;
}
