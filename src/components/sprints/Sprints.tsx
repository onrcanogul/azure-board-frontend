import { useState, useCallback } from "react";
import styled from "@emotion/styled";
import SprintHeader from "./SprintHeader";
import SprintList from "./SprintList";
import SprintFilterBar from "./SprintFilterBar";
import { SprintState } from "../../domain/models/sprint";

const SprintsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

interface FilterState {
  searchText: string;
  statusFilter: SprintState | "all";
}

const Sprints = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [filters, setFilters] = useState<FilterState>({
    searchText: "",
    statusFilter: "all",
  });

  const handleSprintCreated = useCallback(() => {
    // Increment the refresh trigger to cause the sprint list to reload
    setRefreshTrigger((prev) => prev + 1);
    console.log("Sprint created, refreshing list...");
  }, []);

  const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  }, []);

  return (
    <SprintsContainer>
      <SprintHeader onSprintCreated={handleSprintCreated} />
      <SprintFilterBar filters={filters} onFilterChange={handleFilterChange} />
      <SprintList key={refreshTrigger} filters={filters} />
    </SprintsContainer>
  );
};

export default Sprints;
