import { TextField, Dropdown } from "@fluentui/react";
import type { IDropdownOption } from "@fluentui/react";
import styled from "@emotion/styled";

const FilterContainer = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #1e1f1c;
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
            field: { backgroundColor: "#1e1f1c", color: "#ffffff" },
            fieldGroup: { borderColor: "#323232" },
          }}
        />
      </FilterField>
      <FilterField>
        <Dropdown
          placeholder="Select status"
          options={statusOptions}
          styles={{
            root: { width: "100%" },
            dropdown: { backgroundColor: "#1e1f1c", color: "#ffffff" },
            title: { backgroundColor: "#1e1f1c", color: "#ffffff" },
            caretDownWrapper: { color: "#ffffff" },
          }}
        />
      </FilterField>
    </FilterContainer>
  );
};

export default SprintFilterBar;
