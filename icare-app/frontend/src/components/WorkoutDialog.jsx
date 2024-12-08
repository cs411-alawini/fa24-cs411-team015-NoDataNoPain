import React, { useState } from "react";
import "./Dialog.css"; // Use the same CSS as before

const WorkoutDialog = ({ title, isVisible, onClose, onSubmit }) => {
  const [workoutName, setWorkoutName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");

  const handleSubmit = () => {
    const data = { workoutName, sets, reps };
    onSubmit(data); // Pass data to parent
    setWorkoutName("");
    setSets("");
    setReps("");
    onClose(); // Close the dialog
  };

  if (!isVisible) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h3>{title}</h3>

        {/* Input for workout name */}
        <div>
          <label>
            Workout Name:
            <input
              type="text"
              placeholder="Enter workout name"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
            />
          </label>
        </div>

        {/* Input for number of sets */}
        <div>
          <label>
            Number of Sets:
            <input
              type="number"
              placeholder="Enter number of sets"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
            />
          </label>
        </div>

        {/* Input for number of reps */}
        <div>
          <label>
            Number of Reps:
            <input
              type="number"
              placeholder="Enter number of reps"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
            />
          </label>
        </div>

        <div className="dialog-buttons">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDialog;