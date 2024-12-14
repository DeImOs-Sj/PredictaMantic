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
import { useReadContract, useReadContracts } from "wagmi";
import { abi } from "../abi/abi";

const dummyMarketDataArray: Market[] = [
  {
    id: BigInt(1),
    description: "Will it rain tomorrow?",
    image: "/result.jpeg",
    endTime: 0n,
    status: 0,
    totalPool: 0n,
    yesPool: 0n,
    noPool: 0n,
  },
  {
    id: BigInt(2),
    description: "Is the stock market going up?",
    image: "/result.jpeg",
    endTime: 0n,
    status: 0,
    totalPool: 0n,
    yesPool: 0n,
    noPool: 0n,
  },
  {
    id: BigInt(3),
    description: "Will the next iPhone have a notch?",
    image: "/result.jpeg",
    endTime: 0n,
    status: 0,
    totalPool: 0n,
    yesPool: 0n,
    noPool: 0n,
  },
];

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
  const [markets, setMarkets] = useState<Market[]>([]);
  const [currentMarketId, setCurrentMarketId] = useState<number>(3);

  const { data: nextMarketId } = useReadContract({
    address: "0x22ac2b97c22fb8c11f4380d35bfd24d7c3c504A4",
    abi,
    functionName: "nextMarketId",
  });

  useEffect(() => {
    console.log("Next market ID:", nextMarketId);
  }, [nextMarketId]);

  const {
    data: marketData,
    isError,
    isLoading,
    error,
  } = useReadContract({
    address: "0x22ac2b97c22fb8c11f4380d35bfd24d7c3c504A4",
    abi: [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "marketId",
            type: "uint256",
          },
        ],
        name: "getMarket",
        outputs: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "endTime",
            type: "uint256",
          },
          {
            internalType: "enum BinaryPredictionMarket.MarketStatus",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "enum BinaryPredictionMarket.Prediction",
            name: "winningPrediction",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "totalPool",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "yesPool",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "noPool",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "getMarket",
    args: [BigInt(currentMarketId)],
  });

  console.log("Market data:", currentMarketId, marketData);

  useEffect(() => {
    if (marketData) {
      console.log("Current market ID:", currentMarketId);
      console.log("Raw market data:", marketData);

      // Format the data for better debugging
      const formattedData = {
        id: marketData[0]?.toString(),
        description: marketData[1],
        endTime: marketData[2]
          ? new Date(Number(marketData[2]) * 1000).toLocaleString()
          : null,
        status: marketData[3],
        winningPrediction: marketData[4],
        totalPool: marketData[5]?.toString(),
        yesPool: marketData[6]?.toString(),
        noPool: marketData[7]?.toString(),
      };

      console.log("Formatted market data:", formattedData);
    }
    if (isError) {
      console.error("Error fetching market:", error);
    }
  }, [marketData, isError, error, currentMarketId]);

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
          src={market.image}
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
          <h2 className="font-brice-semibold text-2xl">{market.description}</h2>
          <div className="flex flex-col gap-2">
            {/* <p>{market.predictionX}</p>
            <Progress
              value={(Number(market.poolX) / Number(market.totalPool)) * 100}
            />
            <p>
              {(
                (Number(market.poolX) / Number(market.totalPool)) *
                100
              ).toFixed(1)}
              % Chance
            </p> */}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const {
    data: marketData,
    isError,
    isLoading,
  } = useReadContract({
    address: "0x22ac2b97c22fb8c11f4380d35bfd24d7c3c504A4",
    abi,
    functionName: "getMarket",
    args: [BigInt(1)], // Update args if marketId is dynamic
  });

  useEffect(() => {
    if (marketData) {
      console.log("Raw market data:", marketData);
    } else if (isError) {
      console.error("Error fetching market data.");
    } else if (isLoading) {
      console.log("Loading market data...");
    }
  }, [marketData, isError, isLoading]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const [market, setMarket] = useState<Market | null>(null);

  useEffect(() => {
    console.log(market);
  });
  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right") {
      navigate(`/bet/${dummyMarketDataArray[currentIndex].id}`);
    }
    setCurrentIndex((prevIndex) => {
      if (prevIndex < dummyMarketDataArray.length - 1) {
        return prevIndex + 1;
      }
      return 0;
    });
  };

  return (
    <div className="px-4 pb-14">
      <div className="relative h-[70vh]">
        {dummyMarketDataArray.map((market, index) => {
          if (index < currentIndex || index > currentIndex + 1) return null;

          return (
            <SwipeableCard
              key={Number(market.id)}
              market={market}
              onSwipe={handleSwipe}
            />
          );
        })}
      </div>
    </div>
  );
}
