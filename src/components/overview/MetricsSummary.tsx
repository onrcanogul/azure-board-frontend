import React from "react";
import styled from "@emotion/styled";
import { Icon } from "@fluentui/react";

interface MetricsSummaryProps {
  totalPBIs: number;
  completedPBIs: number;
  activeSprints: number;
  teamMembers: number;
  avgCycleTime: number;
}

const MetricsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 20px;

  @media (min-width: 480px) {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 16px;
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
`;

const MetricCard = styled.div`
  background: #232422;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 768px) {
    padding: 20px;
  }
`;

const MetricValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin: 8px 0;

  @media (min-width: 768px) {
    font-size: 32px;
    margin: 12px 0;
  }
`;

const MetricLabel = styled.div`
  font-size: 12px;
  color: #bdbdbd;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const IconContainer = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;

  @media (min-width: 768px) {
    width: 48px;
    height: 48px;
    margin-bottom: 8px;
  }
`;

const MetricsSummary: React.FC<MetricsSummaryProps> = ({
  totalPBIs,
  completedPBIs,
  activeSprints,
  teamMembers,
  avgCycleTime,
}) => {
  const metrics = [
    {
      label: "Total PBIs",
      value: totalPBIs,
      icon: "ViewList",
      iconColor: "#0078d4",
      iconBg: "rgba(0, 120, 212, 0.2)",
    },
    {
      label: "Completed PBIs",
      value: completedPBIs,
      icon: "CheckMark",
      iconColor: "#4CAF50",
      iconBg: "rgba(76, 175, 80, 0.2)",
    },
    {
      label: "Active Sprints",
      value: activeSprints,
      icon: "Sprint",
      iconColor: "#FFC107",
      iconBg: "rgba(255, 193, 7, 0.2)",
    },
    {
      label: "Team Members",
      value: teamMembers,
      icon: "People",
      iconColor: "#E91E63",
      iconBg: "rgba(233, 30, 99, 0.2)",
    },
    {
      label: "Avg. Cycle Time (days)",
      value: avgCycleTime,
      icon: "TimeEntry",
      iconColor: "#9C27B0",
      iconBg: "rgba(156, 39, 176, 0.2)",
    },
  ];

  return (
    <MetricsContainer>
      {metrics.map((metric, index) => (
        <MetricCard key={index}>
          <IconContainer style={{ background: metric.iconBg }}>
            <Icon
              iconName={metric.icon}
              style={{
                color: metric.iconColor,
                fontSize: window.innerWidth < 768 ? 20 : 24,
              }}
            />
          </IconContainer>
          <MetricValue>{metric.value}</MetricValue>
          <MetricLabel>{metric.label}</MetricLabel>
        </MetricCard>
      ))}
    </MetricsContainer>
  );
};

export default MetricsSummary;
