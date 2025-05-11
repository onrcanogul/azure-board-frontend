import { TextField, Dropdown } from "@fluentui/react";
import type { IDropdownOption } from "@fluentui/react";
import styled from "@emotion/styled";

const FilterContainer = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #232422;
  border-radius: 8px;
  flex-wrap: wrap;
  width: 98%;

  @media (max-width: 768px) {
    padding: 12px;
    gap: 12px;
  }
`;

const FilterField = styled.div`
  flex: 1;
  min-width: 200px;

  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

const statusOptions: IDropdownOption[] = [
  { key: "all", text: "All Sprints" },
  { key: "PLANNED", text: "Planned" },
  { key: "ACTIVE", text: "Active" },
  { key: "COMPLETED", text: "Completed" },
  { key: "CANCELLED", text: "Cancelled" },
];

const SprintFilterBar = () => {
  return (
    <FilterContainer>
      <FilterField>
        <TextField
          placeholder="Search sprints..."
          styles={{
            root: { width: "100%" },
            field: { backgroundColor: "#2d2e2b", color: "#fff" },
          }}
        />
      </FilterField>
      <FilterField>
        <Dropdown
          placeholder="Select status"
          options={statusOptions}
          styles={{
            root: { width: "100%" },
            dropdown: { backgroundColor: "#2d2e2b", color: "#fff" },
          }}
        />
      </FilterField>
    </FilterContainer>
  );
};

export default SprintFilterBar;
