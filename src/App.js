import "./App.css";
import Home from "./Components/Home/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import History from "./Components/History/History";
import { data } from "./data/data";
import axios from "axios";

function App() {
  const addAll = async () => {
    let sum = 0;
    for (let i in data) {
      for (let j in data[i]) {
        for (let k in data[i][j]) {
          try {
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDgwZTgxY2E5MmYxMDlmOTY3NWIxNzYiLCJpYXQiOjE2ODgyMzUwMDh9.9Iz65S-l4GSU9qhoYvTquR8OQStA7bnWBGhfdp76kMw`;
            await axios.post(`http://127.0.0.1:5000/api/medicine`, {
              name: data[i][j][k],
              company: i,
              category: j,
            });
            console.log("Success");
          } catch (error) {
            console.log("Error:", error);
          }
          sum += 1;
        }
      }
    }
    alert(sum);
  };
  return (
    <BrowserRouter>
      <button onClick={() => addAll()}>Add</button>
      <Routes>
        {/* <Route path="/" exact element={<Home />} />
        <Route path="/history" element={<History />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
