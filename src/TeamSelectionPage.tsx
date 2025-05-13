import React, { useState } from "react";
import { Header, Text, PrimaryButton } from "@fluentui/react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: #1e1f1c;
  color: #ffffff;
  padding: 40px;
  box-sizing: border-box;
  overflow-x: hidden;
`;

const TeamsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 20px;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
`;

const TeamSelectionPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div>
      <Header>
        <Text variant="xxLarge" styles={{ root: { color: "#ffffff" } }}>
          Takımlar
        </Text>
        <PrimaryButton
          text="Yeni Takım"
          iconProps={{ iconName: "Add" }}
          onClick={() => setIsCreateModalOpen(true)}
          styles={{
            root: {
              backgroundColor: "#4fa3ff",
              border: "none",
              padding: "8px 12px",
            },
            rootHovered: {
              backgroundColor: "#2b88d8",
            },
          }}
        />
      </Header>

      {/* EmptyState içindeki PrimaryButton'u da düzenle */}
      <PrimaryButton
        text="Yeni Takım Oluştur"
        iconProps={{ iconName: "Add" }}
        onClick={() => setIsCreateModalOpen(true)}
        styles={{
          root: {
            backgroundColor: "#4fa3ff",
            border: "none",
            padding: "8px 12px",
          },
          rootHovered: {
            backgroundColor: "#2b88d8",
          },
        }}
      />
    </div>
  );
};

export default TeamSelectionPage;
