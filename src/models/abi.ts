export const abi = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  { inputs: [], name: "ReentrancyGuardReentrantCall", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "eventId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "outcomeA",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "outcomeB",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startTime",
        type: "uint256",
      },
    ],
    name: "EventCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "eventId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "enum PredictionPlatform.Outcome",
        name: "winner",
        type: "uint8",
      },
    ],
    name: "EventResolved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "eventId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "playerA",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "playerB",
        type: "address",
      },
      {
        indexed: false,
        internalType: "enum PredictionPlatform.Outcome",
        name: "outcome",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "PredictionMatchedAndPlaced",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "eventId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "predictor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "enum PredictionPlatform.Outcome",
        name: "outcome",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "PredictionPlaced",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "eventId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "predictor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "PredictionRefunded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "eventId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "winner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "WinningsClaimed",
    type: "event",
  },
  {
    inputs: [],
    name: "GAME_TIMEOUT",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PREDICTION_CUTOFF",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_eventId", type: "uint256" },
      { internalType: "uint256", name: "_predictionIndex", type: "uint256" },
    ],
    name: "claimWinning",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256[]", name: "_eventIds", type: "uint256[]" },
    ],
    name: "cleanupOldEvents",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "string", name: "outcomeA", type: "string" },
          { internalType: "string", name: "outcomeB", type: "string" },
          { internalType: "uint256", name: "startTime", type: "uint256" },
          {
            internalType: "uint256",
            name: "creatorFeePercent",
            type: "uint256",
          },
          { internalType: "address", name: "acceptedToken", type: "address" },
        ],
        internalType: "struct PredictionPlatform.EventData[]",
        name: "_events",
        type: "tuple[]",
      },
    ],
    name: "createEvents",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "events",
    outputs: [
      { internalType: "uint256", name: "startTime", type: "uint256" },
      { internalType: "address", name: "creator", type: "address" },
      { internalType: "uint8", name: "creatorFeePercent", type: "uint8" },
      {
        internalType: "enum PredictionPlatform.EventStatus",
        name: "status",
        type: "uint8",
      },
      { internalType: "address", name: "acceptedToken", type: "address" },
      { internalType: "bytes32", name: "outcomeA", type: "bytes32" },
      { internalType: "bytes32", name: "outcomeB", type: "bytes32" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getEventCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "start", type: "uint256" },
      { internalType: "uint256", name: "end", type: "uint256" },
    ],
    name: "getEventsRange",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "startTime", type: "uint256" },
          { internalType: "address", name: "creator", type: "address" },
          { internalType: "uint8", name: "creatorFeePercent", type: "uint8" },
          {
            internalType: "enum PredictionPlatform.EventStatus",
            name: "status",
            type: "uint8",
          },
          { internalType: "address", name: "acceptedToken", type: "address" },
          { internalType: "bytes32", name: "outcomeA", type: "bytes32" },
          { internalType: "bytes32", name: "outcomeB", type: "bytes32" },
        ],
        internalType: "struct PredictionPlatform.Event[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_eventId", type: "uint256" },
      { internalType: "uint256", name: "start", type: "uint256" },
      { internalType: "uint256", name: "end", type: "uint256" },
    ],
    name: "getPredictionsRange",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "address", name: "playerA", type: "address" },
          {
            internalType: "enum PredictionPlatform.Outcome",
            name: "outcomeA",
            type: "uint8",
          },
          {
            internalType: "enum PredictionPlatform.Outcome",
            name: "outcomeB",
            type: "uint8",
          },
          { internalType: "address", name: "playerB", type: "address" },
        ],
        internalType: "struct PredictionPlatform.Prediction[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_eventId", type: "uint256" },
      { internalType: "uint256", name: "_predictionIndex", type: "uint256" },
    ],
    name: "matchPrediction",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_eventId", type: "uint256" },
      {
        internalType: "enum PredictionPlatform.Outcome",
        name: "_outcome",
        type: "uint8",
      },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "placePrediction",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "predictions",
    outputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "address", name: "playerA", type: "address" },
      {
        internalType: "enum PredictionPlatform.Outcome",
        name: "outcomeA",
        type: "uint8",
      },
      {
        internalType: "enum PredictionPlatform.Outcome",
        name: "outcomeB",
        type: "uint8",
      },
      { internalType: "address", name: "playerB", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_eventId", type: "uint256" },
      { internalType: "uint256", name: "_predictionIndex", type: "uint256" },
    ],
    name: "requestRefund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_eventId", type: "uint256" },
      {
        internalType: "enum PredictionPlatform.Outcome",
        name: "_winner",
        type: "uint8",
      },
    ],
    name: "resolveEvent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "resolvedEventWinners",
    outputs: [
      {
        internalType: "enum PredictionPlatform.Outcome",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "userPredictions",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
