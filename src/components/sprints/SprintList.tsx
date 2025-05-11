import { useEffect, useState } from "react";
import {
  Stack,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
} from "@fluentui/react";
import styled from "@emotion/styled";
import SprintCard from "./SprintCard";
import { SprintState } from "../../domain/models/sprint";
import type { Sprint } from "../../domain/models/sprint";

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CenteredContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px;
`;

// Mock sprint data
const mockSprints = [
  {
    id: "1",
    name: "Sprint 1",
    startDate: "2023-11-01",
    endDate: "2023-11-15",
    goal: "Complete user authentication flow",
    state: SprintState.COMPLETED,
    projectId: "project-1",
    teamId: "team-1",
  },
  {
    id: "2",
    name: "Sprint 2",
    startDate: "2023-11-16",
    endDate: "2023-11-30",
    goal: "Implement search functionality",
    state: SprintState.ACTIVE,
    projectId: "project-1",
    teamId: "team-1",
  },
  {
    id: "3",
    name: "Sprint 3",
    startDate: "2023-12-01",
    endDate: "2023-12-15",
    goal: "Add reporting features",
    state: SprintState.PLANNED,
    projectId: "project-1",
    teamId: "team-1",
  },
];

// Mock work items structure to supplement the Sprint data
const getWorkItemsForSprint = (sprintId: string) => {
  // This is a temporary function until we have the real work items API
  // In a real app, this would be fetched from the API
  const mockItems = {
    "1": [
      {
        id: "101",
        title: "Implement user authentication",
        type: "Task",
        status: "Done",
        points: 5,
      },
      {
        id: "102",
        title: "Fix login page bug",
        type: "Bug",
        status: "Done",
        points: 3,
      },
      {
        id: "103",
        title: "Add user profile feature",
        type: "Feature",
        status: "In Progress",
        points: 8,
      },
      {
        id: "104",
        title: "Update documentation",
        type: "Task",
        status: "To Do",
        points: 4,
      },
    ],
    "2": [
      {
        id: "201",
        title: "Implement search functionality",
        type: "Feature",
        status: "To Do",
        points: 8,
      },
      {
        id: "202",
        title: "Add filtering options",
        type: "Task",
        status: "To Do",
        points: 5,
      },
      {
        id: "203",
        title: "Create API endpoints",
        type: "Task",
        status: "To Do",
        points: 12,
      },
    ],
    "3": [
      {
        id: "301",
        title: "Design reporting dashboard",
        type: "Task",
        status: "To Do",
        points: 8,
      },
      {
        id: "302",
        title: "Create charts and graphs",
        type: "Feature",
        status: "To Do",
        points: 13,
      },
    ],
  };

  return mockItems[sprintId as keyof typeof mockItems] || [];
};

// Extend the Sprint type with UI-specific properties
interface EnhancedSprint {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  goal: string;
  state: SprintState;
  projectId: string;
  teamId: string;
  workItems: Array<{
    id: string;
    title: string;
    type: string;
    status: string;
    points: number;
  }>;
  completedPoints: number;
  totalPoints: number;
  status: "active" | "future" | "completed"; // UI status
  isDeleted?: boolean;
}

const SprintList = () => {
  const [sprints, setSprints] = useState<EnhancedSprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call delay
    const fetchSprints = () => {
      setLoading(true);
      setError(null);

      setTimeout(() => {
        try {
          // Enhance the mock sprints with UI data
          const enhancedSprints = mockSprints.map((sprint) => {
            const workItems = getWorkItemsForSprint(sprint.id);
            const totalPoints = workItems.reduce(
              (sum, item) => sum + item.points,
              0
            );
            const completedPoints = workItems
              .filter((item) => item.status === "Done")
              .reduce((sum, item) => sum + item.points, 0);

            // Map backend state to UI status
            let status: "active" | "future" | "completed";
            switch (sprint.state) {
              case SprintState.ACTIVE:
                status = "active";
                break;
              case SprintState.COMPLETED:
                status = "completed";
                break;
              default:
                // PLANNED or any other state is considered future
                status = "future";
            }

            return {
              ...sprint,
              startDate: new Date(sprint.startDate),
              endDate: new Date(sprint.endDate),
              workItems,
              completedPoints,
              totalPoints,
              status,
            };
          });

          setSprints(enhancedSprints);
          setLoading(false);
        } catch (err) {
          console.error("Failed to process sprint data:", err);
          setError("An error occurred while processing sprint data.");
          setLoading(false);
        }
      }, 1000); // 1 second delay to simulate network request
    };

    fetchSprints();
  }, []);

  if (loading) {
    return (
      <CenteredContent>
        <Spinner size={SpinnerSize.large} label="Loading sprints..." />
      </CenteredContent>
    );
  }

  if (error) {
    return (
      <MessageBar messageBarType={MessageBarType.error}>{error}</MessageBar>
    );
  }

  if (sprints.length === 0) {
    return (
      <MessageBar messageBarType={MessageBarType.info}>
        No sprints found. Create a new sprint to get started.
      </MessageBar>
    );
  }

  return (
    <ListContainer>
      {sprints.map((sprint) => (
        <SprintCard key={sprint.id} sprint={sprint as any} />
      ))}
    </ListContainer>
  );
};

export default SprintList;
