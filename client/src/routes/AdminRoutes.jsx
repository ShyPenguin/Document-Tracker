import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DocumentLayout from "../components/Documents/DocumentLayout";
import TrackLayout from "../components/DocumentTrack/TrackLayout";
import TypeLayout from "../components/DocumentTypes/TypeLayout";
import OfficeLayout from "../components/Offices/OfficeLayout";
import PageNotFound from "../components/PageNotFound";
import UserLayout from "../components/Users/UserLayout";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="documents" />} />
      <Route path="/offices/*" element={<OfficeLayout />} />
      <Route path="/types/*" element={<TypeLayout />} />
      <Route path="/users/*" element={<UserLayout />} />
      <Route path="/documents/*" element={<DocumentLayout />} />
      <Route path="/track/*" element={<TrackLayout />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default AdminRoutes;
