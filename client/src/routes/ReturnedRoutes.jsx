import React from "react";
import { Routes, Route } from "react-router-dom";
import PageNotFound from "../components/PageNotFound";
import ReturnedDView from "../components/Returned/ReturnedDView";
import ReturnedView from "../components/Returned/ReturnedView";

function ReturnedRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ReturnedView />} />
      <Route path="/view/:id" element={<ReturnedDView />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default ReturnedRoutes;
