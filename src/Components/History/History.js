import React, { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { NavLink, useNavigate } from "react-router-dom";
import "./History.css";

const History = () => {
  const [data, setData] = useState(
    JSON.parse(localStorage.getItem("prevOrderData")) || {}
  );
  let navigate = useNavigate();

  const [selectedOrders, setSelectedOrders] = useState([]);
  useEffect(() => {
    localStorage.setItem("prevOrderData", JSON.stringify(data));
  }, [data]);

  const changeSelected = (e) => {
    if (e.target.checked) {
      setSelectedOrders([...selectedOrders, e.target.id]);
    } else {
      let index = selectedOrders.indexOf(e.target.id);
      let temp = selectedOrders;
      temp.splice(index, 1);
      setSelectedOrders(temp);
      setData({ ...data });
    }
  };

  const mergeSelected = () => {
    if (selectedOrders.length === 0) return;

    const newData = {
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
    };
    for (let j in selectedOrders) {
      for (let i in newData) {
        if (
          data[selectedOrders[j]][i] &&
          Object.keys(data[selectedOrders[j]][i]).length !== 0
        ) {
          for (let k in data[selectedOrders[j]][i]) {
            if (
              data[selectedOrders[j]][i][k] &&
              Object.keys(data[selectedOrders[j]][i][k]).length !== 0
            ) {
              for (let l in data[selectedOrders[j]][i][k]) {
                if (!newData[i][k]) {
                  newData[i][k] = { [l]: data[selectedOrders[j]][i][k][l] };
                } else if (!newData[i][k][l]) {
                  newData[i][k][l] = data[selectedOrders[j]][i][k][l];
                } else {
                  newData[i][k][l].quantity +=
                    data[selectedOrders[j]][i][k][l].quantity;
                }
              }
            }
          }
        }
      }
    }
    const temp = { ...data };
    for (let i in selectedOrders) delete temp[selectedOrders[i]];
    setSelectedOrders([]);
    setData({ ...temp });
    const d = new Date();
    const date = `${d.toLocaleTimeString()} ${d.getDate()}-${
      d.getMonth() + 1
    }-${d.getFullYear()}`;
    const selectedMed = JSON.parse(localStorage.getItem("medData"));
    setData({ ...temp, [date]: selectedMed });
    localStorage.setItem("medData", JSON.stringify(newData));
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const deleteSelected = (i) => {
    const temp = { ...data };
    if (i) {
      delete temp[i];
      setSelectedOrders([...selectedOrders]);
    } else {
      for (let i in selectedOrders) delete temp[selectedOrders[i]];
      setSelectedOrders([]);
    }
    setData({ ...temp });
    return;
  };

  const selectAll = () => {
    const list = Object.keys(data).map((item) => {
      return item;
    });
    setSelectedOrders(list);
    var allInputs = document.getElementsByTagName("input");
    for (var i = 0; i < allInputs.length; i++) {
      if (allInputs[i].type === "checkbox") allInputs[i].checked = true;
    }
  };

  const deselectAll = () => {
    setSelectedOrders([]);
    var allInputs = document.getElementsByTagName("input");
    for (var i = 0, max = allInputs.length; i < max; i++) {
      if (allInputs[i].type === "checkbox") allInputs[i].checked = false;
    }
  };

  return (
    <div className="App">
      <div className="selector">
        <h3>Previous Orders</h3>
        <div className="links">
          <NavLink to="/">
            <FaHome />
          </NavLink>
        </div>
      </div>
      <div className="prevOrders">
        {data &&
          Object.keys(data).map((item, ind) => {
            return (
              <div className="prevOrder" key={item}>
                <div className="head">
                  <b>{ind + 1}.</b> Order Id: {item}
                </div>
                <div className="body">
                  <div id="download">
                    <center>
                      <h2>Order</h2>
                    </center>
                    <dl>
                      {Object.keys(data[item]).map((ite) => {
                        const list = Object.keys(data[item][ite]).map((it) => {
                          if (it.length) {
                            let dataList = Object.keys(data[item][ite][it])
                              .sort()
                              .map((i) => {
                                if (
                                  i.length &&
                                  data[item][ite][it][i].quantity > 0
                                )
                                  return (
                                    <dd key={i}>
                                      {i}&emsp;-&emsp;
                                      {data[item][ite][it][i].quantity}
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
                        if (list.length)
                          return (
                            <details key={ite} open>
                              <summary>{ite}</summary>
                              <dd>{list}</dd>
                            </details>
                          );
                        return null;
                      })}
                    </dl>
                  </div>
                </div>
                <div className="footer">
                  <input
                    type="checkbox"
                    onChange={(e) => changeSelected(e)}
                    name="select"
                    value={item}
                    id={item}
                  />
                  <RiDeleteBin6Line onClick={() => deleteSelected(item)} />
                </div>
              </div>
            );
          })}
        <div className="footer">
          <button onClick={(e) => mergeSelected(e)}>Merge Selected</button>
          {selectedOrders.length !== Object.keys(data).length ? (
            <button onClick={() => selectAll()}>Select All</button>
          ) : (
            <button onClick={() => deselectAll()}>Deselect All</button>
          )}
          <button onClick={() => deleteSelected()}>Delete Selected</button>
        </div>
      </div>
    </div>
  );
};

export default History;
