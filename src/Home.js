import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { history } from "./App";

export default function Home(props) {
  const [rows, setRows] = useState(null);

  const query = new URLSearchParams(props.location.search);

  const route = query.get("orderByField");

  useEffect(() => {
    Papa.parse("/cities.csv", {
      download: true,
      header: true,
      complete: (data) => {
        const pep = data?.data.map((res) => {
          const keys = Object.keys(res);
          return {
            id: res[keys[0]],
            city: res[keys[1]],
            country: res[keys[2]],
            buildings: res[keys[3]],
            hundred: res[keys[4]],
            oneFifty: res[keys[5]],
            twoHundred: res[keys[6]],
            threeHundred: res[keys[7]],
            telecom: res[keys[8]],
            all: res[keys[9]],
          };
        });
        setRows({ ...data, data: pep });
      },
    });
  }, []);

  useEffect(() => {
    if (route && rows?.data) {
      if (route === "city") {
        orderByNames();
      } else if (route === "100+") {
        orderByNumber();
      }
    } else {
      return;
    }
  }, [route, rows?.data]);

  const orderByNames = () => {
    history.push("?orderByField=city");

    const newSort = rows?.data.sort((a, b) =>
      a?.city?.toLowerCase().localeCompare(b?.city?.toLowerCase())
    );
    setRows({ ...rows, newSort });
  };

  const orderByNumber = () => {
    history.push("?orderByField=100+");
    const newSort = rows?.data.sort(function (a, b) {
      return a.hundred - b.hundred;
    });
    setRows({ ...rows, newSort });
  };

  return (
    <main className="main">
      <div className="button-div">
        <button onClick={orderByNames}>Order by city</button>
        <button onClick={orderByNumber}>Order by 100</button>
        <h2>Cities and their high rise buildings</h2>
      </div>

      <div className="table-div">
        <table>
          <tr>
            {rows?.meta.fields.map((column) => (
              <th>{column}</th>
            ))}
          </tr>
          {rows?.data.map((row, i) => {
            return (
              <tr key={i}>
                <td>{row.id}</td>
                <td>{row.city}</td>
                <td>{row.country}</td>
                <td>{row.buildings} </td>
                <td>{row.hundred}</td>
                <td>{row.oneFifty}</td>
                <td>{row.twoHundred} </td>
                <td>{row.threeHundred}</td>
                <td>{row.telecom}</td>
                <td>{row.all} </td>
              </tr>
            );
          })}
        </table>
      </div>
    </main>
  );
}
