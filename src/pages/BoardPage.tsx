import Board from "../components/Board";
import ProjectLayout from "../components/layout/ProjectLayout";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const BoardPage = () => {
  const location = useLocation();

  useEffect(() => {
    console.log("BoardPage rendered with path:", location.pathname);
  }, [location]);

  return (
    <ProjectLayout requireTeam={true}>
      <Board />
    </ProjectLayout>
  );
};

export default BoardPage;
