import React from "react";
import { Routes, Route } from "react-router-dom";
import PageNotFound from "../components/PageNotFound";
import CreateUser from "../components/Users/CreateUser";
import UsersView from "../components/Users/UsersView";

function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<UsersView />} />
      <Route path="/create" element={<CreateUser />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default UserRoutes;
