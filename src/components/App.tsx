import { Layout } from "./Layout";
import { MenuBar } from "./MenuBar";
import { CreateEventComponent } from "./CreateEventComponent";
import { ViewEvents } from "./ViewEvents";

function App() {
  return (
    <Layout>
      <MenuBar />

      <div className="space-y-8">
        <CreateEventComponent />
        <ViewEvents />
      </div>
    </Layout>
  );
}

export default App;
