import styled from "@emotion/styled";
import BoardHeader from "./board/BoardHeader";
import BoardFilterBar from "./board/BoardFilterBar";
import BoardColumn from "./board/BoardColumn";
import WorkItemModal from "./board/WorkItemModal";
import type { WorkItem } from "./board/BoardColumn";
import { useState, useEffect, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import workItemService from "../services/workItemService";
import { v4 as uuidv4 } from "uuid";

const BoardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: #181a17;
  min-height: 100%;
  width: 100%;
  box-sizing: border-box;
  flex: 1;
`;

const BoardContainer = styled.div`
  display: grid;
  gap: 16px;
  padding: 16px;
  background: #181a17;
  width: 100%;
  box-sizing: border-box;
  overflow-x: auto;
  min-width: 0; /* Prevents flex items from overflowing */
  flex: 1;

  /* Mobile: Stack columns vertically */
  grid-template-columns: minmax(0, 1fr);

  /* Tablet: 2 columns */
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding: 24px;
    gap: 20px;
  }

  /* Desktop: 3 columns */
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    padding: 32px;
    gap: 24px;
  }
`;

const columns = [
  { key: "To Do", label: "To Do" },
  { key: "In Progress", label: "In Progress" },
  { key: "Done", label: "Done" },
];

const emptyWorkItem = (state: string): WorkItem => ({
  id: uuidv4(),
  sprintId: "",
  areaId: "",
  featureId: "",
  assignedUserId: "",
  description: "New Work Item",
  functionalDescription: "",
  technicalDescription: "",
  priority: 0,
  state,
  storyPoint: 0,
  businessValue: 0,
  dueDate: "",
  startedDate: "",
  completedDate: "",
  isDeleted: false,
  tagIds: [],
});

const Board = () => {
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWorkItems = useCallback(async () => {
    try {
      setError(null);
      const items = await workItemService.getAll();
      setWorkItems(items);
    } catch (err) {
      console.error("Error loading work items:", err);
      setError("Failed to load work items. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load work items from service
  useEffect(() => {
    loadWorkItems();

    // Subscribe to changes in the work item service
    const unsubscribe = workItemService.subscribe(() => {
      loadWorkItems();
    });

    return () => {
      unsubscribe();
    };
  }, [loadWorkItems]);

  const handleCardClick = (item: WorkItem) => {
    setSelectedItem(item);
    setModalOpen(true);
    setIsNew(false);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedItem(null);
    setIsNew(false);
  };

  const handleNewItem = (state: string) => {
    setSelectedItem(emptyWorkItem(state));
    setModalOpen(true);
    setIsNew(true);
  };

  const handleMoveCard = useCallback(
    async (id: string, targetState: string) => {
      try {
        // Find the item to move
        const itemToMove = workItems.find((item) => item.id === id);
        if (!itemToMove) {
          console.error(`Item with id ${id} not found`);
          return;
        }

        // Skip if the item is already in the target state
        if (itemToMove.state === targetState) {
          console.log(`Item is already in ${targetState} state`);
          return;
        }

        // Update state locally first for responsiveness
        setWorkItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, state: targetState } : item
          )
        );

        // Update in the service with retry logic
        try {
          const updatedItem = { ...itemToMove, state: targetState };
          await workItemService.update(updatedItem);
          console.log(`Card ${id} moved to ${targetState} successfully`);
        } catch (updateError) {
          console.error(`Error updating item ${id}:`, updateError);
          // The subscription will reload items if update fails
        }
      } catch (error) {
        console.error(`Error moving card ${id} to ${targetState}:`, error);
        setError("Failed to move card. Please try again.");
      }
    },
    [workItems]
  );

  const handleSaveWorkItem = async (updatedItem: WorkItem) => {
    try {
      setError(null);
      if (isNew) {
        // Create a new work item
        await workItemService.create(updatedItem);
      } else {
        // Update existing work item
        await workItemService.update(updatedItem);
      }
      // No need to update state manually, subscription will handle it
    } catch (error) {
      console.error("Error saving work item:", error);
      setError("Failed to save work item. Please try again.");
      throw error; // Re-throw to be handled by the modal
    }
  };

  if (error) {
    return (
      <div style={{ color: "red", padding: "20px", textAlign: "center" }}>
        {error}
        <button
          onClick={loadWorkItems}
          style={{ marginLeft: "10px", padding: "5px 10px" }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <BoardWrapper>
        <BoardHeader />
        <BoardFilterBar />
        {isLoading ? (
          <div style={{ padding: "20px", textAlign: "center" }}>
            Loading work items...
          </div>
        ) : (
          <BoardContainer>
            {columns.map((column) => (
              <BoardColumn
                key={column.key}
                title={column.key}
                items={workItems.filter((item) => item.state === column.key)}
                onCardClick={handleCardClick}
                onAddItem={() => handleNewItem(column.key)}
                onMoveCard={handleMoveCard}
              />
            ))}
          </BoardContainer>
        )}
        {selectedItem && (
          <WorkItemModal
            item={selectedItem}
            open={modalOpen}
            onClose={handleModalClose}
            isNew={isNew}
            onSave={handleSaveWorkItem}
          />
        )}
      </BoardWrapper>
    </DndProvider>
  );
};

export default Board;
