import React, { useState, useEffect } from "react";
import axios from "axios";

function Train() {
  const [trainingStatus, setTrainingStatus] = useState("train");
  const [dropdownValue, setDropdownValue] = useState(50);

  const handleTrainClick = () => {
    if (trainingStatus === "train") {
      setTrainingStatus("training");
      axios
        .post("http://127.0.0.1:3001/api/ml/train", { count: dropdownValue })
        .then((response) => {
          if (response.status === 200) {
            setTrainingStatus("training completed");
            setTimeout(() => {
              setTrainingStatus("train");
            }, 5000);
          }
        })
        .catch((error) => {
          console.error("Error occurred during training:", error);
          setTrainingStatus("train");
        });
    }
  };

  useEffect(() => {
    // Reset training status when component unmounts
    return () => {
      setTrainingStatus("train");
    };
  }, []);

  const handleDropdownChange = (event) => {
    setDropdownValue(event.target.value);
  };

  return (
    <div>
      <div className="text-lg font-semibold mb-4">Train Model</div>
      <p className="text-sm text-gray-600 mb-4">
        Please ensure that all necessary data is placed in the dataset folder
        before proceeding. Additionally, select the number of data points to use
        for each emotion, noting that using a higher number of data points will
        consume more hardware resources and time.
      </p>
      <div className="col">
        <select value={dropdownValue} onChange={handleDropdownChange}>
          {[...Array(20).keys()].map((_, i) => (
            <option key={i} value={(i + 1) * 10}>
              {(i + 1) * 10}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-center px-3">
        <div
          className={`mx-10 h-16 w-16 flex items-center justify-center rounded-full bg-green-500 text-white cursor-pointer transition duration-300 ${
            trainingStatus === "training" ? "opacity-50" : ""
          }`}
          onClick={handleTrainClick}
        >
          {trainingStatus}
        </div>
      </div>
    </div>
  );
}

export default Train;
