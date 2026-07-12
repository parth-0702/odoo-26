import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { CinematicLoader } from "./components/LoadingScreen";
import "./index.css";

function Root() {
  const [loading, setLoading] = useState(true);

  return (
    <StrictMode>
      {loading && <CinematicLoader onDone={() => setLoading(false)} />}
      <div style={{ opacity: loading ? 0 : 1, transition: "opacity 0.6s ease", height: "100%" }}>
        <App />
      </div>
    </StrictMode>
  );
}

createRoot(document.getElementById("root")!).render(<Root />);