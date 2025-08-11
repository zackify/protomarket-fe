import { monadTestnet, base } from "wagmi/chains";
import usdcLogo from "../assets/images/usdc-logo.svg";
import monadLogo from "../assets/images/monad-logo.svg";
import baseLogo from "../assets/images/base-logo.svg";

export interface Coin {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
  logo: string;
}

export const coins: Record<number, Coin[]> = {
  [monadTestnet.id]: [
    {
      name: "USDC",
      symbol: "$",
      decimals: 6,
      address: "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea",
      logo: usdcLogo,
    },
    {
      name: "MONAD",
      symbol: "MON",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000", // Native token address
      logo: monadLogo,
    },
  ],
  [base.id]: [
    {
      name: "USDC",
      symbol: "$",
      decimals: 6,
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      logo: usdcLogo,
    },
    {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000", // Native token address
      logo: baseLogo,
    },
  ],
};
