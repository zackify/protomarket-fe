import { defineConfig } from "@wagmi/cli";
import { abi } from "./src/models/abi";
import { react } from "@wagmi/cli/plugins";

const PROTOMARKET_CONTRACT_ADDRESS =
  "0x792a00e52b858e913d20b364d06cf89865ad3f9b";

export default defineConfig({
  out: "src/generated.ts",
  contracts: [
    {
      name: "protomarket",
      address: PROTOMARKET_CONTRACT_ADDRESS,
      abi: abi,
    },
  ],
  plugins: [react()],
});

// TODO: automate fetching ABI's from internet using wagmi plugins: https://wagmi.sh/cli/api/plugins
// Wagmi also has a feature to pull from local development abi when developing the contract
