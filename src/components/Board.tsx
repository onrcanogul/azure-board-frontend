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
`;

const BoardContainer = styled.div`
  display: grid;
  gap: 16px;
  padding: 16px;
  background: #181a17;
  width: 100%;
  box-sizing: border-box;
  overflow-x: auto;

  /* Mobile: Stack columns vertically */
  grid-template-columns: 1fr;

  /* Tablet: 2 columns */
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    padding: 24px;
    gap: 20px;
  }

  /* Desktop: 3 columns */
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
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
  id: Date.now(),
  title: "",
  state,
  type: "Task",
});

const Board = () => {
  const [workItems, setWorkItems] = useState<WorkItem[]>([
    { id: 1, title: "Implement login page", state: "To Do", type: "Task" },
    {
      id: 2,
      title: "Design database schema",
      state: "In Progress",
      type: "Task",
    },
    { id: 3, title: "Write API documentation", state: "Done", type: "Task" },
  ]);
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

  const handleMoveCard = (id: number, targetState: string) => {
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
        <WorkItemModal
          item={selectedItem!}
          open={modalOpen && !!selectedItem}
          onClose={handleModalClose}
          isNew={isNew}
        />
      </BoardWrapper>
    </DndProvider>
  );
};

export default Board;
