import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styled from "@emotion/styled";

interface SprintProgressProps {
  sprintNumber: number;
  totalPBIs: number;
  completedPBIs: number;
  daysLeft: number;
}

const ChartContainer = styled.div`
  background: #232422;
  border-radius: 8px;
  padding: 16px;
  height: 250px;
  margin-bottom: 16px;

  @media (min-width: 768px) {
    height: 300px;
    padding: 20px;
    margin-bottom: 20px;
  }
`;

const ChartTitle = styled.h2`
  color: #fff;
  font-size: 16px;
  margin-top: 0;
  margin-bottom: 12px;

  @media (min-width: 768px) {
    font-size: 18px;
    margin-bottom: 16px;
  }
`;

const SprintInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;

  @media (min-width: 768px) {
    margin-bottom: 16px;
  }
`;

const InfoItem = styled.div`
  text-align: center;
  background: #1e1f1c;
  border-radius: 6px;
  padding: 8px;
  flex: 1;
  margin: 0 4px;

  &:first-of-type {
    margin-left: 0;
  }

  &:last-of-type {
    margin-right: 0;
  }

  @media (min-width: 768px) {
    padding: 12px;
    margin: 0 8px;
  }
`;

const InfoValue = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #fff;

  @media (min-width: 768px) {
    font-size: 24px;
  }
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: #bdbdbd;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const SprintProgress: React.FC<SprintProgressProps> = ({
  sprintNumber,
  totalPBIs,
  completedPBIs,
  daysLeft,
}) => {
  const data = [
    {
      name: "Current Sprint",
      Total: totalPBIs,
      Completed: completedPBIs,
      InProgress: totalPBIs - completedPBIs,
    },
  ];

  const completionPercentage =
    totalPBIs > 0 ? Math.round((completedPBIs / totalPBIs) * 100) : 0;

  return (
    <ChartContainer>
      <ChartTitle>Sprint {sprintNumber} Progress</ChartTitle>

      <SprintInfoContainer>
        <InfoItem>
          <InfoValue>
            {completedPBIs}/{totalPBIs}
          </InfoValue>
          <InfoLabel>PBIs Complete</InfoLabel>
        </InfoItem>
        <InfoItem>
          <InfoValue>{completionPercentage}%</InfoValue>
          <InfoLabel>Completion</InfoLabel>
        </InfoItem>
        <InfoItem>
          <InfoValue>{daysLeft}</InfoValue>
          <InfoLabel>Days Left</InfoLabel>
        </InfoItem>
      </SprintInfoContainer>

      <ResponsiveContainer width="100%" height="60%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Total" fill="#8884d8" />
          <Bar dataKey="Completed" fill="#4CAF50" />
          <Bar dataKey="InProgress" fill="#FFC107" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default SprintProgress;
