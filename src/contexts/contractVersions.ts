import { base, monadTestnet } from "wagmi/chains";

export const contractVersions = {
  V0: {
    //Add base chain and others later!
    [monadTestnet.id]: "0x64C6e36026b866Eb1B5b9aa440fD46BFb7f032B2",
    //[base.id]: "0x64C6e36026b866Eb1B5b9aa440fD46BFb7f032B2clo",
  } as const,
};
