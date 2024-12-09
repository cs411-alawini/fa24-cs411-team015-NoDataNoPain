import React from "react";
import "./ResultDialog.css"; // Custom CSS for ResultDialog


const ResultDialog = ({ isVisible, onClose, data }) => {
  if (!isVisible) return null;

  const hasResults = data.results && data.results.length > 0 && !data.results[0]?.message;

  return (
    <div className="result-dialog-overlay">
      <div className="result-dialog-box">
        <h3>Search Results</h3>
        <p>
          <strong>Keyword:</strong> {data.keyword || "N/A"} {/* Display the keyword */}
        </p>
        <p>
          <strong>Result:</strong>{" "}
          {hasResults
            ? data.results.map((item, index) => (
                <div key={index}>
                  {item.MealName
                    ? `Meal: ${item.MealName} (${item.CaloriesTotal} kcal)`
                    : `Workout: ${item.ExerciseName} (Reps: ${item.Reps}, Time: ${item.Time})`}
                </div>
              ))
            : data.results[0]?.message || "No data available"}
        </p>
        <div className="result-dialog-buttons">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultDialog;

// const ResultDialog = ({ isVisible, onClose, data }) => {
//   if (!isVisible) return null;

//   return (
//     <div className="result-dialog-overlay">
//       <div className="result-dialog-box">
//         <h3>Search Results</h3>
//         <p>
//           <strong>Type:</strong> {data?.selection || "N/A"}
//         </p>
//         <p>
//           <strong>Result:</strong> {data?.keyword || "N/A"}
//         </p>
//         <div className="result-dialog-buttons">
//           <button className="btn" onClick={onClose}>
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResultDialog;