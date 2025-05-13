import { initializeIcons } from "@fluentui/react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import BoardPage from "./pages/BoardPage";
import OverviewPage from "./pages/OverviewPage";
import EmptyPage from "./pages/EmptyPage";
import BacklogPage from "./pages/BacklogPage";
import SprintsPage from "./pages/SprintsPage";
import WorkItemPage from "./pages/WorkItemPage";
import AuthPage from "./pages/LoginPage";
import ToastManager from "./components/toast/ToastManager";
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
      <ToastManager />
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/boards" element={<BoardPage />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/work-items" element={<WorkItemPage />} />
        <Route path="/backlogs" element={<BacklogPage />} />
        <Route path="/sprints" element={<SprintsPage />} />

        {/* Ana sayfaya ve 404 sayfalarına yönlendirmeler */}
        <Route path="/" element={<Navigate to="/boards" />} />
        <Route path="*" element={<Navigate to="/boards" />} />
      </Routes>
    </>
  );
}

export default App;
