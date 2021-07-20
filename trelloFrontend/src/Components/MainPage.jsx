import React, { useEffect, useState } from "react";
import Kanban from "./Kanban";
import "./MainPage.scss";

export default function MainPage() {
  const [companyName, setCompanyName] = useState("");
  const [existingCompanies, setExistingCompanies] = useState([]);
  const [selectedCompanyDetails, setSelectedCompanyDetails] = useState();

  const getSelectedCompanyDetails = (e) => {
    const selectedCompany = e.target.innerHTML;
    const selectedCompanyData = existingCompanies.filter(({ companyName }) => {
      return companyName === selectedCompany;
    });
    console.log(existingCompanies);
    console.log(selectedCompany, selectedCompanyData);
    setSelectedCompanyDetails(...selectedCompanyData);
  };

  const handleAddCompany = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ companyName: companyName }),
      mode: "cors",
    };
    fetch("http://localhost:5000/addCompany", requestOptions)
      .then((response) => response.json())
      .then((data) => getData());

    // setExistingCompanies([...existingCompanies, companyName]);
    setCompanyName("");
  };

  const getData = () => {
    fetch("http://localhost:5000/companies")
      .then((response) => response.json())
      .then((data) => setExistingCompanies(data));
  };

  useEffect(() => {
    console.log("getting called from useEffect");
    getData();
  }, []);

  // console.log("companies", existingCompanies);
  return (
    <div className="mainPage__container">
      <h1> Organizer</h1>
      <div className="company__container">
        <div className="add__company__container">
          <h4>Add a new company</h4>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <button onClick={handleAddCompany}> + ADD </button>
        </div>
        <hr />
        <div className="existing__company__container">
          <ul>
            {existingCompanies?.map(({ companyName }, index) => {
              return (
                <li key={index} onClick={(e) => getSelectedCompanyDetails(e)}>
                  {companyName}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="company__details__container">
        {selectedCompanyDetails && <Kanban data={selectedCompanyDetails} />}
      </div>
    </div>
  );
}
