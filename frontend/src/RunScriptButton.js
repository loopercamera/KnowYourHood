import React from "react";
import axios from "axios";

const RunScriptButton = () => {
  const runScript = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/OSM-streets/?x1=47.241&y1=8.452&x2=47.249&y2=8.471",
        {}
      );
      console.log("Script output:", response.data);
    } catch (error) {
      console.error("Error running script:", error);
    }
  };

  return (
    <div>
      <button onClick={runScript}>Run Script</button>
    </div>
  );
};

export default RunScriptButton;
