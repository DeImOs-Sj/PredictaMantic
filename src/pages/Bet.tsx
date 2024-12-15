import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { abi } from "@/abi/abi";

// ERC20 token approval ABI
const tokenAbi = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
] as const;

export default function Bet() {
  const { id } = useParams();
  const [prediction, setPrediction] = useState<"0" | "1">("0");
  const { toast } = useToast();

  const BETTING_AMOUNT = parseEther("0.014");
  const PREDICTION_CONTRACT = import.meta.env
    .VITE_PREDICTION_CONTRACT_ADDRESS as `0x${string}`;
  const BETTING_TOKEN = import.meta.env.VITE_TOKEN_ADDRESS as `0x${string}`;
  console.log(PREDICTION_CONTRACT, BETTING_TOKEN);

  // Approval transaction
  const { data: approvalHash, writeContract: writeToken } = useWriteContract();
  const { isSuccess: isApprovalConfirmed } = useWaitForTransactionReceipt({
    hash: approvalHash,
  });

  // Share purchase transaction
  const { data: purchaseHash, writeContract: writePrediction } =
    useWriteContract();
  const { isSuccess: isPurchaseConfirmed } = useWaitForTransactionReceipt({
    hash: purchaseHash,
  });

  // Effect to handle successful approval
  useEffect(() => {
    if (isApprovalConfirmed) {
      handleSharePurchase();
    }
  }, [isApprovalConfirmed]);

  // Effect to handle successful purchase
  useEffect(() => {
    if (isPurchaseConfirmed) {
      toast({
        title: "Success",
        description: "Shares purchased successfully!",
      });
    }
  }, [isPurchaseConfirmed, toast]);

  const handleApproval = async () => {
    try {
      await writeToken({
        address: BETTING_TOKEN,
        abi: tokenAbi,
        functionName: "approve",
        args: [PREDICTION_CONTRACT, BETTING_AMOUNT],
        chain: undefined,
        account: undefined,
      });
    } catch (error) {
      console.error("Error approving token:", error);
      toast({
        title: "Error",
        description: "Failed to approve token. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSharePurchase = async () => {
    try {
      await writePrediction({
        address: PREDICTION_CONTRACT,
        abi: abi,
        functionName: "buyShares",
        args: [
          BigInt(5),
          prediction === "0", // isOptionA: true for Yes, false for No
          BETTING_AMOUNT,
        ],
        chain: undefined,
        account: undefined,
      });
    } catch (error) {
      console.error("Error buying shares:", error);
      toast({
        title: "Error",
        description: "Failed to buy shares. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      toast({
        title: "Error",
        description: "Market ID is required",
        variant: "destructive",
      });
      return;
    }

    try {
      await handleApproval();
    } catch (error) {
      console.error("Error processing transaction:", error);
      toast({
        title: "Error",
        description: "Transaction failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isProcessing = Boolean(approvalHash) || Boolean(purchaseHash);

  return (
    <div className="px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <div className="border-black border-4 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-brice-semibold text-2xl">Purchase Shares</h1>
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
                Fixed share purchase amount: 0.014 ETH
              </p>
            </div>

            <div>
              <label className="block mb-2 font-medium">Choose Option</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPrediction("0")}
                  className={`p-3 border-2 border-black rounded-xl font-medium ${
                    prediction === "0" ? "bg-[#99ff88]" : "bg-white"
                  }`}
                  disabled={isProcessing}
                >
                  Option A
                </button>
                <button
                  type="button"
                  onClick={() => setPrediction("1")}
                  className={`p-3 border-2 border-black rounded-xl font-medium ${
                    prediction === "1" ? "bg-[#ff6961]" : "bg-white"
                  }`}
                  disabled={isProcessing}
                >
                  Option B
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: isProcessing ? 1 : 1.02 }}
              whileTap={{ scale: isProcessing ? 1 : 0.98 }}
              type="submit"
              disabled={isProcessing}
              className="mt-4 w-full bg-[#99ff88] text-black py-4 px-6 rounded-xl border-black border-2 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {approvalHash
                    ? "Approving Token..."
                    : purchaseHash
                    ? "Purchasing Shares..."
                    : "Processing..."}
                </div>
              ) : (
                "Purchase Shares"
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
