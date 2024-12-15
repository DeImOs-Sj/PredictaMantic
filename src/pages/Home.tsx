// import { Check, X } from "lucide-react";
// import { Progress } from "@/components/ui/progress";
// import {
//   motion,
//   useMotionValue,
//   useTransform,
//   useAnimation,
//   PanInfo,
// } from "framer-motion";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useReadContract } from "wagmi";
// import { abi } from "@/abi/abi";

// // const TOTAL_MARKETS = 3;

// interface Market {
//   id: number;
//   question: string;
//   optionA: string;
//   optionB: string;
//   endTime: number;
//   outcome: number;
//   totalOptionAShares: number;
//   totalOptionBShares: number;
//   totalPool: number;
//   resolved: boolean;
//   image?: string;
// }

// // Custom hook to fetch a single market
// const useMarket = (marketId: number) => {
//   return useReadContract({
//     address: import.meta.env.VITE_PREDICTION_CONTRACT_ADDRESS as `0x${string}`,
//     abi: abi,
//     functionName: "getMarketInfo",
//     args: [BigInt(marketId)],
//   });
// };

// // Custom hook to fetch all markets
// const useMarkets = () => {
//   const [markets, setMarkets] = useState<Market[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Create individual hooks for each market
//   const market0 = useMarket(1);
//   const market1 = useMarket(2);
//   const market2 = useMarket(3);

//   useEffect(() => {
//     const processMarketData = () => {
//       setIsLoading(true);
//       const marketResults = [market0, market1, market2];
//       const newMarkets: Market[] = [];

//       marketResults.forEach((result, index) => {
//         if (result.data) {
//           const [
//             question,
//             optionA,
//             optionB,
//             endTime,
//             outcome,
//             totalOptionAShares,
//             totalOptionBShares,
//             resolved,
//           ] = result.data as [
//             string,
//             string,
//             string,
//             bigint,
//             number,
//             bigint,
//             bigint,
//             boolean
//           ];

//           const totalOptionA = Number(totalOptionAShares);
//           const totalOptionB = Number(totalOptionBShares);

//           newMarkets.push({
//             id: index,
//             question,
//             optionA,
//             optionB,
//             endTime: Number(endTime),
//             outcome: Number(outcome),
//             totalOptionAShares: totalOptionA,
//             totalOptionBShares: totalOptionB,
//             totalPool: totalOptionA + totalOptionB,
//             resolved,
//             image: "/market-" + index + ".jpeg",
//           });
//         }
//       });

//       if (newMarkets.length > 0) {
//         setMarkets(newMarkets.sort((a, b) => a.id - b.id));
//       }

//       const hasError = marketResults.some((result) => result.isError);
//       if (hasError) {
//         setError("Error fetching market data");
//       } else {
//         setError(null);
//       }

//       setIsLoading(false);
//     };

//     processMarketData();
//   }, [
//     market0.data,
//     market1.data,
//     market2.data,
//     market0.isError,
//     market1.isError,
//     market2.isError,
//   ]);

//   return { markets, isLoading, error };
// };

// const SwipeableCard = ({
//   market,
//   onSwipe,
// }: {
//   market: Market;
//   onSwipe: (direction: "left" | "right") => void;
// }) => {
//   const x = useMotionValue(0);
//   const y = useMotionValue(0);
//   const rotate = useTransform(x, [-200, 200], [-25, 25]);
//   const yesOpacity = useTransform(x, [-200, 0, 100], [0, 0, 1]);
//   const noOpacity = useTransform(x, [-100, 0, 200], [1, 0, 0]);
//   const controls = useAnimation();

//   const handleDragEnd = async (_: never, info: PanInfo) => {
//     const swipeThreshold = 100;

//     if (Math.abs(info.offset.x) > swipeThreshold) {
//       await controls.start({
//         x: info.offset.x > 0 ? 1000 : -1000,
//         transition: { duration: 0.3 },
//       });

//       onSwipe(info.offset.x > 0 ? "right" : "left");

//       x.set(0);
//       y.set(0);
//       controls.set({ x: 0, y: 0 });
//     } else {
//       controls.start({
//         x: 0,
//         y: 0,
//         transition: { type: "spring", duration: 0.5 },
//       });
//     }
//   };

//   const handleButtonClick = async (direction: "left" | "right") => {
//     await controls.start({
//       x: direction === "right" ? 1000 : -1000,
//       transition: { duration: 0.3 },
//     });
//     onSwipe(direction);
//   };

