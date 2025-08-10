# fe

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.17. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

````
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

export function CreateEventComponent() {
  const { data: hash, writeContract, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash })

  const createEvent = () => {
    writeContract({
      address: '0x792a00e52b858e913d20b364d06cf89865ad3f9b',
      abi: [
        {
          name: 'createEvents',
          type: 'function',
          stateMutability: 'nonpayable',
          inputs: [
            {
              type: 'tuple[]',
              components: [
                { name: 'outcomeA', type: 'string' },
                { name: 'outcomeB', type: 'string' },
                { name: 'startTime', type: 'uint256' },
                { name: 'creatorFeePercent', type: 'uint256' },
                { name: 'acceptedToken', type: 'address' },
              ]
            }
          ],
          outputs: [],
        },
      ],
      functionName: 'createEvents',
      args: [
        [
          {
            outcomeA: "Team A Wins",
            outcomeB: "Team B Wins",
            startTime: 1756684800n,
            creatorFeePercent: 5n,
            acceptedToken: "0x0000000000000000000000000000000000000000"
          }
        ]
      ],
    })
  }

  return (
    <div>
      <button
        onClick={createEvent}
        disabled={isPending}
      >
        {isPending ? 'Creating Event...' : 'Create Event'}
      </button>

      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Event created successfully!</div>}
    </div>
  )
}```
````
