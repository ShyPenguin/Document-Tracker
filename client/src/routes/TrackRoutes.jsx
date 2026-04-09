import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TrackCreate from "../components/DocumentTrack/TrackCreate";
import TrackView from "../components/DocumentTrack/TrackView";
import TrackDView from "../components/DocumentTrack/TrackDView";
import { useSelector } from "react-redux";
import PageNotFound from "../components/PageNotFound";

function TrackRoutes() {
  const user = useSelector((state) => state.auth.user);
  return (
    <Routes>
      <Route path="/" element={<TrackView />} />
      <Route
        path="/create/:id"
        element={user.role == "admin" ? <TrackCreate /> : <Navigate to="/" />}
      />
      <Route path="/view/:id" element={<TrackDView />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default TrackRoutes;
