import { toPng } from "html-to-image";
import React, { useEffect, useRef, useState } from "react";
import { data } from "../../data/data";
import "./Home.css";
import { FaHistory } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Home = () => {
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMed, setSelectedMed] = useState(
    JSON.parse(localStorage.getItem("medData")) || {
      SBL: {},
      HSL: {},
      RECKEWEG: {},
      Allen: {},
      ADEL: {},
      Lords: {},
      BJAIN: {},
      "Schwabe India": {},
      "Bakson's": {},
      RALSON: {},
      Adven: {},
      WHEEZAL: {},
      Medisynth: {},
      "NEW LIFE": {},
      HAPDCO: {},
      BHP: {},
      Hahnemann: {},
      REPL: {},
      Healwell: {},
    }
  );
  const ref = useRef(0);

  useEffect(() => {
    localStorage.setItem("medData", JSON.stringify(selectedMed));
    console.log(selectedMed);
  }, [selectedMed]);

  const updateQuantity = (i, item, cat, comp) => {
    const temp = { ...selectedMed };
    temp[comp][cat][item].quantity = parseInt(i);
    setSelectedMed(temp);
  };

  const download = () => {
    if (ref.current === null) {
      return;
    }

    toPng(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        const d = new Date();
        const date = `${d.toLocaleTimeString()} ${d.getDate()}-${
          d.getMonth() + 1
        }-${d.getFullYear()}`;
        const link = document.createElement("a");
        link.download = `order-list ${date}.png`;
        link.href = dataUrl;
        link.click();
        ResetAll();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const ResetAll = () => {
    const d = new Date();
    const date = `${d.toLocaleTimeString()} ${d.getDate()}-${
      d.getMonth() + 1
    }-${d.getFullYear()}`;

    const prevOrderData = JSON.parse(localStorage.getItem("prevOrderData"));
    localStorage.setItem(
      "prevOrderData",
      JSON.stringify({ ...prevOrderData, [date]: selectedMed })
    );
    if (window.confirm("Remove All") === true) {
      setSelectedMed({
        SBL: {},
        HSL: {},
        RECKEWEG: {},
        Allen: {},
        ADEL: {},
        Lords: {},
        BJAIN: {},
        "Schwabe India": {},
        "Bakson's": {},
        RALSON: {},
        Adven: {},
        WHEEZAL: {},
        Medisynth: {},
        "NEW LIFE": {},
        HAPDCO: {},
        BHP: {},
        Hahnemann: {},
        REPL: {},
        Healwell: {},
      });
    }
  };

  const handleAdd = (item) => {
    var temp = { ...selectedMed[selectedCompany] };
    if (!temp[selectedCategory] || !temp[selectedCategory][item])
      temp = {
        ...temp,
        [selectedCategory]: {
          ...temp[selectedCategory],
          [item]: { quantity: 0 },
        },
      };
    else delete temp[selectedCategory][item];
    console.log(temp);
    setSelectedMed({ ...selectedMed, [selectedCompany]: temp });
  };

  return (
    <div className="App">
      <div className="selectors">
        <div className="links">
          <NavLink to="/history">
            <FaHistory />
          </NavLink>
        </div>
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
                        background:
                          selectedMed[selectedCompany] &&
                          selectedMed[selectedCompany][selectedCategory] &&
                          selectedMed[selectedCompany][selectedCategory][item]
                            ? "limegreen"
                            : "",
                      }}
                    >
                      <td>{index + 1}</td>
                      <td key={item} onClick={() => handleAdd(item)}>
                        {item}
                      </td>
                    </tr>
                  );
                else if (
                  item.toLowerCase().includes(searchQuery.toLowerCase().trim())
                )
                  return (
                    <tr
                      key={item}
                      style={{
                        background:
                          selectedMed[selectedCompany] &&
                          selectedMed[selectedCompany][selectedCategory] &&
                          selectedMed[selectedCompany][item]
                            ? "limegreen"
                            : "",
                      }}
                    >
                      <td>{index + 1}</td>
                      <td key={item} onClick={() => handleAdd(item)}>
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
          <>
            {Object.keys(selectedMed).map((it) => {
              if (Object.keys(selectedMed[it]).length !== 0)
                return (
                  <tbody key={it + "1"}>
                    <tr
                      key={it + "2"}
                      style={{ background: "black", color: "white" }}
                    >
                      <td colSpan={2}>{it}</td>
                    </tr>
                    {Object.keys(selectedMed[it]).map((item) => {
                      if (Object.keys(selectedMed[it][item]).length !== 0)
                        return (
                          <span key={item+"1"}>
                            <tr
                              key={item}
                              style={{ background: "#ba3b0a", color: "white" }}
                            >
                              <td colSpan={2}>{item}</td>
                            </tr>
                            {Object.keys(selectedMed[it][item]).map((i) => {
                              return (
                                <tr key={i}>
                                  <td>{i}</td>
                                  <td>
                                    <input
                                      type="number"
                                      value={selectedMed[it][item][i].quantity}
                                      onChange={(e) =>
                                        updateQuantity(
                                          e.target.value,
                                          i,
                                          item,
                                          it
                                        )
                                      }
                                      min={0}
                                      name="quantity"
                                      id="quantity"
                                    />
                                  </td>
                                </tr>
                              );
                            })}
                          </span>
                        );
                    })}
                  </tbody>
                );
            })}
          </>
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
            const data = Object.keys(selectedMed[item]).map((it) => {
              if (it.length) {
                let dataList = Object.keys(selectedMed[item][it]).map((i) => {
                  if (i.length && selectedMed[item][it][i].quantity > 0)
                    return (
                      <dd key={i}>
                        {i}&emsp;-&emsp;{selectedMed[item][it][i].quantity}
                      </dd>
                    );
                  return null;
                });
                return (
                  <details key={it} open>
                    <summary>{it}</summary>
                    <p>{dataList}</p>
                  </details>
                );
              }
              return null;
            });
            if (data.length)
              return (
                <details key={item} open>
                  <summary>{item}</summary>
                  <dd>{data}</dd>
                </details>
              );
            return null;
          })}
        </dl>
      </div>
    </div>
  );
};

export default Home;
