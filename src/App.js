import { useEffect, useRef, useState } from "react";
import "./App.css";
import { data } from "./data/data";
import { toPng } from "html-to-image";

function App() {
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMed, setSelectedMed] = useState(
    JSON.parse(localStorage.getItem("medData")) || {
      SBL: {},
      "Schwabe India": {},
      ADEL: {},
      BJAIN: {},
      "Bakson's": {},
      Allen: {},
      WHEEZAL: {},
      Medisynth: {},
      "Dr Bakshi Bakson": {},
      RALSON: {},
      "NEW LIFE": {},
      HSL: {},
      RECKEWEG: {},
      HAPDCO: {},
      BHP: {},
      Hahnemann: {},
      REPL: {},
      Lords: {},
      Healwell: {},
    }
  );
  const ref = useRef(0);

  useEffect(() => {
    localStorage.setItem("medData", JSON.stringify(selectedMed));
  }, [selectedMed]);

  const updateQuantity = (i, item, comp) => {
    const temp = { ...selectedMed };
    temp[comp][item].quantity = parseInt(i);
    setSelectedMed(temp);
  };

  const download = () => {
    if (ref.current === null) {
      return;
    }

    toPng(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        const d = new Date();
        const date = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
        const link = document.createElement("a");
        link.download = `order-list ${date}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const ResetAll = () => {
    setSelectedMed({
      SBL: {},
      "Dr Willmar Schwabe India": {},
      ADEL: {},
      BJAIN: {},
      "Bakson's": {},
      Allen: {},
      WHEEZAL: {},
      Medisynth: {},
      "Dr Bakshi Bakson": {},
      RALSON: {},
      "NEW LIFE": {},
      HSL: {},
      RECKEWEG: {},
      HAPDCO: {},
      BHP: {},
      Hahnemann: {},
      REPL: {},
      Lords: {},
      Healwell: {},
    });
  };
  const getSatus = (i) => {
    for(let it in i)
    {if (i[it].quantity > 0) return true;}
    return false;
  };

  return (
    <div className="App">
      <div className="selectors">
        <div>
          <label htmlFor="company">Select Company Name:</label>
          <select
            name="company"
            id="company"
            value={selectedCompany}
            onChange={(e) => {
              setSelectedCompany(e.target.value);
              setSelectedCategory("");
            }}
          >
            <option key="Medicine" value="">
              Select Company
            </option>
            {Object.keys(data).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div>
          {selectedCompany && (
            <>
              <label htmlFor="category">Select Category:</label>
              <select
                name="category"
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option key="Medicine" value="">
                  Select Category
                </option>
                {Object.keys(data[selectedCompany]).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </>
          )}
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
        {selectedCompany && selectedCategory && (
          <table>
            <tbody>
              {data[selectedCompany][selectedCategory].map((item, index) => {
                if (searchQuery === "")
                  return (
                    <tr
                      key={item}
                      style={{
                        background: selectedMed[selectedCompany][item]
                          ? "limegreen"
                          : "",
                      }}
                    >
                      <td>{index+1}</td>
                      <td
                        key={item}
                        onClick={() => {
                          var temp = { ...selectedMed[selectedCompany] };
                          if (!temp[item])
                            temp = { ...temp, [item]: { quantity: 0 } };
                          else delete temp[item];
                          setSelectedMed({
                            ...selectedMed,
                            [selectedCompany]: temp,
                          });
                        }}
                      >
                        {item}
                      </td>
                    </tr>
                  );
                else if (item.toLowerCase().includes(searchQuery.toLowerCase().trim()))
                  return (
                    <tr
                      key={item}
                      style={{
                        background: selectedMed[selectedCompany][item]
                          ? "limegreen"
                          : "",
                      }}
                    >
                      <td>{index + 1}</td>
                      <td
                        key={item}
                        onClick={() => {
                          var temp = { ...selectedMed[selectedCompany] };
                          if (!temp[item])
                            temp = { ...temp, [item]: { quantity: 0 } };
                          else delete temp[item];
                          setSelectedMed({
                            ...selectedMed,
                            [selectedCompany]: temp,
                          });
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
        )}
      </div>
      <div className="selected">
        <h1>Selected Medicines</h1>
        <table id="selected">
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(selectedMed).map((it) => {
              return Object.keys(selectedMed[it]).map((item) => {
                return (
                  <tr key={item}>
                    <td>
                      {item} &emsp;- &emsp; {it}
                    </td>
                    <td>
                      <input
                        type="number"
                        value={selectedMed[it][item].quantity}
                        onChange={(e) =>
                          updateQuantity(e.target.value, item, it)
                        }
                        min={0}
                        name="quantity"
                        id="quantity"
                      />
                    </td>
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
      </div>
      <div className="createOrder">
        <button onClick={(e) => download()}>Create Order</button>
        <button onClick={(e) => ResetAll()}>Reset All Selected</button>
      </div>
      <div ref={ref} id="download">
        <center>
          <h2>Order</h2>
        </center>
        <dl>
          {Object.keys(selectedMed).map((item) => {
            const data = (
              <span key={item}>
                {
                  getSatus(selectedMed[item]) && <dt key={item}>
                  {item}
                </dt>}
                {Object.keys(selectedMed[item]).map((it) => {
                  if (selectedMed[item][it].quantity > 0)
                    return (
                      <dd key={it}>
                        {it}&emsp;-&emsp;{selectedMed[item][it].quantity}
                      </dd>
                    );
                    return "";
                })}
              </span>
            );
            return data;
          })}
        </dl>
      </div>
    </div>
  );
}

export default App;
