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

interface PriorityDistributionProps {
  high: number;
  medium: number;
  low: number;
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

const COLORS = ["#F44336", "#FFC107", "#2196F3"];

const PriorityDistribution: React.FC<PriorityDistributionProps> = ({
  high,
  medium,
  low,
}) => {
  const data = [
    { name: "High", value: high },
    { name: "Medium", value: medium },
    { name: "Low", value: low },
  ];

  return (
    <ChartContainer>
      <ChartTitle>PBI Priority Distribution</ChartTitle>
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

export default PriorityDistribution;
