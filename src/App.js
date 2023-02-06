import { useEffect, useState } from "react";
import "./App.css";
import { company, category, data } from "./data/data";

function App() {
  const [selectedCompany, setSelectedCompany] = useState("SBL");
  const [selectedCategory, setSelectedCategory] = useState("Dilution");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMed, setSelectedMed] = useState(
    JSON.parse(localStorage.getItem("medData")) || {}
  );

  useEffect(() => {
    localStorage.setItem("medData", JSON.stringify(selectedMed));
  }, [selectedMed]);

  console.log(selectedMed);

  return (
    <div className="App">
      <div className="header">
        <h1>Homeopathic Medicines</h1>
      </div>
      <div className="selectors">
        <div>
          <label htmlFor="company">Select Company Name:</label>
          <select
            name="company"
            id="company"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            {company.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="category">Select Category:</label>
          <select
            name="category"
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {category[selectedCompany].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="search">
          <label htmlFor="search">Search: </label>
          <input
            type="search"
            name="search"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter Medicine Name..."
            id="search"
            value={searchQuery}
          />
        </div>
      </div>
      <div className="table">
        <table>
          <tbody>
            {data[selectedCompany][selectedCategory].sort().map((item) => {
              if (searchQuery === "")
                return (
                  <tr
                    key={item}
                    style={{ background: selectedMed[item] ? "limegreen" : "" }}
                  >
                    <td
                      key={item}
                      onClick={() => {
                        var temp = { ...selectedMed };
                        if (!selectedMed[item])
                          temp = { ...selectedMed, [item]: {} };
                        else delete temp[item];
                        setSelectedMed(temp);
                      }}
                    >
                      {item}
                    </td>
                  </tr>
                );
              else if (item.toLowerCase().includes(searchQuery.toLowerCase()))
                return (
                  <tr
                    key={item}
                    style={{ background: selectedMed[item] ? "limegreen" : "" }}
                  >
                    <td
                      key={item}
                      onClick={() => {
                        var temp = { ...selectedMed };
                        if (!selectedMed[item])
                          temp = { ...selectedMed, [item]: {} };
                        else delete temp[item];
                        setSelectedMed(temp);
                      }}
                    >
                      {item}
                    </td>
                  </tr>
                );
              return null;
            })}
          </tbody>
        </table>
      </div>
      <div className="selected">
        <h1>Selected Medicines</h1>
        <table id="selected">
          <thead>
            <tr>
              <th>Name</th>
              <th>Size</th>
              <th>Power</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(selectedMed).map((item) => {
              return (
                <tr>
                  <td>{item} </td>{" "}
                  <td>
                    <input type="text" name="" id="" />{" "}
                  </td>
                  <td>
                    <input type="text" name="" id="" />{" "}
                  </td>
                  <td>
                    <input type="number" min={0} name="" id="" />{" "}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
