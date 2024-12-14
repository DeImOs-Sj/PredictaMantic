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

const TOTAL_MARKETS = 5; // Assuming we have 5 markets total

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
  const [markets, setMarkets] = useState<Market[]>([]);
  const [currentMarketId, setCurrentMarketId] = useState(1);

  const {
    data: marketData,
    isError,
    isLoading,
  } = useReadContract({
    address: import.meta.env.VITE_PREDICTION_CONTRACT_ADDRESS as `0x${string}`,
    abi: abi,
    functionName: "getMarketInfo",
    args: [BigInt(currentMarketId)],
  });

  useEffect(() => {
    if (marketData) {
      const [
        question,
        optionA,
        optionB,
        endTime,
        outcome,
        totalOptionAShares,
        totalOptionBShares,
        resolved,
      ] = marketData;

      const newMarket: Market = {
        id: currentMarketId,
        question,
        optionA,
        optionB,
        outcome: Number(outcome),
        endTime: Number(endTime),
        resolved,
        totalPool: Number(totalOptionAShares) + Number(totalOptionBShares),
        totalOptionAShares: Number(totalOptionAShares),
        totalOptionBShares: Number(totalOptionBShares),
        image: "/result.jpeg",
      };

      setMarkets((prevMarkets) => {
        const existingMarkets = prevMarkets.filter(
          (m) => m.id !== newMarket.id
        );
        return [...existingMarkets, newMarket].sort((a, b) => a.id - b.id);
      });

      // Fetch next market if we don't have it yet
      if (
        currentMarketId < TOTAL_MARKETS &&
        !markets.some((m) => m.id === currentMarketId + 1)
      ) {
        setCurrentMarketId(currentMarketId + 1);
      }
    }
  }, [marketData, currentMarketId]);

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right" && markets[currentIndex]) {
      navigate(`/bet/${markets[currentIndex].id}`);
    }

    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      // If we're approaching the end, try to fetch the next market
      if (nextIndex + 1 >= markets.length && currentMarketId < TOTAL_MARKETS) {
        setCurrentMarketId((prev) => prev + 1);
      }
      return nextIndex;
    });
  };

  if (isLoading && !markets.length) return <div>Loading...</div>;
  if (isError) return <div>Error loading market data</div>;
  if (!markets.length) return <div>No markets available</div>;

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
    </div>
  );
}
