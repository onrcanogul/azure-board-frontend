import { Text } from "@fluentui/react";
import styled from "@emotion/styled";
import type { WorkItem } from "./BoardColumn";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./DragDropTypes";
import type { DragItem } from "./DragDropTypes";
import React from "react";

interface CardProps {
  isDragging: boolean;
}

const CardDiv = styled.div<CardProps>`
  margin: 12px 0;
  padding: 16px;
  background: #232422;
  border-radius: 8px;
  color: #eaeaea;
  border-left: 4px solid #ffb900;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: all 0.2s ease;
  opacity: ${(props) => (props.isDragging ? 0.4 : 1)};
  transform: scale(${(props) => (props.isDragging ? 0.95 : 1)});

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    border-left: 4px solid #0078d4;
    background: #232422ee;
    transform: translateY(-2px);
  }

  @media (min-width: 768px) {
    padding: 16px 20px;
  }
`;

const CardTitle = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  margin-bottom: 8px;
  word-break: break-word;
  width: 100%;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #bdbdbd;
  flex-wrap: wrap;
  margin-top: 4px;

  @media (min-width: 768px) {
    gap: 10px;
    font-size: 13px;
  }
`;

const CardType = styled.span`
  background: rgba(255, 185, 0, 0.1);
  color: #ffb900;
  border-radius: 4px;
  font-size: 11px;
  padding: 3px 8px;
  white-space: nowrap;
  font-weight: 500;
  border: 1px solid rgba(255, 185, 0, 0.2);

  @media (min-width: 768px) {
    font-size: 12px;
  }
`;

const CardId = styled.span`
  color: #8a8a8a;
  font-weight: 500;
`;

const CardState = styled.span`
  color: #8a8a8a;
  font-weight: 500;
`;

const PriorityBadge = styled.span<{ priority: number }>`
  color: ${(props) => {
    if (props.priority >= 3) return "#ff5252";
    if (props.priority === 2) return "#ffb900";
    if (props.priority === 1) return "#0078d4";
    return "#8a8a8a";
  }};
  font-weight: 600;
  display: flex;
  align-items: center;
`;

interface BoardCardProps {
  item: WorkItem;
  onClick?: () => void;
}

const BoardCard: React.FC<BoardCardProps> = ({ item, onClick }) => {
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: ItemTypes.CARD,
      item: (): DragItem => ({
        id: item.id,
        type: ItemTypes.CARD,
        originalState: item.state,
      }),
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      end: (draggedItem, monitor) => {
        // If item was dropped outside of a valid drop target
        if (!monitor.didDrop() && draggedItem) {
          console.log("Item was not dropped in a valid drop target");
        }
      },
    }),
    [item.id, item.state]
  );

  // Truncate ID to first 6 characters for better display
  const shortenedId = item.id.substring(0, 6);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <div ref={dragRef as any} id={`card-${item.id}`}>
      <CardDiv onClick={onClick} isDragging={isDragging}>
        <CardTitle>{item.description}</CardTitle>
        <CardMeta>
          <CardId>#{shortenedId}</CardId>
          <PriorityBadge priority={item.priority}>
            P{item.priority || 0}
          </PriorityBadge>
          {item.storyPoint > 0 && <span>SP: {item.storyPoint}</span>}
        </CardMeta>
      </CardDiv>
    </div>
  );
};

export default BoardCard;
