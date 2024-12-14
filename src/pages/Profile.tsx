import { motion } from "framer-motion";
import {
  WalletIcon,
  Copy,
  ExternalLink,
  LogOut,
  Award,
  Activity,
  History,
} from "lucide-react";
import { ConnectButton } from '@rainbow-me/rainbowkit';


export default function Profile() {


  const stats = [
    { icon: Award, label: "Total Predictions", value: "12" },
    { icon: Activity, label: "Win Rate", value: "75%" },
    { icon: History, label: "Active Positions", value: "3" },
  ];

  return (
    <div className="px-4 py-8">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-black border-4 rounded-2xl p-6"
        >
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#99ff88] rounded-full border-2 border-black">
                <WalletIcon size={24} />
              </div>
              <div className="flex-1">
                <h1 className="font-brice-semibold text-2xl">Profile</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-600">EQBk...3yR5</span>
                  <button
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="border-2 border-black rounded-xl p-3 flex flex-col items-center gap-2"
                >
                  <stat.icon size={20} />
                  <div className="text-center">
                    <div className="font-semibold">{stat.value}</div>
                    <div className="text-xs text-gray-600">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h2 className="font-semibold">Recent Activity</h2>
              <div className="border-2 border-black rounded-xl p-3">
                <div className="text-sm text-gray-600">
                  Placed 0.1 TON on "Will it rain tomorrow?"
                </div>
                <div className="text-xs text-gray-500 mt-1">2 hours ago</div>
              </div>
              <div className="border-2 border-black rounded-xl p-3">
                <div className="text-sm text-gray-600">
                  Won 0.2 TON from "Will BTC reach 100k?"
                </div>
                <div className="text-xs text-gray-500 mt-1">1 day ago</div>
              </div>
            </div>

            {/* <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-[#ff6961] text-white py-4 px-6 rounded-xl border-black border-2 font-semibold"
            >
              <LogOut size={20} /> */}
              {/* Disconnect Wallet */}
              <div
              className="flex justify-center"
              ><ConnectButton/></div>
              
            {/* </motion.button> */}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
