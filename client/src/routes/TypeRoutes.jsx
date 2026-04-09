import React from "react";
import { Routes, Route } from "react-router-dom";
import TypesView from "../components/DocumentTypes/TypesView";
import CreateType from "../components/DocumentTypes/CreateType";
import TypeDView from "../components/DocumentTypes/TypeDView";
import PageNotFound from "../components/PageNotFound";
function TypeRoutes() {
  return (
    <Routes>
      <Route path="/" element={<TypesView />} />
      <Route path="/create" element={<CreateType />} />
      <Route path="/:id" element={<TypeDView />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default TypeRoutes;
