import React from "react";
import "./loading.css";
function Loading() {
  return (
    <div class="loading-container">
      <div class="loading-overlay"></div>
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <div class="loading-text">Loading...</div>
      </div>
    </div>

  );
}

export default Loading;
