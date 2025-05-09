import { Stack, Text } from "@fluentui/react";
import styled from "@emotion/styled";

const TopBar = styled.div`
  background: #232422;
  padding: 12px 16px 8px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (min-width: 768px) {
    padding: 16px 24px 8px 24px;
    gap: 12px;
  }

  @media (min-width: 1024px) {
    padding: 16px 32px 8px 32px;
  }
`;

const BoardHeader = () => (
  <TopBar>
    <Text
      variant="xLarge"
      styles={{
        root: {
          color: "#fff",
          fontWeight: 600,
          fontSize: "clamp(1.2rem, 5vw, 1.5rem)",
        },
      }}
    >
      OO Team
    </Text>
    <Stack horizontal tokens={{ childrenGap: 24 }}>
      <Text
        variant="large"
        styles={{
          root: {
            color: "#fff",
            fontWeight: 500,
            fontSize: "clamp(1rem, 4vw, 1.25rem)",
          },
        }}
      >
        Board
      </Text>
    </Stack>
  </TopBar>
);

export default BoardHeader;
