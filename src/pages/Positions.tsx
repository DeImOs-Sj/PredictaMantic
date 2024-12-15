import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Position {
  marketId: bigint;
  description: string;
  predictionX: string;
  predictionY: string;
  endTime: bigint;
  amount: bigint;
  prediction: bigint;
  claimed: boolean;
  totalPool: bigint;
  poolX: bigint;
  poolY: bigint;
}

const dummyPositions: Position[] = [
  {
    marketId: BigInt(1),
    description: "Will ETH reach 10k?",
    predictionX: "Yes",
    predictionY: "No",
    endTime: BigInt(1733310646),
    amount: BigInt(100000000),
    prediction: BigInt(0),
    claimed: false,
    totalPool: BigInt(1000000000),
    poolX: BigInt(600000000),
    poolY: BigInt(400000000),
  },
  {
    marketId: BigInt(2),
    description: "Will BTC reach 100k?",
    predictionX: "Yes",
    predictionY: "No",
    endTime: BigInt(1733310746),
    amount: BigInt(200000000),
    prediction: BigInt(1),
    claimed: false,
    totalPool: BigInt(2000000000),
    poolX: BigInt(800000000),
    poolY: BigInt(1200000000),
  },
];

export default function Positions() {
  const formatTON = (amount: bigint) => {
    return Number(amount) / 1000000000;
  };

  const isExpired = (endTime: bigint) => {
    return Number(endTime) * 1000 < Date.now();
  };

  return (
    <div className="px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="font-brice-semibold text-2xl mb-6">Your Positions</h1>

        <div className="flex flex-col gap-4">
          {dummyPositions.map((position, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={Number(position.marketId)}
              className="border-black border-4 rounded-2xl p-4"
            >
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <h2 className="font-semibold text-lg">
                    {position.description}
                  </h2>
                  <div
                    className={`px-3 py-1 rounded-full text-sm ${
                      isExpired(position.endTime)
                        ? "bg-gray-200"
                        : "bg-green-200"
                    }`}
                  >
                    {isExpired(position.endTime) ? "Expired" : "Active"}
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  <div
                    className={`p-2 rounded-full ${
                      position.prediction === BigInt(0)
                        ? "bg-[#99ff88]"
                        : "bg-[#ff6961]"
                    }`}
                  >
                    {position.prediction === BigInt(0) ? (
                      <Check size={16} />
                    ) : (
                      <X size={16} color="white" />
                    )}
                  </div>
                  <span className="text-sm">
                    You bet {formatTON(position.amount)} MNT on{" "}
                    {position.prediction === BigInt(0)
                      ? position.predictionX
                      : position.predictionY}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-sm">{position.predictionX}</p>
                  <Progress
                    value={Number(
                      (position.poolX * BigInt(100)) / position.totalPool
                    )}
                  />
                  <div className="flex justify-between text-sm">
                    <span>
                      {(
                        Number(position.poolX * BigInt(100)) /
                        Number(position.totalPool)
                      ).toFixed(1)}
                      %
                    </span>
                    <span>{formatTON(position.poolX)} MNT</span>
                  </div>
                </div>

                {isExpired(position.endTime) && !position.claimed && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-2 w-full bg-[#99ff88] text-black py-2 px-4 rounded-xl border-black border-2 font-medium text-sm"
                  >
                    Claim Winnings
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
