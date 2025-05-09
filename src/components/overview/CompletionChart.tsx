import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styled from "@emotion/styled";

interface CompletionChartProps {
  completed: number;
  inProgress: number;
  toDo: number;
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

const COLORS = ["#4CAF50", "#FFC107", "#9E9E9E"];

const CompletionChart: React.FC<CompletionChartProps> = ({
  completed,
  inProgress,
  toDo,
}) => {
  const data = [
    { name: "Done", value: completed },
    { name: "In Progress", value: inProgress },
    { name: "To Do", value: toDo },
  ];

  const total = completed + inProgress + toDo;
  const completionPercentage =
    total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <ChartContainer>
      <ChartTitle>PBI Completion - {completionPercentage}% Complete</ChartTitle>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} items`, "Count"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default CompletionChart;
