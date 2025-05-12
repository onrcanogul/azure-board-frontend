import { useState, useEffect } from "react";
import { DefaultButton, Text, Dropdown } from "@fluentui/react";
import type { IDropdownOption } from "@fluentui/react";
import styled from "@emotion/styled";
import WorkItemModal from "../components/board/modals/WorkItemModal";
import type { WorkItem } from "../components/board/BoardColumn";
import workItemService from "../services/workItemService";
import { v4 as uuidv4 } from "uuid";

const Container = styled.div`
  padding: 40px;
  color: #fff;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

const ItemBox = styled.div<{ priority: number }>`
  background: #232422;
  border-radius: 6px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
  border-left: 4px solid
    ${(props) => {
      if (props.priority >= 3) return "#ff5252";
      if (props.priority === 2) return "#ffb900";
      if (props.priority === 1) return "#0078d4";
      return "#8a8a8a";
    }};

  &:hover {
    background: #2c2e2b;
  }
`;

const ButtonContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 16px;
  align-items: center;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
`;

const StateDropdown = styled(Dropdown)`
  width: 200px;
  margin-right: 8px;

  .ms-Dropdown-title {
    background: #232422;
    color: #fff;
    border-color: #444;
  }

  .ms-Dropdown-caretDownWrapper {
    color: #bdbdbd;
  }
`;

const WorkItemPage = () => {
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string>("");

  const stateOptions: IDropdownOption[] = [
    { key: "", text: "All States" },
    { key: "To Do", text: "To Do" },
    { key: "In Progress", text: "In Progress" },
    { key: "Done", text: "Done" },
  ];

  const loadWorkItems = async () => {
    try {
      setIsLoading(true);
      const items = selectedState
        ? await workItemService.getByState(selectedState)
        : await workItemService.getAll();
      setWorkItems(items);
    } catch (error) {
      console.error("Error loading work items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWorkItems();

    // Subscribe to changes in the work item service
    const unsubscribe = workItemService.subscribe(() => {
      loadWorkItems();
    });

    return () => {
      unsubscribe();
    };
  }, [selectedState]);

  const handleStateChange = (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ) => {
    if (option) {
      setSelectedState(option.key as string);
    }
  };

  const handleCreateClick = () => {
    // Create a new empty work item
    const newWorkItem: WorkItem = {
      id: uuidv4(), // Temporary ID
      sprintId: "",
      areaId: "",
      featureId: "",
      assignedUserId: "",
      description: "New Work Item",
      functionalDescription: "",
      technicalDescription: "",
      priority: 0,
      state: selectedState || "To Do", // Use the selected state or default to "To Do"
      storyPoint: 0,
      businessValue: 0,
      dueDate: "",
      startedDate: "",
      completedDate: "",
      isDeleted: false,
      tagIds: [],
    };

    setSelectedItem(newWorkItem);
    setIsCreating(true);
    setIsModalOpen(true);
  };

  const handleItemClick = (item: WorkItem) => {
    setSelectedItem(item);
    setIsCreating(false);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleSaveWorkItem = async (updatedItem: WorkItem) => {
    try {
      if (isCreating) {
        // Create a new work item
        await workItemService.create(updatedItem);
      } else {
        // Update existing work item
        await workItemService.update(updatedItem);
      }
      // loadWorkItems will be called by the subscription
    } catch (error) {
      console.error("Error saving work item:", error);
      throw error; // Re-throw to be handled by the modal
    }
  };

  return (
    <Container>
      <Title>Work Items</Title>

      <FilterContainer>
        <StateDropdown
          placeholder="Filter by state"
          label="State:"
          options={stateOptions}
          selectedKey={selectedState}
          onChange={handleStateChange}
        />
      </FilterContainer>

      <ButtonContainer>
        <DefaultButton
          onClick={handleCreateClick}
          iconProps={{ iconName: "Add" }}
        >
          Create New Work Item
        </DefaultButton>

        {selectedState && (
          <Text>
            Showing work items in state: <strong>{selectedState}</strong>
          </Text>
        )}
      </ButtonContainer>

      {isLoading ? (
        <Text>Loading work items...</Text>
      ) : workItems.length === 0 ? (
        <Text>No work items found. Create one to get started.</Text>
      ) : (
        <ItemList>
          {workItems.map((item) => (
            <ItemBox
              key={item.id}
              onClick={() => handleItemClick(item)}
              priority={item.priority}
            >
              <Text style={{ fontWeight: 600 }}>{item.description}</Text>
              <Text style={{ color: "#bdbdbd", fontSize: 13, marginTop: 4 }}>
                Priority: {item.priority || "None"} · State: {item.state}
                {item.storyPoint > 0 && ` · Story Points: ${item.storyPoint}`}
              </Text>
            </ItemBox>
          ))}
        </ItemList>
      )}

      {selectedItem && isModalOpen && (
        <WorkItemModal
          item={selectedItem}
          open={isModalOpen}
          onClose={handleModalClose}
          isNew={isCreating}
          onSave={handleSaveWorkItem}
        />
      )}
    </Container>
  );
};

export default WorkItemPage;
