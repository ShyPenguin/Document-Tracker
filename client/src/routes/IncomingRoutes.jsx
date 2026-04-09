import React from "react";
import { Routes, Route } from "react-router-dom";
import IncomingDView from "../components/Incoming/IncomingDView";
import IncomingView from "../components/Incoming/IncomingView";
import PageNotFound from "../components/PageNotFound";

function IncomingRoutes() {
  return (
    <Routes>
      <Route path="/" element={<IncomingView />} />
      <Route path="/view/:id" element={<IncomingDView />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default IncomingRoutes;
