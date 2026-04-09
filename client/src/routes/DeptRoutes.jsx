import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DocumentLayout from "../components/Documents/DocumentLayout";
import TrackLayout from "../components/DocumentTrack/TrackLayout";
import IncomingLayout from "../components/Incoming/IncomingLayout";
import OutgoingLayout from "../components/Outgoing/OutgoingLayout";
import PageNotFound from "../components/PageNotFound";
import ReceivedLayout from "../components/Received/ReceivedLayout";
import ReturnedLayout from "../components/Returned/ReturnedLayout";
import ReturningLayout from "../components/Returning/ReturningLayout";

function DeptRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="documents" />} />
      <Route path="/documents/*" element={<DocumentLayout />} />
      <Route path="/track/*" element={<TrackLayout />} />
      <Route path="/incoming/*" element={<IncomingLayout />} />
      <Route path="/received/*" element={<ReceivedLayout />} />
      <Route path="/outgoing/*" element={<OutgoingLayout />} />
      <Route path="/returning/*" element={<ReturningLayout />} />
      <Route path="/returned/*" element={<ReturnedLayout />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default DeptRoutes;
