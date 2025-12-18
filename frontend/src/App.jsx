import { useEffect, useState } from "react";


const API_BASE = "http://127.0.0.1:8000/api/v1";


function App() {
  const [message, setMessage] = useState("Loading from backend...");

  useEffect(() => {
    fetch(`${API_BASE}/health/`)
      .then(res => {
        if (!res.ok) throw new Error("Backend error");
        return res.json();
      })
      .then(data => {
        setMessage(`✅ ${data.service} is running`);
      })
      .catch(err => {
        setMessage("❌ Backend not reachable");
        console.error(err);
      });
  }, []);

  return (
    <div style={{
      background: "#111",
      color: "#fff",
      minHeight: "100vh",
      padding: "40px",
      fontFamily: "sans-serif"
    }}>
      <h1>SkillSync</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
