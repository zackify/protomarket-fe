import { useState } from "react";
import { Layout } from "./Layout";
import { MenuBar } from "./MenuBar";
import { CreateEventComponent } from "./CreateEventComponent";
import { ViewEvents } from "./ViewEvents";
function App() {
  const [count, setCount] = useState(0);

  return (
    <Layout>
      <MenuBar />

      <div className="space-y-8">
        <div className="bg-gray-900/30 rounded-lg p-6 border border-green-400/20">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="px-4 py-2 bg-green-400/10 text-green-400 border border-green-400/30 rounded-lg hover:bg-green-400/20 hover:border-green-400/50 transition-all duration-200 font-mono text-sm font-semibold"
          >
            Count is {count}
          </button>
          <p className="mt-4 text-gray-300 font-mono">
            React app with Bun and Wagmi ready!
          </p>
        </div>

        <CreateEventComponent />
        <ViewEvents />
      </div>
    </Layout>
  );
}

export default App;
