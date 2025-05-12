import styled from "@emotion/styled";
import { Icon, Dropdown } from "@fluentui/react";
import type { IDropdownOption } from "@fluentui/react";
import { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

const FilterBar = styled.div`
  background: #232422;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #333;
  gap: 8px;
  flex-wrap: wrap;

  @media (min-width: 768px) {
    padding: 8px 24px;
    gap: 12px;
  }

  @media (min-width: 1024px) {
    padding: 8px 32px;
    gap: 16px;
    flex-wrap: nowrap;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  background: #232422;
  border-radius: 4px;
  border: 1px solid #333;
  padding: 0 8px;
  height: 36px;
  min-width: 150px;
  flex-grow: 1;

  @media (min-width: 768px) {
    min-width: 200px;
    flex-grow: 0;
  }
`;

const Input = styled.input`
  background: transparent;
  color: #fff;
  border: none;
  outline: none;
  padding: 8px 6px;
  font-size: 14px;
  width: 100%;

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

const DropdownWrapper = styled.div`
  display: flex;
  align-items: center;
  background: #232422;
  border-radius: 4px;
  border: 1px solid #333;
  padding: 0 8px;
  height: 36px;
  min-width: 150px;
  flex-grow: 1;

  @media (min-width: 768px) {
    min-width: 200px;
    flex-grow: 0;
  }
`;

const CloseBtn = styled.div`
  color: #bdbdbd;
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
  border-radius: 50%;
  transition: background 0.15s;
  &:hover {
    background: #333;
    color: #fff;
  }

  @media (max-width: 767px) {
    display: none;
  }
`;

// Added MoreButton for mobile view to expand/collapse filters
const MoreButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #232422;
  color: #fff;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 6px 10px;
  cursor: pointer;

  &:hover {
    border-color: #4fa3ff;
  }

  @media (min-width: 1024px) {
    display: none;
  }
`;

const typeOptions: IDropdownOption[] = [
  { key: "all", text: "All Types" },
  { key: "Task", text: "Task" },
  { key: "Bug", text: "Bug" },
  { key: "Feature", text: "Feature" },
];
const assignedOptions: IDropdownOption[] = [
  { key: "all", text: "Anyone" },
  { key: "onurcan", text: "Onur Can Oğul" },
  { key: "salih", text: "Muhammed Salih Koç" },
  { key: "ayse", text: "Ayşe Yılmaz" },
];
const stateOptions: IDropdownOption[] = [
  { key: "all", text: "All States" },
  { key: "To Do", text: "To Do" },
  { key: "In Progress", text: "In Progress" },
  { key: "Done", text: "Done" },
];
const appOptions: IDropdownOption[] = [
  { key: "all", text: "All Apps" },
  { key: "onurcan", text: "Onurcan Apps" },
];
const tagOptions: IDropdownOption[] = [
  { key: "all", text: "All Tags" },
  { key: "frontend", text: "Frontend" },
  { key: "backend", text: "Backend" },
];
const unparentedOptions: IDropdownOption[] = [
  { key: "all", text: "All" },
  { key: "unparented", text: "Unparented" },
];

interface BoardFilterBarProps {
  selectedType?: string;
  onTypeChange?: (type: string) => void;
  workItemTypes?: string[];
}

const BoardFilterBar = ({
  selectedType = "all",
  onTypeChange = () => {},
  workItemTypes = ["PBI", "Bug", "Feature", "Epic"],
}: BoardFilterBarProps) => {
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [sprintOptions, setSprintOptions] = useState<
    { key: string; text: string }[]
  >([]);
  const [selectedSprint, setSelectedSprint] = useState<string>("");
  const [selectedAssigned, setSelectedAssigned] = useState<string>("all");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [selectedApp, setSelectedApp] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [selectedUnparented, setSelectedUnparented] = useState<string>("all");
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Convert workItemTypes to dropdown options
  const workItemTypeOptions: IDropdownOption[] = [
    ...workItemTypes.map((type) => ({ key: type, text: type })),
  ];

  useEffect(() => {
    const sprints = [
      { key: "Sprint 1", text: "Sprint 1" },
      { key: "Sprint 2", text: "Sprint 2" },
      { key: "Sprint 0", text: "Sprint 0" },
    ];
    setSprintOptions(sprints);
  }, []);

  useEffect(() => {
    const sprintFromUrl = searchParams.get("sprint");
    if (sprintFromUrl) {
      setSelectedSprint(sprintFromUrl);
    }
  }, [location.search]);

  const handleTypeChange = (
    _: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ) => {
    if (option && onTypeChange) {
      onTypeChange(option.key as string);
    }
  };

  const essentialFilters = (
    <>
      <InputWrapper>
        <Icon
          iconName="Filter"
          style={{ color: "#bdbdbd", fontSize: 18, marginRight: 6 }}
        />
        <Input placeholder="Filter by keyword" />
      </InputWrapper>
      <Dropdown
        placeholder="Work Item Type"
        options={workItemTypeOptions}
        selectedKey={selectedType}
        onChange={handleTypeChange}
        styles={{
          root: { minWidth: 120, marginLeft: 8 },
          dropdown: {
            background: "#232422",
            color: "#fff",
            border: "1px solid #333",
          },
          title: {
            background: "#232422",
            color: "#fff",
            border: "1px solid #333",
          },
          caretDownWrapper: { color: "#fff" },
          dropdownItem: { background: "#232422", color: "#fff" },
          dropdownItemSelected: { background: "#181a17", color: "#4fa3ff" },
        }}
      />
    </>
  );

  const additionalFilters = (
    <>
      <Dropdown
        placeholder="Assigned to"
        options={assignedOptions}
        selectedKey={selectedAssigned}
        onChange={(_, o) => setSelectedAssigned(o?.key as string)}
        styles={{
          root: { minWidth: 140, marginLeft: 8 },
          dropdown: {
            background: "#232422",
            color: "#fff",
            border: "1px solid #333",
          },
          title: {
            background: "#232422",
            color: "#fff",
            border: "1px solid #333",
          },
          caretDownWrapper: { color: "#fff" },
          dropdownItem: { background: "#232422", color: "#fff" },
          dropdownItemSelected: { background: "#181a17", color: "#4fa3ff" },
        }}
      />
      <Dropdown
        placeholder="States"
        options={stateOptions}
        selectedKey={selectedState}
        onChange={(_, o) => setSelectedState(o?.key as string)}
        styles={{
          root: { minWidth: 120, marginLeft: 8 },
          dropdown: {
            background: "#232422",
            color: "#fff",
            border: "1px solid #333",
          },
          title: {
            background: "#232422",
            color: "#fff",
            border: "1px solid #333",
          },
          caretDownWrapper: { color: "#fff" },
          dropdownItem: { background: "#232422", color: "#fff" },
          dropdownItemSelected: { background: "#181a17", color: "#4fa3ff" },
        }}
      />
      <Dropdown
        placeholder="Onurcan Apps"
        options={appOptions}
        selectedKey={selectedApp}
        onChange={(_, o) => setSelectedApp(o?.key as string)}
        styles={{
          root: { minWidth: 140, marginLeft: 8 },
          dropdown: {
            background: "#232422",
            color: "#fff",
            border: "1px solid #333",
          },
          title: {
            background: "#232422",
            color: "#fff",
            border: "1px solid #333",
          },
          caretDownWrapper: { color: "#fff" },
          dropdownItem: { background: "#232422", color: "#fff" },
          dropdownItemSelected: { background: "#181a17", color: "#4fa3ff" },
        }}
      />
      <Dropdown
        placeholder="Iteration"
        options={sprintOptions.map((s) => ({ key: s.key, text: s.text }))}
        selectedKey={selectedSprint}
        onChange={(_, o) => setSelectedSprint(o?.key as string)}
        styles={{
          root: { minWidth: 140, marginLeft: 8 },
          dropdown: {
            background: "#232422",
            color: "#fff",
            border: "1px solid #333",
          },
          title: {
            background: "#232422",
            color: "#fff",
            border: "1px solid #333",
          },
          caretDownWrapper: { color: "#fff" },
          dropdownItem: { background: "#232422", color: "#fff" },
          dropdownItemSelected: { background: "#181a17", color: "#4fa3ff" },
        }}
      />
      <Dropdown
        placeholder="Tags"
        options={tagOptions}
        selectedKey={selectedTag}
        onChange={(_, o) => setSelectedTag(o?.key as string)}
        styles={{
          root: { minWidth: 120, marginLeft: 8 },
          dropdown: {
            background: "#232422",
            color: "#fff",
            border: "1px solid #333",
          },
          title: {
            background: "#232422",
            color: "#fff",
            border: "1px solid #333",
          },
          caretDownWrapper: { color: "#fff" },
          dropdownItem: { background: "#232422", color: "#fff" },
          dropdownItemSelected: { background: "#181a17", color: "#4fa3ff" },
        }}
      />
      <Dropdown
        placeholder="Unparented"
        options={unparentedOptions}
        selectedKey={selectedUnparented}
        onChange={(_, o) => setSelectedUnparented(o?.key as string)}
        styles={{
          root: { minWidth: 120, marginLeft: 8 },
          dropdown: {
            background: "#232422",
            color: "#fff",
            border: "1px solid #333",
          },
          title: {
            background: "#232422",
            color: "#fff",
            border: "1px solid #333",
          },
          caretDownWrapper: { color: "#fff" },
          dropdownItem: { background: "#232422", color: "#fff" },
          dropdownItemSelected: { background: "#181a17", color: "#4fa3ff" },
        }}
      />
      <CloseBtn>
        <Icon iconName="Cancel" />
      </CloseBtn>
    </>
  );

  return (
    <FilterBar>
      {essentialFilters}
      <MoreButton onClick={() => setShowAllFilters(!showAllFilters)}>
        <Icon iconName={showAllFilters ? "ChevronUp" : "ChevronDown"} />
        <span style={{ marginLeft: 4 }}>Filters</span>
      </MoreButton>
      {(showAllFilters || window.innerWidth >= 1024) && additionalFilters}
    </FilterBar>
  );
};

export default BoardFilterBar;
