import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'wagmi/chains';



const mantle = {
  id: 5000,
  name: 'Mantle',
  iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/27075.png',
  iconBackground: '#fff',
  nativeCurrency: { name: 'Mantle', symbol: 'MNT', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.sepolia.mantle.xyz	'] },
  },
  blockExplorers: {
    default: { name: 'SnowTrace', url: 'https://mantlescan.xyz/' },
  },

} as const satisfies Chain;


export const config = getDefaultConfig({
  appName: import.meta.env.VITE_WALLET_CONNECT_PROJECT_NAME,
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
  chains: [
    // mainnet,
    // polygon,
    // optimism,
    // arbitrum,
    // base,
    mantle,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  ssr: true,
});