//   return (
//     <motion.div
//       className="absolute w-full"
//       style={{ x, y, rotate }}
//       drag="x"
//       dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
//       dragElastic={0.9}
//       onDragEnd={handleDragEnd}
//       animate={controls}
//     >
//       <div className="relative h-fit border-black border-4 rounded-2xl touch-none">
//         <motion.div
//           className="absolute top-8 right-8 bg-[#99ff88] p-4 rounded-full border-2 border-black"
//           style={{ opacity: yesOpacity }}
//         >
//           <Check color="black" size={40} />
//         </motion.div>

//         <motion.div
//           className="absolute top-8 left-8 bg-[#ff6961] p-4 rounded-full border-2 border-black"
//           style={{ opacity: noOpacity }}
//         >
//           <X color="white" size={40} />
//         </motion.div>

//         <img
//           src="cards.jpeg"
//           alt="market"
//           className="w-full h-[70vh] object-cover rounded-xl select-none"
//           draggable="false"
//         />
//         <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-black via-transparent to-transparent" />

//         <div className="absolute flex flex-row justify-center gap-28 bottom-0 left-0 right-0 translate-y-1/2">
//           <button
//             className="p-4 rounded-full bg-[#ff6961] border-black border-2"
//             onClick={() => handleButtonClick("left")}
//           >
//             <X color="white" size={30} />
//           </button>
//           <button
//             className="p-4 rounded-full bg-[#99ff88] border-black border-2"
//             onClick={() => handleButtonClick("right")}
//           >
//             <Check color="black" size={30} />
//           </button>
//         </div>

//         <div className="absolute bottom-14 left-4 flex flex-col gap-4 text-white">
//           <h2 className="font-brice-semibold text-2xl">{market.question}</h2>
//           <div className="flex flex-col gap-2">
//             <p>{market.optionA}</p> VS <p>{market.optionB}</p>
//             <Progress
//               value={(market.totalOptionAShares / market.totalPool) * 100}
//             />
//             <p>
//               {((market.totalOptionAShares / market.totalPool) * 100).toFixed(
//                 1
//               )}
//               % Chance
//             </p>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default function Home() {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const navigate = useNavigate();
//   const { markets, isLoading, error } = useMarkets();

//   const handleSwipe = (direction: "left" | "right") => {
//     if (direction === "right" && markets[currentIndex]) {
//       navigate(`/bet/${markets[currentIndex].id}`);
//     }

//     setCurrentIndex((prevIndex) => {
//       const nextIndex = prevIndex + 1;
//       return nextIndex;
//     });
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="text-xl">Loading markets...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="text-xl text-red-500">Error: {error}</div>
//       </div>
//     );
//   }

//   if (!markets.length) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="text-xl">No markets available</div>
//       </div>
//     );
//   }

//   return (
//     <div className="px-4 pb-14">
//       <div className="relative h-[70vh]">
//         {markets.map((market, index) => {
//           if (index < currentIndex || index > currentIndex + 1) return null;

//           return (
//             <SwipeableCard
//               key={market.id}
//               market={market}
//               onSwipe={handleSwipe}
//             />
//           );
//         })}
//       </div>
//       <div className="mt-10 text-center text-gray-500">
//         {currentIndex + 1} of {markets.length} markets
//       </div>
//     </div>
//   );
// }

import { Check, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
  PanInfo,
} from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReadContract } from "wagmi";
import { abi } from "@/abi/abi";

// const TOTAL_MARKETS = 3;

interface Market {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  endTime: number;
  outcome: number;
  totalOptionAShares: number;
  totalOptionBShares: number;
  totalPool: number;
  resolved: boolean;
  image?: string;
}

const useMarket = (marketId: number) => {
  return useReadContract({
    address: import.meta.env.VITE_PREDICTION_CONTRACT_ADDRESS as `0x${string}`,
    abi: abi,
    functionName: "getMarketInfo",
    args: [BigInt(marketId)],
  });
};

