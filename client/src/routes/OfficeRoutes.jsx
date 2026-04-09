import React from "react";
import { Routes, Route } from "react-router-dom";
import OfficesView from "../components/Offices/OfficesView";
import OfficeDView from "../components/Offices/OfficeDView";
import CreateOffice from "../components/Offices/CreateOffice";
import PageNotFound from "../components/PageNotFound";

function OfficeRoutes() {
  return (
    <Routes>
      <Route path="/" element={<OfficesView />} />
      <Route path="/create" element={<CreateOffice />} />
      <Route path="/:id" element={<OfficeDView />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default OfficeRoutes;
