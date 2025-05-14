import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import sprintService from "../../services/sprintService";
import type { Sprint } from "../../domain/models/sprint";

const SelectorContainer = styled.div`
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SprintLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #fff;
`;

const SprintSelect = styled.select`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #0078d4;
  background-color: #2d2d2d;
  color: #fff;
  font-size: 14px;
  min-width: 200px;
  cursor: pointer;

  &:focus {
    border-color: #0078d4;
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 120, 212, 0.5);
  }

  option {
    background-color: #2d2d2d;
    color: #fff;
    padding: 8px;
  }
`;

const LoadingText = styled.div`
  font-size: 14px;
  color: #fff;
`;

const ErrorText = styled.div`
  font-size: 14px;
  color: #f1707b;
  background-color: rgba(209, 52, 56, 0.1);
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #f1707b;
`;

interface SprintSelectorProps {
  onSelectSprint: (sprintId: string) => void;
}

const SprintSelector: React.FC<SprintSelectorProps> = ({ onSelectSprint }) => {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSprintId, setSelectedSprintId] = useState<string>("");

  useEffect(() => {
    const fetchSprints = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get teamId from localStorage
        const teamId = localStorage.getItem("selectedTeamId");

        if (!teamId) {
          setError("No team selected. Please select a team first.");
          setLoading(false);
          return;
        }

        // For testing: Manually create mock sprints until the backend is ready
        const mockSprints: Sprint[] = [
          {
            id: "sprint-1",
            name: "Sprint 1",
            startDate: new Date(),
            endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            goal: "Complete dashboard implementation",
            state: 1,
            projectId: "project-1",
            teamId: teamId,
          },
          {
            id: "sprint-2",
            name: "Sprint 2",
            startDate: new Date(),
            endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            goal: "Implement bug tracking",
            state: 0,
            projectId: "project-1",
            teamId: teamId,
          },
        ];

        try {
          // Try to get real data first
          const data = await sprintService.getByTeam(teamId);
          if (data && data.length > 0) {
            setSprints(data);
            setSelectedSprintId(data[0].id);
            onSelectSprint(data[0].id);
          } else {
            // Fallback to mock data
            console.log("Using mock sprint data");
            setSprints(mockSprints);
            setSelectedSprintId(mockSprints[0].id);
            onSelectSprint(mockSprints[0].id);
          }
        } catch (error) {
          console.error("Error fetching real sprints, using mock data:", error);
          setSprints(mockSprints);
          setSelectedSprintId(mockSprints[0].id);
          onSelectSprint(mockSprints[0].id);
        }
      } catch (err) {
        console.error("Error in sprint setup:", err);
        setError("Failed to load sprints. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSprints();
  }, [onSelectSprint]);

  const handleSprintChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sprintId = e.target.value;
    console.log("Sprint selected:", sprintId);
    setSelectedSprintId(sprintId);
    onSelectSprint(sprintId);
  };

  if (loading) {
    return <LoadingText>Loading sprints...</LoadingText>;
  }

  if (error) {
    return <ErrorText>{error}</ErrorText>;
  }

  return (
    <SelectorContainer>
      <SprintLabel htmlFor="sprint-select">Select Sprint:</SprintLabel>
      <SprintSelect
        id="sprint-select"
        value={selectedSprintId}
        onChange={handleSprintChange}
      >
        {sprints.map((sprint) => (
          <option key={sprint.id} value={sprint.id}>
            {sprint.name}
          </option>
        ))}
      </SprintSelect>
    </SelectorContainer>
  );
};

export default SprintSelector;
