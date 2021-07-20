import React, { useState } from "react";
import "./DialogBox.scss";

export default function DialogBox({ addFunction, cancelFunction }) {
  const [candidateName, setCandidateName] = useState("");
  const [jobProfile, setJobProfile] = useState("");

  return (
    <div className="dialog__box__container">
      <div className="dialog__box__modal">
        <div className="dialog__box__content">
          <div className="dialog__box__form">
            <div>
              <label htmlFor="">Candidate Name</label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
              />
            </div>
            <br />
            <div>
              <label htmlFor="">Job Profile</label>
              <input
                type="text"
                value={jobProfile}
                onChange={(e) => setJobProfile(e.target.value)}
              />
            </div>
          </div>
          <div className="dialog__box__button__container">
            <button
              className="dialog__box__button"
              onClick={() => addFunction(candidateName, jobProfile)}
            >
              {" "}
              ADD
            </button>
            <button
              className="dialog__box__button"
              onClick={() => cancelFunction()}
            >
              CANCEL{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