const useMarkets = () => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create individual hooks for each market
  const market1 = useMarket(1);
  const market2 = useMarket(2);
  const market3 = useMarket(3);
  const market4 = useMarket(4);

  useEffect(() => {
    const processMarketData = () => {
      setIsLoading(true);
      const marketResults = [
        { result: market1, id: 1 },
        { result: market2, id: 2 },
        { result: market3, id: 3 },
        { result: market4, id: 4 },
      ];
      const newMarkets: Market[] = [];

      marketResults.forEach(({ result, id }) => {
        if (result.data) {
          const [
            question,
            optionA,
            optionB,
            endTime,
            outcome,
            totalOptionAShares,
            totalOptionBShares,
            resolved,
          ] = result.data as [
            string,
            string,
            string,
            bigint,
            number,
            bigint,
            bigint,
            boolean
          ];

          const totalOptionA = Number(totalOptionAShares);
          const totalOptionB = Number(totalOptionBShares);

          newMarkets.push({
            id, // Use the actual market ID instead of array index
            question,
            optionA,
            optionB,
            endTime: Number(endTime),
            outcome: Number(outcome),
            totalOptionAShares: totalOptionA,
            totalOptionBShares: totalOptionB,
            totalPool: totalOptionA + totalOptionB,
            resolved,
            image: "cards.jpeg",
          });
        }
      });

      if (newMarkets.length > 0) {
        setMarkets(newMarkets.sort((a, b) => a.id - b.id));
      }

      const hasError = marketResults.some(({ result }) => result.isError);
      if (hasError) {
        setError("Error fetching market data");
      } else {
        setError(null);
      }

      setIsLoading(false);
    };

    processMarketData();
  }, [
    market1.data,
    market2.data,
    market3.data,
    market4.data,
    market1.isError,
    market2.isError,
    market3.isError,
  ]);

  return { markets, isLoading, error };
};

const SwipeableCard = ({
  market,
  onSwipe,
}: {
  market: Market;
  onSwipe: (direction: "left" | "right") => void;
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const yesOpacity = useTransform(x, [-200, 0, 100], [0, 0, 1]);
  const noOpacity = useTransform(x, [-100, 0, 200], [1, 0, 0]);
  const controls = useAnimation();

  const handleDragEnd = async (_: never, info: PanInfo) => {
    const swipeThreshold = 100;

    if (Math.abs(info.offset.x) > swipeThreshold) {
      await controls.start({
        x: info.offset.x > 0 ? 1000 : -1000,
        transition: { duration: 0.3 },
      });

      onSwipe(info.offset.x > 0 ? "right" : "left");

      x.set(0);
      y.set(0);
      controls.set({ x: 0, y: 0 });
    } else {
      controls.start({
        x: 0,
        y: 0,
        transition: { type: "spring", duration: 0.5 },
      });
    }
  };

  const handleButtonClick = async (direction: "left" | "right") => {
    await controls.start({
      x: direction === "right" ? 1000 : -1000,
      transition: { duration: 0.3 },
    });
    onSwipe(direction);
  };

  return (
    <motion.div
      className="absolute w-full"
      style={{ x, y, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      animate={controls}
    >
      <div className="relative h-fit border-black border-4 rounded-2xl touch-none">
        <motion.div
          className="absolute top-8 right-8 bg-[#99ff88] p-4 rounded-full border-2 border-black"
          style={{ opacity: yesOpacity }}
        >
          <Check color="black" size={40} />
        </motion.div>

        <motion.div
          className="absolute top-8 left-8 bg-[#ff6961] p-4 rounded-full border-2 border-black"
          style={{ opacity: noOpacity }}
        >
          <X color="white" size={40} />
        </motion.div>

        <img
          src="cards.jpeg"
          alt="market"
          className="w-full h-[70vh] object-cover rounded-xl select-none"
          draggable="false"
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        <div className="absolute flex flex-row justify-center gap-28 bottom-0 left-0 right-0 translate-y-1/2">
          <button
            className="p-4 rounded-full bg-[#ff6961] border-black border-2"
            onClick={() => handleButtonClick("left")}
          >
            <X color="white" size={30} />
          </button>
          <button
            className="p-4 rounded-full bg-[#99ff88] border-black border-2"
            onClick={() => handleButtonClick("right")}
          >
            <Check color="black" size={30} />
          </button>
        </div>

        <div className="absolute bottom-14 left-4 flex flex-col gap-4 text-white">
          <h2 className="font-brice-semibold text-2xl">{market.question}</h2>
          <div className="flex flex-col gap-2">
            <p>{market.optionA}</p> VS <p>{market.optionB}</p>
            <Progress
              value={(market.totalOptionAShares / market.totalPool) * 100}
            />
            <p>
              {((market.totalOptionAShares / market.totalPool) * 100).toFixed(
                1
              )}
              % Chance
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const { markets, isLoading, error } = useMarkets();

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right" && markets[currentIndex]) {
      navigate(`/bet/${markets[currentIndex].id}`);
    }

    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return nextIndex;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading markets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!markets.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">No markets available</div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-14">
      <div className="relative h-[70vh]">
        {markets.map((market, index) => {
          if (index < currentIndex || index > currentIndex + 1) return null;

          return (
            <SwipeableCard
              key={market.id}
              market={market}
              onSwipe={handleSwipe}
            />
          );
        })}
      </div>
      <div className="mt-10 text-center text-gray-500">
        {currentIndex + 1} of {markets.length} markets
      </div>
    </div>
  );
}
