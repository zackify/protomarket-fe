import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { CreateEventComponent } from "./CreateEventComponent";
import { ViewEvents } from "./ViewEvents";

function App() {
  const [count, setCount] = useState(0);
  const [error, setError] = useState<string>("");
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = async () => {
    try {
      setError(""); // Clear previous errors
      await connect({ connector: injected() });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to connect wallet";
      setError(errorMessage);
      console.error("Wallet connection error:", err);
    }
  };

  const handleDisconnect = async () => {
    try {
      setError(""); // Clear previous errors
      await disconnect();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to disconnect wallet";
      setError(errorMessage);
      console.error("Wallet disconnection error:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Eth Frontend</h1>

      <div style={{ marginBottom: "20px" }}>
        {isConnected ? (
          <div>
            <p>Connected: {address}</p>
            <button onClick={handleDisconnect}>Disconnect</button>
          </div>
        ) : (
          <button onClick={handleConnect}>Connect Wallet</button>
        )}

        {/* Error Display */}
        {error && (
          <div
            style={{
              marginTop: "10px",
              padding: "10px",
              backgroundColor: "#FEE2E2",
              border: "1px solid #FECACA",
              borderRadius: "6px",
              color: "#DC2626",
            }}
          >
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      <button onClick={() => setCount((count) => count + 1)}>
        Count is {count}
      </button>

      <p>React app with Bun and Wagmi ready!</p>
      <CreateEventComponent />
      <ViewEvents />
    </div>
  );
}

export default App;
