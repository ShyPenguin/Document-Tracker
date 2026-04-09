import React from "react";
import { Routes, Route } from "react-router-dom";
import PageNotFound from "../components/PageNotFound";
import ReturningDView from "../components/Returning/ReturningDView";
import ReturningView from "../components/Returning/ReturningView";

function ReturningRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ReturningView />} />
      <Route path="view/:id" element={<ReturningDView />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default ReturningRoutes;
