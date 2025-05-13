import { TextField, Dropdown } from "@fluentui/react";
import type { IDropdownOption } from "@fluentui/react";
import styled from "@emotion/styled";
import { SprintState } from "../../domain/models/sprint";

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

interface FilterState {
  searchText: string;
  statusFilter: SprintState | "all";
}

interface SprintFilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
}

const statusOptions: IDropdownOption[] = [
  { key: "all", text: "Tüm Sprintler" },
  { key: SprintState.INACTIVE, text: "Inaktif" },
  { key: SprintState.ACTIVE, text: "Aktif" },
];

const SprintFilterBar: React.FC<SprintFilterBarProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <FilterContainer>
      <FilterField>
        <TextField
          placeholder="Sprint ara..."
          value={filters.searchText}
          onChange={(_, newValue) =>
            onFilterChange({ searchText: newValue || "" })
          }
          styles={{
            root: { width: "100%" },
            field: { backgroundColor: "#1e1f1c", color: "#ffffff" },
            fieldGroup: { borderColor: "#323232" },
          }}
        />
      </FilterField>
      <FilterField>
        <Dropdown
          placeholder="Durum seçin"
          selectedKey={filters.statusFilter}
          options={statusOptions}
          onChange={(_, option) =>
            option &&
            onFilterChange({ statusFilter: option.key as SprintState | "all" })
          }
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
