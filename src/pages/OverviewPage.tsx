import Overview from "../components/Overview";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const OverviewPage = () => {
  const location = useLocation();

  useEffect(() => {
    console.log("OverviewPage rendered with path:", location.pathname);
  }, [location]);

  return (
    <ResponsiveLayout title="Project Overview - OO Team">
      <Overview />
    </ResponsiveLayout>
  );
};

export default OverviewPage;
