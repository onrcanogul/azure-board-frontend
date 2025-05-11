import styled from "@emotion/styled";
import BoardHeader from "./board/BoardHeader";
import BoardFilterBar from "./board/BoardFilterBar";
import BoardColumn from "./board/BoardColumn";
import WorkItemModal from "./board/WorkItemModal";
import type { WorkItem } from "./board/BoardColumn";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

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

// Demo data
const demoWorkItems = [
  {
    id: "1",
    title: "Implement login page",
    state: "To Do",
    type: "Task",
    sprintId: "",
    areaId: "",
    featureId: "",
    assignedUserId: "",
    description: "",
    functionalDescription: "",
    technicalDescription: "",
    priority: 0,
    storyPoint: 0,
    businessValue: 0,
    dueDate: "",
    startedDate: "",
    completedDate: "",
    isDeleted: false,
    tagIds: [],
  },
  {
    id: "2",
    title: "Design database schema",
    state: "In Progress",
    type: "Task",
    sprintId: "",
    areaId: "",
    featureId: "",
    assignedUserId: "",
    description: "",
    functionalDescription: "",
    technicalDescription: "",
    priority: 0,
    storyPoint: 0,
    businessValue: 0,
    dueDate: "",
    startedDate: "",
    completedDate: "",
    isDeleted: false,
    tagIds: [],
  },
  {
    id: "3",
    title: "Write API documentation",
    state: "Done",
    type: "Task",
    sprintId: "",
    areaId: "",
    featureId: "",
    assignedUserId: "",
    description: "",
    functionalDescription: "",
    technicalDescription: "",
    priority: 0,
    storyPoint: 0,
    businessValue: 0,
    dueDate: "",
    startedDate: "",
    completedDate: "",
    isDeleted: false,
    tagIds: [],
  },
];

const columns = [
  { key: "To Do", label: "To Do" },
  { key: "In Progress", label: "In Progress" },
  { key: "Done", label: "Done" },
];

const emptyWorkItem = (state: string): WorkItem => ({
  id: Date.now().toString(),
  title: "",
  state,
  type: "Task",
  sprintId: "",
  areaId: "",
  featureId: "",
  assignedUserId: "",
  description: "",
  functionalDescription: "",
  technicalDescription: "",
  priority: 0,
  storyPoint: 0,
  businessValue: 0,
  dueDate: "",
  startedDate: "",
  completedDate: "",
  isDeleted: false,
  tagIds: [],
});

const Board = () => {
  const [workItems, setWorkItems] = useState<WorkItem[]>(demoWorkItems);
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);

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

  const handleMoveCard = (id: string, targetState: string) => {
    console.log(`Moving card ${id} to ${targetState}`);
    setWorkItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, state: targetState } : item
      )
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <BoardWrapper>
        <BoardHeader />
        <BoardFilterBar />
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
        {selectedItem && (
          <WorkItemModal
            item={selectedItem}
            open={modalOpen}
            onClose={handleModalClose}
            isNew={isNew}
          />
        )}
      </BoardWrapper>
    </DndProvider>
  );
};

export default Board;
