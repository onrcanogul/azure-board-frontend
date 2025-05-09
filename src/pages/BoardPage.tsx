import Board from "../components/Board";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const BoardPage = () => {
  const location = useLocation();

  useEffect(() => {
    console.log("BoardPage rendered with path:", location.pathname);
  }, [location]);

  return (
    <ResponsiveLayout>
      <Board />
    </ResponsiveLayout>
  );
};

export default BoardPage;
