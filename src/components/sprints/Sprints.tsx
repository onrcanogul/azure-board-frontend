import styled from "@emotion/styled";
import SprintHeader from "./SprintHeader";
import SprintList from "./SprintList";
import SprintFilterBar from "./SprintFilterBar";

const SprintsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

const Sprints = () => {
  return (
    <SprintsContainer>
      <SprintHeader />
      <SprintFilterBar />
      <SprintList />
    </SprintsContainer>
  );
};

export default Sprints;
