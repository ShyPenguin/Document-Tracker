import React from "react";
import "./error.css";
function Error({ error, setError }) {
  return (
    <div class="error-container">
      <div class="error-overlay"></div>
      <div class="error-content">
        <h1 class="error-heading">Error!</h1>
        <p class="error-message">{error}</p>
        <button class="dismiss-button" onClick={() => setError(false)}>Dismiss</button>
      </div>
    </div>
  );
}

export default Error;
