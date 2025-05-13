import { Stack, Text, PrimaryButton } from "@fluentui/react";
import styled from "@emotion/styled";
import { Icon } from "@fluentui/react";
import { useState } from "react";
import CreateSprintModal from "./CreateSprintModal";

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #1e1f1c;
  border-radius: 8px;
`;

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const AddButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2a2d29;
  }
`;

interface SprintHeaderProps {
  onSprintCreated?: () => void;
}

const SprintHeader: React.FC<SprintHeaderProps> = ({ onSprintCreated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateSprint = () => {
    // Notify parent that a sprint was created
    if (onSprintCreated) {
      onSprintCreated();
    }
    console.log("Sprint created successfully");
  };

  return (
    <HeaderContainer>
      <HeaderTitle>
        <Icon iconName="Sprint" style={{ fontSize: 24, color: "#4fa3ff" }} />
        <Text variant="xLarge" style={{ color: "#ffffff" }}>
          Sprints
        </Text>
      </HeaderTitle>
      <HeaderActions>
        <PrimaryButton
          onClick={() => setIsModalOpen(true)}
          iconProps={{ iconName: "Add" }}
          text="Create Sprint"
        />
      </HeaderActions>

      <CreateSprintModal
        isOpen={isModalOpen}
        onDismiss={() => setIsModalOpen(false)}
        onCreated={handleCreateSprint}
      />
    </HeaderContainer>
  );
};

export default SprintHeader;
