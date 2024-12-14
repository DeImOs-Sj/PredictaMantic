import { useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";



export default function Bet() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [prediction, setPrediction] = useState<"0" | "1">("0");
  const { toast } = useToast();



  return (
    <div className=" px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <div className="border-black border-4 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-brice-semibold text-2xl">Place Your Bet</h1>
            {/* <TonConnectButton /> */}
          </div>

          <form  className="flex flex-col gap-4">
            <div>
              <label className="block mb-2 font-medium">Amount (TON)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 border-2 border-black rounded-xl"
                placeholder="0.1"
                step="0.1"
                min="0.1"
                required
                disabled={loading}
              />
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
                  disabled={loading}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setPrediction("1")}
                  className={`p-3 border-2 border-black rounded-xl font-medium ${
                    prediction === "1" ? "bg-[#ff6961]" : "bg-white"
                  }`}
                  disabled={loading}
                >
                  No
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              className="mt-4 w-full bg-[#99ff88] text-black py-4 px-6 rounded-xl border-black border-2 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Placing Bet...
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
