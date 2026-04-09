import React from "react";

function PageNotFound() {
  return (
    <div class="not-found-container">
      <div class="not-found-overlay"></div>
      <div class="not-found-content">
        <h1 class="not-found-heading">404 Not Found</h1>
        <p class="not-found-message">The page you are looking for does not exist.</p>
      </div>
    </div>
  );
}

export default PageNotFound;
