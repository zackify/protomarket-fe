import { http, createConfig } from "wagmi";
import { monadTestnet, base, mainnet } from "wagmi/chains";

export const config = createConfig({
  chains: [monadTestnet, base, mainnet],
  transports: {
    [monadTestnet.id]: http(),
    [base.id]: http(),
    [mainnet.id]: http(),
  },
});
