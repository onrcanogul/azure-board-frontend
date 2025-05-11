import { initializeIcons } from "@fluentui/react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import BoardPage from "./pages/BoardPage";
import OverviewPage from "./pages/OverviewPage";
import EmptyPage from "./pages/EmptyPage";
import BacklogPage from "./pages/BacklogPage";
import SprintsPage from "./pages/SprintsPage";
import "./App.css";

initializeIcons();

function App() {
  const location = useLocation();

  // URL değişikliklerini debug için konsola logla
  useEffect(() => {
    console.log("App: Current URL is", location.pathname);
  }, [location]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/boards" />} />
        <Route path="/boards" element={<BoardPage />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/work-items" element={<EmptyPage />} />
        <Route path="/backlogs" element={<BacklogPage />} />
        <Route path="/sprints" element={<SprintsPage />} />
        <Route path="*" element={<Navigate to="/boards" />} />
      </Routes>
    </>
  );
}

export default App;
