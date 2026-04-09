import React from "react";
import { Routes, Route } from "react-router-dom";
import OutgoingDView from "../components/Outgoing/OutgoingDView";
import OutgoingView from "../components/Outgoing/OutgoingView";
import PageNotFound from "../components/PageNotFound";

function OutgoingRoutes() {
  return (
    <Routes>
      <Route path="/" element={<OutgoingView />} />
      <Route path="/view/:id" element={<OutgoingDView />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default OutgoingRoutes;
