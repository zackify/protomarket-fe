export const abi = [
  { type: "constructor", inputs: [], stateMutability: "nonpayable" },
  {
    type: "function",
    name: "GAME_TIMEOUT",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "PREDICTION_CUTOFF",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "claimWinning",
    inputs: [
      { name: "_eventId", type: "uint256", internalType: "uint256" },
      {
        name: "_predictionIndex",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "cleanupOldEvents",
    inputs: [
      {
        name: "_eventIds",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createEvents",
    inputs: [
      {
        name: "_events",
        type: "tuple[]",
        internalType: "struct PredictionPlatform.EventData[]",
        components: [
          { name: "title", type: "string", internalType: "string" },
          { name: "outcomeA", type: "string", internalType: "string" },
          { name: "outcomeB", type: "string", internalType: "string" },
          {
            name: "startTime",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "creatorFeePercent",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "acceptedToken",
            type: "address",
            internalType: "address",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "events",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "startTime", type: "uint256", internalType: "uint256" },
      { name: "creator", type: "address", internalType: "address" },
      {
        name: "creatorFeePercent",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "status",
        type: "uint8",
        internalType: "enum PredictionPlatform.EventStatus",
      },
      {
        name: "acceptedToken",
        type: "address",
        internalType: "address",
      },
      { name: "title", type: "bytes32", internalType: "bytes32" },
      { name: "outcomeA", type: "bytes32", internalType: "bytes32" },
      { name: "outcomeB", type: "bytes32", internalType: "bytes32" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getEventCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getEventsRange",
    inputs: [
      { name: "start", type: "uint256", internalType: "uint256" },
      { name: "end", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct PredictionPlatform.Event[]",
        components: [
          {
            name: "startTime",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "creator", type: "address", internalType: "address" },
          {
            name: "creatorFeePercent",
            type: "uint8",
            internalType: "uint8",
          },
          {
            name: "status",
            type: "uint8",
            internalType: "enum PredictionPlatform.EventStatus",
          },
          {
            name: "acceptedToken",
            type: "address",
            internalType: "address",
          },
          { name: "title", type: "bytes32", internalType: "bytes32" },
          {
            name: "outcomeA",
            type: "bytes32",
            internalType: "bytes32",
          },
          { name: "outcomeB", type: "bytes32", internalType: "bytes32" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getPredictionsRange",
    inputs: [
      { name: "_eventId", type: "uint256", internalType: "uint256" },
      { name: "start", type: "uint256", internalType: "uint256" },
      { name: "end", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct PredictionPlatform.Prediction[]",
        components: [
          { name: "amount", type: "uint256", internalType: "uint256" },
          { name: "playerA", type: "address", internalType: "address" },
          {
            name: "outcomeA",
            type: "uint8",
            internalType: "enum PredictionPlatform.Outcome",
          },
          {
            name: "outcomeB",
            type: "uint8",
            internalType: "enum PredictionPlatform.Outcome",
          },
          { name: "playerB", type: "address", internalType: "address" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "matchPrediction",
    inputs: [
      { name: "_eventId", type: "uint256", internalType: "uint256" },
      {
        name: "_predictionIndex",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "placePrediction",
    inputs: [
      { name: "_eventId", type: "uint256", internalType: "uint256" },
      {
        name: "_outcome",
        type: "uint8",
        internalType: "enum PredictionPlatform.Outcome",
      },
      { name: "_amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "predictions",
    inputs: [
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      { name: "amount", type: "uint256", internalType: "uint256" },
      { name: "playerA", type: "address", internalType: "address" },
      {
        name: "outcomeA",
        type: "uint8",
        internalType: "enum PredictionPlatform.Outcome",
      },
      {
        name: "outcomeB",
        type: "uint8",
        internalType: "enum PredictionPlatform.Outcome",
      },
      { name: "playerB", type: "address", internalType: "address" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "requestRefund",
    inputs: [
      { name: "_eventId", type: "uint256", internalType: "uint256" },
      {
        name: "_predictionIndex",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "resolveEvent",
    inputs: [
      { name: "_eventId", type: "uint256", internalType: "uint256" },
      {
        name: "_winner",
        type: "uint8",
        internalType: "enum PredictionPlatform.Outcome",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "resolvedEventWinners",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "",
        type: "uint8",
        internalType: "enum PredictionPlatform.Outcome",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "userPredictions",
    inputs: [
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "EventCreated",
    inputs: [
      {
        name: "eventId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "outcomeA",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
      {
        name: "outcomeB",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
      {
        name: "startTime",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "EventResolved",
    inputs: [
      {
        name: "eventId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "winner",
        type: "uint8",
        indexed: false,
        internalType: "enum PredictionPlatform.Outcome",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "PredictionMatchedAndPlaced",
    inputs: [
      {
        name: "eventId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "playerA",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "playerB",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "outcome",
        type: "uint8",
        indexed: false,
        internalType: "enum PredictionPlatform.Outcome",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "PredictionPlaced",
    inputs: [
      {
        name: "eventId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "predictor",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "outcome",
        type: "uint8",
        indexed: false,
        internalType: "enum PredictionPlatform.Outcome",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "PredictionRefunded",
    inputs: [
      {
        name: "eventId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "predictor",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "WinningsClaimed",
    inputs: [
      {
        name: "eventId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "winner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  { type: "error", name: "ReentrancyGuardReentrantCall", inputs: [] },
] as const;
