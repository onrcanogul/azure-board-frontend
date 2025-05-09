import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styled from "@emotion/styled";

interface SprintData {
  sprintName: string;
  planned: number;
  completed: number;
}

interface VelocityChartProps {
  sprintData: SprintData[];
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

const VelocityChart: React.FC<VelocityChartProps> = ({ sprintData }) => {
  // Calculate average velocity (completed PBIs across sprints)
  const totalCompleted = sprintData.reduce(
    (sum, sprint) => sum + sprint.completed,
    0
  );
  const averageVelocity =
    sprintData.length > 0 ? Math.round(totalCompleted / sprintData.length) : 0;

  return (
    <ChartContainer>
      <ChartTitle>
        Team Velocity - Average: {averageVelocity} PBIs per Sprint
      </ChartTitle>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={sprintData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="sprintName" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="planned"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            name="Planned PBIs"
          />
          <Line
            type="monotone"
            dataKey="completed"
            stroke="#4CAF50"
            name="Completed PBIs"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default VelocityChart;
