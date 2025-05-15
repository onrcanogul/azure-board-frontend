import { Text, DefaultButton } from "@fluentui/react";
import styled from "@emotion/styled";
import BoardCard from "./BoardCard";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./DragDropTypes";
import type { DragItem } from "./DragDropTypes";
import React, { useState, useCallback } from "react";
import { WorkItemType } from "../../services/workItemService";

export interface WorkItem {
  id: string; // UUID
  sprintId: string; // UUID
  areaId: string; // UUID
  featureId: string; // UUID
  assignedUserId: string; // UUID
  description: string;
  functionalDescription: string;
  technicalDescription: string;
  priority: number;
  state: string;
  status?: string; // For Bug items
  storyPoint: number;
  businessValue: number;
  dueDate: string; // ISO string
  startedDate: string; // ISO string
  completedDate: string; // ISO string
  isDeleted: boolean;
  tagIds: string[];
  type?: WorkItemType; // İş öğesinin tipi
}

interface BoardColumnProps {
  title: string;
  items: WorkItem[];
  onAddItem?: () => void;
  onCardClick?: (item: WorkItem) => void;
  onMoveCard?: (id: string, targetState: string, type?: string) => void;
}

interface ColumnProps {
  isOver: boolean;
  canDrop: boolean;
}

const ColumnContainer = styled.div`
  width: 100%;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-x: hidden;
`;

const ColumnDiv = styled.div<ColumnProps>`
  min-width: 0;
  width: 100%;
  background: ${(props) =>
    props.isOver && props.canDrop ? "#1e1f1c" : "#232422"};
  border-radius: 6px;
  padding: 0 0 16px 0;
  display: flex;
  flex-direction: column;
  flex: 1;
  border: ${(props) =>
    props.isOver && props.canDrop
      ? "1px dashed #4fa3ff"
      : "1px solid transparent"};
  transition: background-color 0.2s, border 0.2s;
  overflow: hidden; /* Ensures content doesn't expand beyond borders */
  box-sizing: border-box;
`;

const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid #333;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 768px) {
    padding: 16px;
  }
`;

const ColumnTitle = styled(Text)`
  color: white;
  font-weight: 600;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemCount = styled.span`
  font-size: 14px;
  color: #bdbdbd;
  margin-left: 8px;
`;

const CardList = styled.div`
  padding: 0 12px;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 768px) {
    padding: 0 16px;
  }
`;

const NewItemButton = styled(DefaultButton)`
  justify-content: flex-start;
  margin: 12px 12px 8px 12px;
  color: #bdbdbd;
  background: transparent;
  border: none;
  width: calc(100% - 24px);
  box-sizing: border-box;

  &:hover {
    background: #232422;
    color: #fff;
  }

  @media (min-width: 768px) {
    margin: 12px 16px 8px 16px;
    width: calc(100% - 32px);
  }
`;

const BoardColumn: React.FC<BoardColumnProps> = ({
  title,
  items,
  onAddItem,
  onCardClick,
  onMoveCard,
}) => {
  const [dropHighlight, setDropHighlight] = useState(false);

  const handleDrop = useCallback(
    (item: DragItem) => {
      if (onMoveCard && item.originalState !== title) {
        console.log(`Dropping card ${item.id} to ${title}`);
        onMoveCard(item.id, title, item.type);
        return { name: title };
      }
      return undefined;
    },
    [onMoveCard, title]
  );

  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: ItemTypes.CARD,
    drop: handleDrop,
    canDrop: (item: DragItem) => item.originalState !== title,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
    hover: (item, monitor) => {
      // Highlight the drop target when a draggable item hovers over it
      if (monitor.isOver({ shallow: true })) {
        if (!dropHighlight) setDropHighlight(true);
      } else {
        if (dropHighlight) setDropHighlight(false);
      }
    },
  });

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <ColumnContainer ref={dropRef as any}>
      <ColumnDiv isOver={isOver} canDrop={canDrop}>
        <ColumnHeader>
          <ColumnTitle variant="large">
            {title}
            <ItemCount>({items.length})</ItemCount>
          </ColumnTitle>
        </ColumnHeader>
        <NewItemButton iconProps={{ iconName: "Add" }} onClick={onAddItem}>
          New item
        </NewItemButton>
        <CardList>
          {items.map((item) => (
            <BoardCard
              key={item.id}
              item={item}
              onClick={() => onCardClick?.(item)}
            />
          ))}
        </CardList>
      </ColumnDiv>
    </ColumnContainer>
  );
};

export default BoardColumn;
