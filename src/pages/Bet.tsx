import { useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";

export default function Bet() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<"0" | "1">("0");
  const { toast } = useToast();

  // Contract write hook
  const {
    data: hash,
    writeContract,
    isError: isWriteError,
    error: writeError,
  } = useWriteContract();

  // Wait for transaction hook
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your bet has been placed successfully.",
      });
      setLoading(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to place bet: " + error.message,
        variant: "destructive",
      });
      setLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Placing bet for market ID:", id);

    if (!id) {
      toast({
        title: "Error",
        description: "Market ID is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Convert prediction to enum value (YES = 1, NO = 2)
      const predictionEnum = prediction === "0" ? 1 : 2;

      console.log("Submitting bet with:", {
        marketId: id,
        prediction: predictionEnum,
        value: "0.014 ETH",
      });

      await writeContract({
        address: "0x22ac2b97c22fb8c11f4380d35bfd24d7c3c504A4",
        abi: [
          {
            inputs: [
              {
                internalType: "uint256",
                name: "marketId",
                type: "uint256",
              },
              {
                internalType: "enum BinaryPredictionMarket.Prediction",
                name: "prediction",
                type: "uint8",
              },
            ],
            name: "placeBet",
            outputs: [],
            stateMutability: "payable",
            type: "function",
          },
        ],
        functionName: "placeBet",
        args: [BigInt(id), predictionEnum],
        value: parseEther("0.014"),
      });
    } catch (error) {
      console.error("Error placing bet:", error);
      toast({
        title: "Error",
        description: "Failed to place bet. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <div className="border-black border-4 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-brice-semibold text-2xl">Place Your Bet</h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block mb-2 font-medium">Amount (ETH)</label>
              <input
                type="text"
                value="0.014"
                className="w-full p-3 border-2 border-black rounded-xl bg-gray-100"
                disabled={true}
              />
              <p className="text-sm text-gray-500 mt-1">
                Fixed bet amount: 0.014 ETH
              </p>
            </div>

            <div>
              <label className="block mb-2 font-medium">Your Prediction</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPrediction("0")}
                  className={`p-3 border-2 border-black rounded-xl font-medium ${
                    prediction === "0" ? "bg-[#99ff88]" : "bg-white"
                  }`}
                  disabled={loading || isConfirming}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setPrediction("1")}
                  className={`p-3 border-2 border-black rounded-xl font-medium ${
                    prediction === "1" ? "bg-[#ff6961]" : "bg-white"
                  }`}
                  disabled={loading || isConfirming}
                >
                  No
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading || isConfirming}
              className="mt-4 w-full bg-[#99ff88] text-black py-4 px-6 rounded-xl border-black border-2 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || isConfirming ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isConfirming
                    ? "Confirming Transaction..."
                    : "Placing Bet..."}
                </div>
              ) : (
                "Place Bet"
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
