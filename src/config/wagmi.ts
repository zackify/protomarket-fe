import { http, createConfig, fallback } from "wagmi";
import { monadTestnet, base, mainnet } from "wagmi/chains";

export const config = createConfig({
  chains: [monadTestnet, base, mainnet],
  transports: {
    [monadTestnet.id]: fallback([
      http("https://rpc.ankr.com/monad_testnet"),
      http("https://testnet-rpc.monad.xyz"),
      http("https://rpc-testnet.monadinfra.com"),
    ]),
    [base.id]: http(),
    [mainnet.id]: http(),
  },
});
