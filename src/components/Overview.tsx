import React from "react";
import styled from "@emotion/styled";
import CompletionChart from "./overview/CompletionChart";
import SprintProgress from "./overview/SprintProgress";
import VelocityChart from "./overview/VelocityChart";
import PriorityDistribution from "./overview/PriorityDistribution";
import MetricsSummary from "./overview/MetricsSummary";

const OverviewContainer = styled.div`
  display: grid;
  grid-template-rows: auto auto 1fr;
  gap: 16px;
  padding: 16px;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 768px) {
    padding: 24px;
    gap: 24px;
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;

  @media (min-width: 768px) {
    gap: 24px;
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Overview: React.FC = () => {
  // Mock data - in a real application, this would come from your state or API
  const mockCompletionData = {
    completed: 14,
    inProgress: 7,
    toDo: 9,
  };

  const mockSprintData = {
    sprintNumber: 3,
    totalPBIs: 12,
    completedPBIs: 8,
    daysLeft: 5,
  };

  const mockVelocityData = [
    { sprintName: "Sprint 1", planned: 10, completed: 8 },
    { sprintName: "Sprint 2", planned: 12, completed: 10 },
    { sprintName: "Sprint 3", planned: 12, completed: 8 },
    { sprintName: "Sprint 4", planned: 14, completed: 11 },
  ];

  const mockPriorityData = {
    high: 6,
    medium: 15,
    low: 9,
  };

  const mockMetricsData = {
    totalPBIs: 30,
    completedPBIs: 14,
    activeSprints: 1,
    teamMembers: 5,
    avgCycleTime: 4.5,
  };

  return (
    <OverviewContainer>
      <MetricsSummary
        totalPBIs={mockMetricsData.totalPBIs}
        completedPBIs={mockMetricsData.completedPBIs}
        activeSprints={mockMetricsData.activeSprints}
        teamMembers={mockMetricsData.teamMembers}
        avgCycleTime={mockMetricsData.avgCycleTime}
      />

      <ChartsGrid>
        <CompletionChart
          completed={mockCompletionData.completed}
          inProgress={mockCompletionData.inProgress}
          toDo={mockCompletionData.toDo}
        />

        <PriorityDistribution
          high={mockPriorityData.high}
          medium={mockPriorityData.medium}
          low={mockPriorityData.low}
        />

        <SprintProgress
          sprintNumber={mockSprintData.sprintNumber}
          totalPBIs={mockSprintData.totalPBIs}
          completedPBIs={mockSprintData.completedPBIs}
          daysLeft={mockSprintData.daysLeft}
        />

        <VelocityChart sprintData={mockVelocityData} />
      </ChartsGrid>
    </OverviewContainer>
  );
};

export default Overview;
