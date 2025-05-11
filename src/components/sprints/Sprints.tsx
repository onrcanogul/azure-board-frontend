import { useState, useCallback } from "react";
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
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSprintCreated = useCallback(() => {
    // Increment the refresh trigger to cause the sprint list to reload
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <SprintsContainer>
      <SprintHeader onSprintCreated={handleSprintCreated} />
      <SprintFilterBar />
      <SprintList key={refreshTrigger} />
    </SprintsContainer>
  );
};

export default Sprints;
