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
        <CardTitle>{item.description}</CardTitle>
        <CardMeta>
          <CardId>#{item.id}</CardId>
          <CardState>{item.state}</CardState>
          <span>SP: {item.storyPoint}</span>
          <span>BV: {item.businessValue}</span>
        </CardMeta>
      </CardDiv>
    </div>
  );
};

export default BoardCard;
