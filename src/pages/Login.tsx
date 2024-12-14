import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Login() {



  return (
    <div className="flex flex-col gap-10 px-10 py-20 justify-end bg-[#d3aeff] text-black h-screen w-screen font-brice-regular">
      <img
        src="/starsquare.png"
        className="absolute w-[15vw] h-[20vh] top-5 left-28 object-contain"
      />
      <img
        src="/star2.png"
        className="absolute w-[15vw] h-[20vh] top-28 left-10 transform rotate-[40deg] object-contain"
      />
      <img
        src="/flower.png"
        className="absolute w-[30vw] h-[40vh] top-28 left-32 object-contain"
      />
      <img
        src="/star3.png"
        className="absolute w-[35vw] h-[35vh] top-5 right-10 object-contain"
      />
      <div className="">
        <h1 className="text-5xl">Join. Predict. Connect.</h1>
        <p className="text-sm">
          Bet on outcomes, join exclusive discussions, and connect with a
          community. <br /> Powered by TON Blockchain.
        </p>
      </div>
      <div className="bg-black w-fit h-fit rounded-lg">
        {/* <button
          className="bg-[#fede64] px-6 py-2 text-2xl border-black border-2 rounded-lg -translate-y-1 -translate-x-1 active:translate-y-0 active:translate-x-0 transition-all"
        >
          Connect Wallet
        </button> */}
        <ConnectButton />
      </div>
    </div>
  );
}
