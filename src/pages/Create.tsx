import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { abi } from "../abi/abi";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";

export default function Create() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const { data: hash, writeContract } = useWriteContract();

  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Success",
        description: "Prediction market created successfully!",
      });
    }
  }, [isConfirmed, toast]);

  const [formData, setFormData] = useState({
    description: "",
    endTime: new Date(),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const endTimeUnix = Math.floor(formData.endTime.getTime() / 1000);

      console.log("Creating market with description:", formData.description);
      console.log("End time:", endTimeUnix);

      await writeContract({
        address: "0x22ac2b97c22fb8c11f4380d35bfd24d7c3c504A4",
        abi: abi,
        functionName: "createMarket",
        args: [formData.description, endTimeUnix],
      });
    } catch (error) {
      console.error("Error creating market:", error);
      toast({
        title: "Error",
        description: "Failed to create prediction market. Please try again.",
        variant: "destructive",
      });
    } finally {
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
            <h1 className="font-brice-semibold text-2xl">Create Prediction</h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block mb-2 font-medium">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-3 border-2 border-black rounded-xl"
                placeholder="Will it rain tomorrow?"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">End Time</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "w-full p-3 border-2 border-black rounded-xl flex items-center justify-start text-left font-normal",
                      !formData.endTime && "text-muted-foreground"
                    )}
                    disabled={loading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endTime ? (
                      format(formData.endTime, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.endTime}
                    onSelect={(date) =>
                      date && setFormData({ ...formData, endTime: date })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
                  Creating...
                </div>
              ) : (
                "Create Prediction"
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
