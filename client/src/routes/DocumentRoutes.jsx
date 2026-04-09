import React from "react";
import { Routes, Route } from "react-router-dom";
import DocumentsView from "../components/Documents/DocumentsView";
import DocumentCreate from "../components/Documents/DocumentCreate";
import DocumentDView from "../components/Documents/DocumentDView";
import PageNotFound from "../components/PageNotFound";
function DocumentRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DocumentsView />} />
      <Route path="/create" element={<DocumentCreate />} />
      <Route path="/:id" element={<DocumentDView />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default DocumentRoutes;
