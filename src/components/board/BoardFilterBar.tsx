import styled from "@emotion/styled";
import { Icon } from "@fluentui/react";
import { useState } from "react";

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

const Dropdown = styled.div`
  background: #232422;
  color: #fff;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 14px;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  white-space: nowrap;

  &:hover {
    border-color: #4fa3ff;
  }

  @media (min-width: 768px) {
    min-width: 80px;
    padding: 6px 12px 6px 12px;
    font-size: 15px;
  }

  /* Hide text on mobile, show only icon */
  span {
    display: none;

    @media (min-width: 768px) {
      display: inline;
    }
  }
`;

const DropdownBold = styled(Dropdown)`
  font-weight: 600;
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

const BoardFilterBar = () => {
  const [showAllFilters, setShowAllFilters] = useState(false);

  // Filters to show always (essential)
  const essentialFilters = (
    <>
      <InputWrapper>
        <Icon
          iconName="Filter"
          style={{ color: "#bdbdbd", fontSize: 18, marginRight: 6 }}
        />
        <Input placeholder="Filter by keyword" />
      </InputWrapper>

      <Dropdown>
        <Icon iconName="BulletedList" style={{ fontSize: 16 }} />
        <span> Types </span>
        <Icon iconName="ChevronDown" style={{ marginLeft: 4, fontSize: 14 }} />
      </Dropdown>
    </>
  );

  // Additional filters
  const additionalFilters = (
    <>
      <Dropdown>
        <Icon iconName="Contact" style={{ fontSize: 16, marginRight: 4 }} />
        <span> Assigned to </span>
        <Icon iconName="ChevronDown" style={{ marginLeft: 4, fontSize: 14 }} />
      </Dropdown>

      <Dropdown>
        <Icon iconName="Flag" style={{ fontSize: 16, marginRight: 4 }} />
        <span> States </span>
        <Icon iconName="ChevronDown" style={{ marginLeft: 4, fontSize: 14 }} />
      </Dropdown>

      <DropdownBold>
        <Icon iconName="Product" style={{ fontSize: 16, marginRight: 4 }} />
        <span> Onurcan Apps </span>
        <Icon iconName="ChevronDown" style={{ marginLeft: 4, fontSize: 14 }} />
      </DropdownBold>

      <Dropdown>
        <Icon iconName="Sprint" style={{ fontSize: 16, marginRight: 4 }} />
        <span> Iteration </span>
        <Icon iconName="ChevronDown" style={{ marginLeft: 4, fontSize: 14 }} />
      </Dropdown>

      <Dropdown>
        <Icon iconName="Tag" style={{ fontSize: 16, marginRight: 4 }} />
        <span> Tags </span>
        <Icon iconName="ChevronDown" style={{ marginLeft: 4, fontSize: 14 }} />
      </Dropdown>

      <DropdownBold>
        <Icon iconName="WorkItem" style={{ fontSize: 16, marginRight: 4 }} />
        <span> Unparented </span>
        <Icon iconName="ChevronDown" style={{ marginLeft: 4, fontSize: 14 }} />
      </DropdownBold>

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

      {/* Show additional filters either on larger screens or when expanded on mobile */}
      {(showAllFilters || window.innerWidth >= 1024) && additionalFilters}
    </FilterBar>
  );
};

export default BoardFilterBar;
