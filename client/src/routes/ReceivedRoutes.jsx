import React from "react";
import { Routes, Route } from "react-router-dom";
import PageNotFound from "../components/PageNotFound";
import ReceivedDView from "../components/Received/ReceivedDView";
import ReceivedView from "../components/Received/ReceivedView";

function ReceivedRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ReceivedView />} />
      <Route path="/view/:id" element={<ReceivedDView />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default ReceivedRoutes;
