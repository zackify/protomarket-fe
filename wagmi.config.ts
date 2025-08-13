import { defineConfig } from "@wagmi/cli";
import { react, sourcify } from "@wagmi/cli/plugins";
import { monadTestnet } from "wagmi/chains";
import { abi } from "./src/config/abi";
import { contractVersions } from "./src/contexts/contractVersions";

export default defineConfig({
  out: "src/generated.ts",
  contracts: [
    {
      name: "protomarket",
      address: contractVersions.V0,
      abi: abi, // Fallback ABI when not found in Sourcify
    },
  ],
  plugins: [react()],
});
