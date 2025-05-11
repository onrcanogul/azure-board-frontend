import { Stack, Text } from "@fluentui/react";
import styled from "@emotion/styled";
import { Icon } from "@fluentui/react";

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #232422;
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
`;

const SprintHeader = () => {
  return (
    <HeaderContainer>
      <HeaderTitle>
        <Icon iconName="Sprint" style={{ fontSize: 24, color: "#4fa3ff" }} />
        <Text variant="xLarge" style={{ color: "#fff" }}>
          Sprints
        </Text>
      </HeaderTitle>
      <HeaderActions>
        <Icon
          iconName="Add"
          style={{ fontSize: 20, color: "#4fa3ff", cursor: "pointer" }}
        />
      </HeaderActions>
    </HeaderContainer>
  );
};

export default SprintHeader;
