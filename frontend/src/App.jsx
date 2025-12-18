import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/message")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>SkillSync</h1>

      {data ? (
        <>
          <p><strong>Message:</strong> {data.message}</p>
          <p><strong>Source:</strong> {data.source}</p>
          <p><strong>Version:</strong> {data.version}</p>
        </>
      ) : (
        <p>Loading from backend...</p>
      )}
    </div>
  );
}

export default App;
