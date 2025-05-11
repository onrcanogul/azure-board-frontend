import { Stack, Text, ProgressIndicator } from "@fluentui/react";
import styled from "@emotion/styled";
import { Icon } from "@fluentui/react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  DefaultButton,
  Modal,
  TextField,
  PrimaryButton,
} from "@fluentui/react";

interface WorkItem {
  id: number;
  title: string;
  type: "Task" | "Bug" | "Feature" | "Epic";
  status: "To Do" | "In Progress" | "Done";
  points: number;
}

interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  goal: string;
  state: "PLANNED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  projectId: string;
  teamId: string;
  isDeleted: boolean;
  workItems?: WorkItem[];
}

interface SprintCardProps {
  sprint: Sprint;
}

const CardContainer = styled.div`
  background: #232422;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 768px) {
    margin-bottom: 12px;
  }
`;

const SprintName = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-size: 18px;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const StatusBadge = styled.div<{ state: Sprint["state"] }>`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  background: ${(props) => {
    switch (props.state) {
      case "ACTIVE":
        return "rgba(79, 163, 255, 0.1)";
      case "COMPLETED":
        return "rgba(0, 200, 83, 0.1)";
      case "PLANNED":
        return "rgba(255, 185, 0, 0.1)";
      case "CANCELLED":
        return "rgba(255, 82, 82, 0.1)";
    }
  }};
  color: ${(props) => {
    switch (props.state) {
      case "ACTIVE":
        return "#4fa3ff";
      case "COMPLETED":
        return "#00c853";
      case "PLANNED":
        return "#ffb900";
      case "CANCELLED":
        return "#ff5252";
    }
  }};

  @media (max-width: 768px) {
    padding: 3px 10px;
    font-size: 11px;
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const DateInfo = styled.div`
  display: flex;
  gap: 24px;
  color: #bdbdbd;
  font-size: 14px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 16px;
    font-size: 13px;
  }
`;

const WorkItemsList = styled.div`
  margin-top: 16px;
  border-top: 1px solid #2d2e2b;
  padding-top: 16px;

  @media (max-width: 768px) {
    margin-top: 12px;
    padding-top: 12px;
  }
`;

const WorkItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  color: #bdbdbd;
  font-size: 14px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 8px;
    font-size: 13px;
  }
`;

const WorkItemStatus = styled.span<{ status: WorkItem["status"] }>`
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  background: ${(props) => {
    switch (props.status) {
      case "To Do":
        return "rgba(255, 185, 0, 0.1)";
      case "In Progress":
        return "rgba(79, 163, 255, 0.1)";
      case "Done":
        return "rgba(0, 200, 83, 0.1)";
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "To Do":
        return "#ffb900";
      case "In Progress":
        return "#4fa3ff";
      case "Done":
        return "#00c853";
    }
  }};

  @media (max-width: 768px) {
    padding: 2px 6px;
    font-size: 11px;
  }
`;

