import { http, createConfig } from "wagmi";
import { monadTestnet, base } from "wagmi/chains";

export const config = createConfig({
  chains: [monadTestnet, base],
  transports: {
    [monadTestnet.id]: http(),
    [base.id]: http(),
  },
});
