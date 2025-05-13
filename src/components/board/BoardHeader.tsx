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

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const ActionButton = styled.button`
  background-color: #4fa3ff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: background-color 0.2s;
  width: 100%;

  &:hover {
    background-color: #3a8ad9;
  }

  @media (min-width: 768px) {
    width: auto;
  }
`;

const ViewToggleButton = styled.button<{ isActive: boolean }>`
  background-color: ${(props) => (props.isActive ? "#4fa3ff" : "#2c2d2a")};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
  margin-bottom: 8px;

  &:hover {
    background-color: ${(props) => (props.isActive ? "#3a8ad9" : "#383a36")};
  }

  @media (min-width: 768px) {
    width: auto;
    margin-right: 12px;
    margin-bottom: 0;
  }
`;

const ActionGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    width: auto;
  }
`;

interface BoardHeaderProps {
  onCreateWorkItem?: () => void;
  viewType?: "all" | "my";
  onToggleViewType?: () => void;
}

const BoardHeader = ({
  onCreateWorkItem,
  viewType = "my",
  onToggleViewType,
}: BoardHeaderProps) => {
  return (
    <TopBar>
      <HeaderContent>
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

        <ActionGroup>
          {onToggleViewType && (
            <ViewToggleButton
              isActive={viewType === "my"}
              onClick={onToggleViewType}
            >
              {viewType === "my" ? "Bana Atanmış" : "Tüm PBI'lar"}
            </ViewToggleButton>
          )}

          {onCreateWorkItem && (
            <ActionButton onClick={onCreateWorkItem}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 3.33337V12.6667"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M3.33325 8H12.6666"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Yeni PBI Oluştur
            </ActionButton>
          )}
        </ActionGroup>
      </HeaderContent>

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
          {viewType === "my" ? "Bana Atanmış PBI'lar" : "Tüm PBI'lar"}
        </Text>
      </Stack>
    </TopBar>
  );
};

export default BoardHeader;
