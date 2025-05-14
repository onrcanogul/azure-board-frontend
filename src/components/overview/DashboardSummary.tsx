import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import type { Dashboard } from "../../domain/models/dashboard";
import dashboardService from "../../services/dashboardService";
import { useParams } from "react-router-dom";
import { PbiState } from "../../domain/models/productBacklogItem";
import { BugStatus } from "../../domain/models/bug";

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: #1e1e1e; /* Darker background to match the theme */
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const SectionTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: 600;
  color: #fff; /* White text for dark background */
  border-bottom: 1px solid #444;
  padding-bottom: 8px;
`;

const ItemsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
`;

const ItemCard = styled.div`
  background-color: #2d2d2d; /* Dark card background */
  border-radius: 6px;
  padding: 12px;
  border-left: 3px solid #0078d4;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);

  &.high-priority {
    border-left-color: #d13438;
  }

  &.medium-priority {
    border-left-color: #ffa500;
  }

  &.low-priority {
    border-left-color: #107c10;
  }
`;

const ItemTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 500;
  color: #fff; /* White text */
`;

const ItemMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #ccc; /* Light gray for meta info */
  margin-top: 10px;
`;

const StatusTag = styled.span`
  display: inline-block;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  background-color: rgba(0, 120, 212, 0.2);
  color: #0078d4;
  font-weight: 500;

  &.new {
    background-color: rgba(0, 120, 212, 0.2);
    color: #2b88d8;
  }

  &.active {
    background-color: rgba(0, 120, 212, 0.3);
    color: #0078d4;
  }

  &.resolved {
    background-color: rgba(16, 124, 16, 0.2);
    color: #107c10;
  }

  &.closed {
    background-color: rgba(96, 94, 92, 0.2);
    color: #c8c6c4;
  }
`;

interface DashboardSummaryProps {
  sprintId?: string;
  userId?: string;
  useMockData?: boolean;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  sprintId,
  userId,
  useMockData = false,
}) => {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const currentSprintId = sprintId || params.sprintId || "";
  const currentUserId = userId || params.userId || "";

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        let data;

        console.log(
          "DashboardSummary: Fetching dashboard, sprintId:",
          currentSprintId,
          "userId:",
          currentUserId
        );

        if (currentSprintId) {
          data = await dashboardService.getDashboardBySprint(currentSprintId);
        } else if (currentUserId) {
          data = await dashboardService.getDashboardByUser(currentUserId);
        } else {
          setError("No sprint ID or user ID provided");
          setLoading(false);
          return;
        }

        console.log("DashboardSummary: Dashboard data received:", data);

        if (!data || !data.productBacklogItems || !data.bugs) {
          console.error("DashboardSummary: Invalid dashboard data:", data);
          setError("Received invalid dashboard data");
          setLoading(false);
          return;
        }

        setDashboard(data);
      } catch (err) {
        console.error("DashboardSummary: Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (currentSprintId || currentUserId) {
      fetchDashboard();
    } else {
      setLoading(false);
      setError("No sprint or user selected");
    }
  }, [currentSprintId, currentUserId, useMockData]);

  const getPriorityClass = (priority: number): string => {
    if (priority <= 1) return "high-priority";
    if (priority <= 3) return "medium-priority";
    return "low-priority";
  };

  const getStatusClass = (status: string | PbiState | BugStatus): string => {
    let statusStr = String(status).toLowerCase();
    // Handle any unexpected status values
    if (["new", "active", "resolved", "closed"].includes(statusStr)) {
      return statusStr;
    }
    return "new"; // Default status class
  };

  const formatStatusDisplay = (
    status: string | PbiState | BugStatus
  ): string => {
    if (typeof status === "string") {
      return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }

    // Convert the enum value to a string
    const statusStr = String(status);

    // For PbiState, try to get the human-readable name
    if (Object.values(PbiState).includes(status as PbiState)) {
      const keys = Object.keys(PbiState).filter(
        (k) => PbiState[k as keyof typeof PbiState] === status
      );
      if (keys.length > 0) {
        return keys[0].charAt(0).toUpperCase() + keys[0].slice(1).toLowerCase();
      }
    }

    // For BugStatus, try to get the human-readable name
    if (Object.values(BugStatus).includes(status as BugStatus)) {
      const keys = Object.keys(BugStatus).filter(
        (k) => BugStatus[k as keyof typeof BugStatus] === status
      );
      if (keys.length > 0) {
        return keys[0].charAt(0).toUpperCase() + keys[0].slice(1).toLowerCase();
      }
    }

    // Fallback: just return the string value
    return statusStr;
  };

  if (loading) {
    return <div style={{ color: "white" }}>Loading dashboard data...</div>;
  }

  if (error) {
    return <div style={{ color: "#f1707b" }}>{error}</div>;
  }

  if (!dashboard) {
    return <div style={{ color: "white" }}>No dashboard data available</div>;
  }

  return (
    <DashboardContainer>
      <div>
        <SectionTitle>
          Product Backlog Items ({dashboard.productBacklogItems.length})
        </SectionTitle>
        <ItemsContainer>
          {dashboard.productBacklogItems.length > 0 ? (
            dashboard.productBacklogItems.map((pbi) => (
              <ItemCard key={pbi.id} className={getPriorityClass(pbi.priority)}>
                <ItemTitle>{pbi.description}</ItemTitle>
                <div>
                  <StatusTag className={getStatusClass(pbi.state)}>
                    {formatStatusDisplay(pbi.state)}
                  </StatusTag>
                </div>
                <ItemMeta>
                  <span>Story Points: {pbi.storyPoint}</span>
                  <span>Business Value: {pbi.businessValue}</span>
                </ItemMeta>
              </ItemCard>
            ))
          ) : (
            <div style={{ color: "white" }}>
              No product backlog items available
            </div>
          )}
        </ItemsContainer>
      </div>

      <div>
        <SectionTitle>Bugs ({dashboard.bugs.length})</SectionTitle>
        <ItemsContainer>
          {dashboard.bugs.length > 0 ? (
            dashboard.bugs.map((bug) => (
              <ItemCard key={bug.id} className={getPriorityClass(bug.priority)}>
                <ItemTitle>{bug.description}</ItemTitle>
                <div>
                  <StatusTag className={getStatusClass(bug.status)}>
                    {formatStatusDisplay(bug.status)}
                  </StatusTag>
                </div>
                <ItemMeta>
                  <span>Story Points: {bug.storyPoint}</span>
                  <span>Business Value: {bug.businessValue}</span>
                </ItemMeta>
              </ItemCard>
            ))
          ) : (
            <div style={{ color: "white" }}>No bugs available</div>
          )}
        </ItemsContainer>
      </div>
    </DashboardContainer>
  );
};

export default DashboardSummary;
