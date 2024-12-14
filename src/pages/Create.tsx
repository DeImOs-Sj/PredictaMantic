import { useState } from "react";
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


export default function Create() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    description: "",
    endTime: new Date(),
  });


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

          <form className="flex flex-col gap-4">
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