const SprintCard: React.FC<SprintCardProps> = ({ sprint }) => {
  const navigate = useNavigate();
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planTitle, setPlanTitle] = useState(sprint.name + " Plan");
  const [planDesc, setPlanDesc] = useState(sprint.goal || "");
  const workItems = sprint.workItems || [];
  const completedItems = workItems.filter(
    (item) => item.status === "Done"
  ).length;
  const totalItems = workItems.length;
  const completedPoints = workItems
    .filter((item) => item.status === "Done")
    .reduce((sum, item) => sum + item.points, 0);
  const totalPoints = workItems.reduce((sum, item) => sum + item.points, 0);
  const progress = totalPoints > 0 ? (completedPoints / totalPoints) * 100 : 0;

  const formatState = (state: Sprint["state"]) => {
    if (!state) return "Unknown";
    return state.charAt(0) + state.slice(1).toLowerCase();
  };

  return (
    <CardContainer>
      <CardHeader>
        <SprintName
          style={{ cursor: "pointer" }}
          onClick={() =>
            navigate(`/boards?sprint=${encodeURIComponent(sprint.name)}`)
          }
        >
          <Icon iconName="Sprint" style={{ color: "#4fa3ff" }} />
          {sprint.name}
        </SprintName>
        <StatusBadge state={sprint.state}>
          {formatState(sprint.state)}
        </StatusBadge>
        {sprint.state === "ACTIVE" && (
          <DefaultButton
            style={{ marginLeft: 8 }}
            onClick={() => setShowPlanModal(true)}
          >
            Show Plan
          </DefaultButton>
        )}
      </CardHeader>
      <CardContent>
        <DateInfo>
          <div>Start: {new Date(sprint.startDate).toLocaleDateString()}</div>
          <div>End: {new Date(sprint.endDate).toLocaleDateString()}</div>
        </DateInfo>
        {sprint.goal && (
          <Text style={{ color: "#bdbdbd", marginBottom: 16 }}>
            Goal: {sprint.goal}
          </Text>
        )}
        {workItems.length > 0 && (
          <>
            <Stack>
              <Text style={{ color: "#bdbdbd", marginBottom: 8 }}>
                Progress: {completedItems}/{totalItems} items ({completedPoints}
                /{totalPoints} points)
              </Text>
              <ProgressIndicator
                percentComplete={progress / 100}
                styles={{
                  root: { width: "100%" },
                  progressBar: { background: "#4fa3ff" },
                }}
              />
            </Stack>
            <WorkItemsList>
              {workItems.map((item) => (
                <WorkItemRow key={item.id}>
                  <Icon
                    iconName={
                      item.type === "Task"
                        ? "TaskList"
                        : item.type === "Bug"
                        ? "Bug"
                        : item.type === "Feature"
                        ? "Lightbulb"
                        : "WorkItem"
                    }
                    style={{ color: "#4fa3ff" }}
                  />
                  <span style={{ flex: 1 }}>{item.title}</span>
                  <WorkItemStatus status={item.status}>
                    {item.status}
                  </WorkItemStatus>
                  <span>{item.points} pts</span>
                </WorkItemRow>
              ))}
            </WorkItemsList>
          </>
        )}
        {showPlanModal && (
          <style>{`
            .ms-TextField input,
            .ms-TextField textarea {
              color: #fff !important;
              background: #181a17 !important;
              caret-color: #fff !important;
            }
            .ms-TextField input::placeholder,
            .ms-TextField textarea::placeholder {
              color: #fff !important;
              opacity: 1 !important;
            }
            .ms-TextField input:-webkit-autofill,
            .ms-TextField textarea:-webkit-autofill {
              -webkit-text-fill-color: #fff !important;
              box-shadow: 0 0 0 1000px #181a17 inset !important;
              background: #181a17 !important;
            }
          `}</style>
        )}
        <Modal
          isOpen={showPlanModal}
          onDismiss={() => setShowPlanModal(false)}
          styles={{
            main: {
              background: "#232422",
              color: "#fff",
              borderRadius: 12,
              padding: 40,
              maxWidth: 700,
              minWidth: 500,
            },
          }}
        >
          <h2
            style={{
              color: "#4fa3ff",
              marginBottom: 24,
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: 0.5,
              textShadow: "0 1px 4px #000",
            }}
          >
            Sprint Plan
          </h2>
          <TextField
            label="Plan Title"
            value={planTitle}
            onChange={(_, v) => setPlanTitle(v || "")}
            styles={{
              field: {
                background: "#181a17",
                color: "#fff",
                fontSize: 20,
                fontWeight: 600,
                "input, textarea": {
                  color: "#fff",
                  background: "#181a17",
                },
                "input::placeholder, textarea::placeholder": {
                  color: "#fff",
                  opacity: 1,
                },
                "input:-webkit-autofill, textarea:-webkit-autofill": {
                  WebkitTextFillColor: "#fff",
                  WebkitBoxShadow: "0 0 0 1000px #181a17 inset",
                  boxShadow: "0 0 0 1000px #181a17 inset",
                },
              },
              wrapper: { marginBottom: 24 },
              subComponentStyles: {
                label: {
                  root: { color: "#fff", fontSize: 16, fontWeight: 500 },
                },
              },
            }}
            onRenderLabel={(props, defaultRender) =>
              defaultRender ? (
                <span style={{ color: "#fff", fontSize: 16, fontWeight: 500 }}>
                  {defaultRender(props)}
                </span>
              ) : null
            }
          />
          <TextField
            label="Plan Description"
            multiline
            rows={8}
            value={planDesc}
            onChange={(_, v) => setPlanDesc(v || "")}
            styles={{
              field: {
                background: "#181a17",
                color: "#fff",
                fontSize: 16,
                "input, textarea": {
                  color: "#fff",
                  background: "#181a17",
                },
                "input::placeholder, textarea::placeholder": {
                  color: "#fff",
                  opacity: 1,
                },
                "input:-webkit-autofill, textarea:-webkit-autofill": {
                  WebkitTextFillColor: "#fff",
                  WebkitBoxShadow: "0 0 0 1000px #181a17 inset",
                  boxShadow: "0 0 0 1000px #181a17 inset",
                },
              },
              wrapper: { marginBottom: 32 },
              subComponentStyles: {
                label: {
                  root: { color: "#fff", fontSize: 16, fontWeight: 500 },
                },
              },
            }}
            onRenderLabel={(props, defaultRender) =>
              defaultRender ? (
                <span style={{ color: "#fff", fontSize: 16, fontWeight: 500 }}>
                  {defaultRender(props)}
                </span>
              ) : null
            }
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <DefaultButton
              onClick={() => setShowPlanModal(false)}
              style={{ fontSize: 16, padding: "8px 24px" }}
            >
              Cancel
            </DefaultButton>
            <PrimaryButton
              style={{ fontSize: 16, padding: "8px 32px" }}
              onClick={() => {
                // Burada backend'e güncelleme isteği atılabilir
                setShowPlanModal(false);
              }}
            >
              Save
            </PrimaryButton>
          </div>
        </Modal>
      </CardContent>
    </CardContainer>
  );
};

export default SprintCard;
