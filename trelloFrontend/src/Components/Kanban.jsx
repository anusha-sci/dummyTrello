import React, { useRef, useState } from "react";
import "./Kanban.scss";
import DialogBox from "./DialogBox";

function structureData(data) {
  const details = Object.entries(data)
    .slice(2)
    .map(([stepName, candidates]) => {
      return { stepName, candidates };
    });
  return details;
}

export default function Kanban({ data }) {
  const [dataList, setDataList] = useState(structureData(data));
  const [isAddCandidateClicked, setIsAddCandidateClicked] = useState(false);
  const [stepIndexToAddCandidate, setStepIndexToAddCandidate] = useState();
  const [dragging, setDragging] = useState(false);

  const dragItem = useRef();
  const dragNode = useRef();

  const saveChanges = () => {
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        companyName: data.companyName,
        PhoneScreen: dataList[0].candidates,
        Interview1: dataList[1].candidates,
        Interview2: dataList[2].candidates,
        Onsite: dataList[3].candidates,
        Decision: dataList[4].candidates,
      }),
      mode: "cors",
    };
    fetch("http://localhost:5000/saveMovement", requestOptions)
      .then((response) => response.json())
      .then((data) => console.log(data));
  };

  const handleDragStart = (e, params) => {
    dragItem.current = params;
    dragNode.current = e.target;
    dragNode.current.addEventListener("dragend", handleDragEnd);
    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  const handleDragEnd = () => {
    setDragging(false);
    dragNode.current.removeEventListener("dragend", handleDragEnd);
    dragItem.current = null;
    dragNode.current = null;
  };

  const handleDragEnter = (e, params) => {
    const currentItem = dragItem.current;
    if (e.target !== dragNode.current) {
      setDataList((oldList) => {
        let newList = JSON.parse(JSON.stringify(oldList));
        newList[params.stepIndex].candidates.splice(
          params.candidateIndex,
          0,
          newList[currentItem.stepIndex].candidates.splice(
            currentItem.candidateIndex,
            1
          )[0]
        );
        dragItem.current = params;
        return newList;
      });
    }
  };

  const handleAddCandidate = (candidateName, jobProfile) => {
    if (candidateName && jobProfile) {
      setDataList((oldList) => {
        let newList = JSON.parse(JSON.stringify(oldList));
        newList[stepIndexToAddCandidate].candidates.push({
          candidateName,
          jobProfile,
        });
        return newList;
      });
    }
    setIsAddCandidateClicked(false);
  };

  const closeFunction = () => {
    setIsAddCandidateClicked(false);
  };

  return (
    <div className="kanban__container">
      <h1>{data.companyName} </h1>
      <button id="save__button" onClick={saveChanges}>
        SAVE CHANGES
      </button>
      <div className="all__steps__container">
        {dataList.map(({ stepName, candidates }, stepIndex) => {
          return (
            <div
              key={stepName}
              className="interview__step__container"
              onDragEnter={
                dragging && !candidates.length
                  ? (e) => handleDragEnter(e, { stepIndex, candidateIndex: 0 })
                  : null
              }
            >
              <h3 className="group__title">{stepName} </h3>
              {candidates.map(
                ({ candidateName, jobProfile }, candidateIndex) => {
                  return (
                    <div
                      key={candidateName}
                      className="candidate__div"
                      draggable
                      onDragStart={(e) =>
                        handleDragStart(e, { stepIndex, candidateIndex })
                      }
                      onDragEnter={
                        dragging
                          ? (e) =>
                              handleDragEnter(e, { stepIndex, candidateIndex })
                          : null
                      }
                    >
                      <p className="candidate__name">{candidateName} </p>
                      <hr />
                      <p>{`Role: ${jobProfile}`} </p>
                    </div>
                  );
                }
              )}

              <button
                onClick={() => {
                  setIsAddCandidateClicked(true);
                  setStepIndexToAddCandidate(stepIndex);
                }}
              >
                Add Candidate
              </button>
            </div>
          );
        })}
      </div>
      {isAddCandidateClicked && (
        <DialogBox
          addFunction={handleAddCandidate}
          cancelFunction={closeFunction}
        />
      )}
    </div>
  );
}
