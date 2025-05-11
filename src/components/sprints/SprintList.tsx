import { Stack } from "@fluentui/react";
import styled from "@emotion/styled";
import SprintCard from "./SprintCard";

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// Örnek sprint verileri
const mockSprints = [
  {
    id: "1",
    name: "Sprint 1",
    startDate: "2024-03-01",
    endDate: "2024-03-14",
    status: "active",
    completedPoints: 15,
    totalPoints: 20,
    workItems: [
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
    goal: "",
  },
  {
    id: "2",
    name: "Sprint 2",
    startDate: "2024-03-15",
    endDate: "2024-03-28",
    status: "future",
    completedPoints: 0,
    totalPoints: 25,
    workItems: [
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
    goal: "",
  },
  {
    id: "3",
    name: "Sprint 0",
    startDate: "2024-02-15",
    endDate: "2024-02-28",
    status: "completed",
    completedPoints: 18,
    totalPoints: 18,
    workItems: [
      {
        id: "301",
        title: "Project setup",
        type: "Task",
        status: "Done",
        points: 5,
      },
      {
        id: "302",
        title: "Database design",
        type: "Task",
        status: "Done",
        points: 8,
      },
      {
        id: "303",
        title: "Initial UI components",
        type: "Task",
        status: "Done",
        points: 5,
      },
    ],
    goal: "",
  },
  {
    id: "99",
    name: "Sprint Active",
    startDate: "2024-06-01",
    endDate: "2024-06-14",
    state: "ACTIVE",
    goal: "This is the active sprint's plan description.",
    projectId: "project-1",
    teamId: "team-1",
    isDeleted: false,
    workItems: [
      {
        id: "9991",
        title: "Active sprint task",
        type: "Task",
        status: "In Progress",
        points: 5,
      },
    ],
    goal: "",
  },
];

const SprintList = () => {
  return (
    <ListContainer>
      {mockSprints.map((sprint) => (
        <SprintCard key={sprint.id} sprint={sprint} />
      ))}
    </ListContainer>
  );
};

export default SprintList;
