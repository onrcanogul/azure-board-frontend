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
  padding: 12px;
  background: #232422;
  border-radius: 6px;
  color: #eaeaea;
  border-left: 4px solid #ffb900;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: box-shadow 0.2s, border 0.2s, transform 0.15s;
  opacity: ${(props) => (props.isDragging ? 0.4 : 1)};
  transform: scale(${(props) => (props.isDragging ? 0.95 : 1)});

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
    border-left: 4px solid #0078d4;
    background: #232422ee;
  }

  @media (min-width: 768px) {
    padding: 12px 16px 8px 16px;
  }
`;

const CardTitle = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  margin-bottom: 6px;
  word-break: break-word;
  width: 100%;

  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #bdbdbd;
  flex-wrap: wrap;

  @media (min-width: 768px) {
    gap: 8px;
    font-size: 13px;
  }
`;

const CardType = styled.span`
  background: #333;
  color: #ffb900;
  border-radius: 3px;
  font-size: 11px;
  padding: 2px 6px;
  white-space: nowrap;

  @media (min-width: 768px) {
    font-size: 12px;
  }
`;

interface BoardCardProps {
  item: WorkItem;
  onClick?: () => void;
}

const BoardCard: React.FC<BoardCardProps> = ({ item, onClick }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [{ isDragging }, dragRef] = useDrag<
    DragItem,
    unknown,
    { isDragging: boolean }
  >(() => ({
    type: ItemTypes.CARD,
    item: {
      id: item.id,
      type: ItemTypes.CARD,
      originalState: item.state,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <div ref={dragRef as any}>
      <CardDiv onClick={onClick} isDragging={isDragging}>
        <CardTitle>{item.title}</CardTitle>
        <CardMeta>
          <span>#{item.id}</span>
          <span>• {item.state}</span>
          <CardType>{item.type}</CardType>
        </CardMeta>
      </CardDiv>
    </div>
  );
};

export default BoardCard;
