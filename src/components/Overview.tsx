import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import CompletionChart from "./overview/CompletionChart";
import SprintProgress from "./overview/SprintProgress";
import VelocityChart from "./overview/VelocityChart";
import PriorityDistribution from "./overview/PriorityDistribution";
import MetricsSummary from "./overview/MetricsSummary";
import DashboardSummary from "./overview/DashboardSummary";
import SprintSelector from "./overview/SprintSelector";
import dashboardService from "../services/dashboardService";
import type { Dashboard } from "../domain/models/dashboard";
import { PbiState } from "../domain/models/productBacklogItem";
import { BugStatus } from "../domain/models/bug";
import sprintService from "../services/sprintService";
import type { Sprint } from "../domain/models/sprint";

const OverviewContainer = styled.div`
  display: grid;
  grid-template-rows: auto auto auto auto 1fr;
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

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  font-size: 16px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
`;

const ErrorContainer = styled.div`
  padding: 20px;
  font-size: 16px;
  color: #f1707b;
  border: 1px solid #f1707b;
  background-color: rgba(209, 52, 56, 0.1);
  border-radius: 4px;
`;

const Overview: React.FC = () => {
  const [selectedSprintId, setSelectedSprintId] = useState<string>("");
  const [dashboardData, setDashboardData] = useState<Dashboard | null>(null);
  const [sprintDetails, setSprintDetails] = useState<Sprint | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Metrics derived from dashboard data
  const [completionData, setCompletionData] = useState({
    completed: 0,
    inProgress: 0,
    toDo: 0,
  });

  const [sprintData, setSprintData] = useState({
    sprintNumber: 0,
    totalPBIs: 0,
    completedPBIs: 0,
    daysLeft: 0,
  });

  const [priorityData, setPriorityData] = useState({
    high: 0,
    medium: 0,
    low: 0,
  });

  const [metricsData, setMetricsData] = useState({
    totalPBIs: 0,
    completedPBIs: 0,
    activeSprints: 1,
    teamMembers: 5,
    avgCycleTime: 0,
  });

  const [velocityData, setVelocityData] = useState([
    { sprintName: "Sprint 1", planned: 0, completed: 0 },
  ]);

  // Fetch sprint details when sprint is selected
  useEffect(() => {
    const fetchSprintDetails = async () => {
      if (!selectedSprintId) return;

      try {
        const sprintInfo = await sprintService.getById(selectedSprintId);
        setSprintDetails(sprintInfo);
        console.log("Sprint details:", sprintInfo);
      } catch (err) {
        console.error("Error fetching sprint details:", err);
        // Still continue with dashboard data fetch
      }
    };

    fetchSprintDetails();
  }, [selectedSprintId]);

  // Fetch dashboard data when sprint is selected
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!selectedSprintId) return;

      try {
        setLoading(true);
        setError(null);
        console.log("Fetching dashboard data for sprint:", selectedSprintId);

        const data = await dashboardService.getDashboardBySprint(
          selectedSprintId
        );
        setDashboardData(data);
        console.log("Dashboard data received:", data);

        // Process dashboard data to update charts
        updateChartsData(data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedSprintId]);

  // Calculate metrics from dashboard data
  const updateChartsData = (data: Dashboard) => {
    if (!data || !data.productBacklogItems) {
      console.error("Invalid dashboard data:", data);
      return;
    }

    try {
      // Calculate completion data
      const completed = data.productBacklogItems.filter(
        (pbi) =>
          pbi.state === PbiState.CLOSED || pbi.state === PbiState.RESOLVED
      ).length;

      const inProgress = data.productBacklogItems.filter(
        (pbi) => pbi.state === PbiState.ACTIVE
      ).length;

      const toDo = data.productBacklogItems.filter(
        (pbi) => pbi.state === PbiState.NEW
      ).length;

      setCompletionData({
        completed,
        inProgress,
        toDo,
      });

      // Calculate priority distribution
      const highPriority = [
        ...data.productBacklogItems.filter((pbi) => pbi.priority <= 1),
        ...data.bugs.filter((bug) => bug.priority <= 1),
      ].length;

      const mediumPriority = [
        ...data.productBacklogItems.filter(
          (pbi) => pbi.priority > 1 && pbi.priority <= 3
        ),
        ...data.bugs.filter((bug) => bug.priority > 1 && bug.priority <= 3),
      ].length;

      const lowPriority = [
        ...data.productBacklogItems.filter((pbi) => pbi.priority > 3),
        ...data.bugs.filter((bug) => bug.priority > 3),
      ].length;

      setPriorityData({
        high: highPriority,
        medium: mediumPriority,
        low: lowPriority,
      });

      // Calculate total and completed PBIs for metrics
      const totalPBIs = data.productBacklogItems.length;
      const totalBugs = data.bugs.length;
      const resolvedBugs = data.bugs.filter(
        (bug) =>
          bug.status === BugStatus.RESOLVED || bug.status === BugStatus.CLOSED
      ).length;

      // Calculate total story points
      const totalStoryPoints = data.productBacklogItems.reduce(
        (sum, pbi) => sum + (pbi.storyPoint || 0),
        0
      );

      // Calculate completed story points
      const completedStoryPoints = data.productBacklogItems
        .filter(
          (pbi) =>
            pbi.state === PbiState.CLOSED || pbi.state === PbiState.RESOLVED
        )
        .reduce((sum, pbi) => sum + (pbi.storyPoint || 0), 0);

      // Calculate average cycle time (days from started to completed)
      const cycleTimeItems = data.productBacklogItems
        .filter((pbi) => pbi.completedDate && pbi.startedDate)
        .map((pbi) => {
          const started = new Date(pbi.startedDate).getTime();
          const completed = new Date(pbi.completedDate).getTime();
          return (completed - started) / (1000 * 60 * 60 * 24); // Convert to days
        });

      const avgCycleTime =
        cycleTimeItems.length > 0
          ? cycleTimeItems.reduce((sum, time) => sum + time, 0) /
            cycleTimeItems.length
          : 0;

      setMetricsData((prev) => ({
        ...prev,
        totalPBIs,
        completedPBIs: completed,
        totalItems: totalPBIs + totalBugs,
        completedItems: completed + resolvedBugs,
        avgCycleTime: avgCycleTime,
      }));

      // Update velocity data based on current sprint
      setVelocityData([
        {
          sprintName: `Sprint ${getSprintNumber()}`,
          planned: totalStoryPoints,
          completed: completedStoryPoints,
        },
      ]);

      // Calculate sprint progress data
      setSprintData({
        sprintNumber: getSprintNumber(),
        totalPBIs: data.productBacklogItems.length,
        completedPBIs: completed,
        daysLeft: calculateDaysLeft(),
      });

      console.log("Charts data updated:", {
        completionData: { completed, inProgress, toDo },
        priorityData: {
          high: highPriority,
          medium: mediumPriority,
          low: lowPriority,
        },
        metricsData: { totalPBIs, completedPBIs: completed, avgCycleTime },
        sprintData: {
          sprintNumber: getSprintNumber(),
          totalPBIs,
          completedPBIs: completed,
          daysLeft: calculateDaysLeft(),
        },
        velocityData: {
          planned: totalStoryPoints,
          completed: completedStoryPoints,
        },
      });
    } catch (error) {
      console.error("Error updating charts data:", error);
    }
  };

  // Calculate days left in the sprint
  const calculateDaysLeft = (): number => {
    if (!sprintDetails || !sprintDetails.endDate) {
      return 0;
    }

    try {
      const endDate = new Date(sprintDetails.endDate);
      const today = new Date();

      // Return 0 if sprint is already over
      if (endDate < today) {
        return 0;
      }

      // Calculate days difference
      const diffTime = endDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (error) {
      console.error("Error calculating days left:", error);
      return 0;
    }
  };

  // Get sprint number from the ID or from sprint details
  const getSprintNumber = (): number => {
    if (sprintDetails && sprintDetails.name) {
      // Try to extract number from sprint name (e.g., "Sprint 3" -> 3)
      const match = sprintDetails.name.match(/\d+/);
      if (match) {
        return parseInt(match[0]);
      }
    }

    // Fallback: try to extract from ID
    if (selectedSprintId) {
      const match = selectedSprintId.match(/\d+/);
      if (match) {
        return parseInt(match[0]);
      }
    }

    return 0;
  };

  const handleSelectSprint = (sprintId: string) => {
    console.log("Sprint selected in Overview:", sprintId);
    setSelectedSprintId(sprintId);
  };

  return (
    <OverviewContainer>
      <SprintSelector onSelectSprint={handleSelectSprint} />

      {loading ? (
        <LoadingContainer>Loading dashboard data...</LoadingContainer>
      ) : error ? (
        <ErrorContainer>{error}</ErrorContainer>
      ) : (
        <>
          <MetricsSummary
            totalPBIs={metricsData.totalPBIs}
            completedPBIs={metricsData.completedPBIs}
            activeSprints={metricsData.activeSprints}
            teamMembers={metricsData.teamMembers}
            avgCycleTime={metricsData.avgCycleTime}
          />

          <ChartsGrid>
            <CompletionChart
              completed={completionData.completed}
              inProgress={completionData.inProgress}
              toDo={completionData.toDo}
            />

            <PriorityDistribution
              high={priorityData.high}
              medium={priorityData.medium}
              low={priorityData.low}
            />

            <SprintProgress
              sprintNumber={sprintData.sprintNumber}
              totalPBIs={sprintData.totalPBIs}
              completedPBIs={sprintData.completedPBIs}
              daysLeft={sprintData.daysLeft}
            />

            <VelocityChart sprintData={velocityData} />
          </ChartsGrid>

          {dashboardData && <DashboardSummary sprintId={selectedSprintId} />}
        </>
      )}
    </OverviewContainer>
  );
};

export default Overview;
