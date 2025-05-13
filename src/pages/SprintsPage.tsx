import ProjectLayout from "../components/layout/ProjectLayout";
import Sprints from "../components/sprints/Sprints";
import styled from "@emotion/styled";

const PageContainer = styled.div`
  padding: 12px;
  width: 99%;
  height: 100%;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const SprintsPage = () => {
  return (
    <ProjectLayout requireTeam={true}>
      <PageContainer>
        <Sprints />
      </PageContainer>
    </ProjectLayout>
  );
};

export default SprintsPage;
