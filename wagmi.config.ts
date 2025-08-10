import { defineConfig } from "@wagmi/cli";
import { abi } from "./src/models/abi";
import { react } from "@wagmi/cli/plugins";
import { monadTestnet } from "wagmi/chains";

export default defineConfig({
  out: "src/generated.ts",
  contracts: [
    {
      name: "protomarket",
      address: {
        //Add base chain and others later!
        [monadTestnet.id]: "0x792a00e52b858e913d20b364d06cf89865ad3f9b", // Monad testnet chain ID
      },
      abi: abi,
    },
  ],
  plugins: [react()],
});

// TODO: automate fetching ABI's from internet using wagmi plugins: https://wagmi.sh/cli/api/plugins
// Wagmi also has a feature to pull from local development abi when developing the contract
