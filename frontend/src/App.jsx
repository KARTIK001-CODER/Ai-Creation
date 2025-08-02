import { useState } from "react";
import axios from "axios";

function App() {
  const [skills, setSkills] = useState("");
  const [result, setResult] = useState([]);

  const handlePredict = async () => {
    try {
      const res = await axios.post("http://localhost:5000/predict", {
        skills,
      });
      setResult(res.data.professions);
    } catch (err) {
      console.error("❌ Error fetching profession list", err);
      alert("❌ Failed to fetch profession list");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Profession Predictor</h1>

      <textarea
        style={styles.textarea}
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        placeholder="Enter your skills (e.g., I love drawing and editing)"
      />

      <button style={styles.button} onClick={handlePredict}>
        Predict Profession
      </button>

      {result.length > 0 && (
        <div style={styles.resultBox}>
          <h2>Predicted Professions:</h2>
          <ul>
            {result.map((item, index) => (
              <li key={index}>
                <strong>{item.profession}</strong> — {item.match}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "sans-serif",
    padding: "30px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  heading: {
    textAlign: "center",
  },
  textarea: {
    width: "100%",
    height: "100px",
    padding: "10px",
    marginBottom: "20px",
    fontSize: "16px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    marginBottom: "20px",
  },
  resultBox: {
    background: "#f9f9f9",
    padding: "15px",
    border: "1px solid #ddd",
  },
};

export default App;
