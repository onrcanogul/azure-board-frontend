import { Stack, Text, ProgressIndicator, IconButton } from "@fluentui/react";
import styled from "@emotion/styled";
import { Icon } from "@fluentui/react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  DefaultButton,
  Modal,
  TextField,
  PrimaryButton,
  Dialog,
  DialogType,
  DialogFooter,
} from "@fluentui/react";
import { SprintService } from "../../services/sprintService";
import {
  showSuccessToast,
  showErrorToast,
} from "../../components/toast/ToastManager";
import { SprintState } from "../../domain/models/sprint";
import type { Sprint as SprintType } from "../../domain/models/sprint";

interface WorkItem {
  id: number;
  title: string;
  type: "Task" | "Bug" | "Feature" | "Epic";
  status: "To Do" | "In Progress" | "Done";
  points: number;
}

interface Sprint extends SprintType {
  workItems?: WorkItem[];
}

interface SprintCardProps {
  sprint: Sprint;
}

const CardContainer = styled.div`
  background: #1e1f1c;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
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
  color: #ffffff;
  font-size: 18px;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const StatusBadge = styled.div<{ state: SprintState }>`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  background: ${(props) => {
    switch (props.state) {
      case SprintState.ACTIVE:
        return "rgba(79, 163, 255, 0.1)";
      case SprintState.INACTIVE:
        return "rgba(255, 185, 0, 0.1)";
      default:
        return "rgba(255, 185, 0, 0.1)";
    }
  }};
  color: ${(props) => {
    switch (props.state) {
      case SprintState.ACTIVE:
        return "#4fa3ff";
      case SprintState.INACTIVE:
        return "#ffb900";
      default:
        return "#ffb900";
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
  color: #cccccc;
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
  color: #cccccc;
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
  const sprintService = new SprintService();

  const formatState = (state: SprintState) => {
    if (state === SprintState.ACTIVE) return "Active";
    if (state === SprintState.INACTIVE) return "Inactive";
    return "Unknown";
  };

  const handleDeleteSprint = async () => {
    setIsDeleting(true);
    try {
      await sprintService.delete(sprint.id);
      showSuccessToast(`"${sprint.name}" sprint başarıyla silindi`);
      // Force reload the page to refresh the sprint list
      window.location.reload();
    } catch (err) {
      console.error("Error deleting sprint:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu";
      showErrorToast(`Sprint silinirken hata: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
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
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <StatusBadge state={sprint.state}>
            {formatState(sprint.state)}
          </StatusBadge>
          <DefaultButton
            iconProps={{ iconName: "DocumentManagement" }}
            text="Show Plan"
            onClick={() => setShowPlanModal(true)}
            styles={{
              root: {
                backgroundColor: "#2a2d29",
                border: "none",
              },
              rootHovered: {
                backgroundColor: "#3a3d39",
              },
              icon: {
                color: "#4fa3ff",
              },
              label: {
                color: "#ffffff",
                fontWeight: "normal",
              },
            }}
          />
          <IconButton
            iconProps={{ iconName: "Delete" }}
            title="Delete Sprint"
            ariaLabel="Delete Sprint"
            onClick={() => setShowDeleteDialog(true)}
            style={{ color: "#ff5252" }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <DateInfo>
          <div>Start: {sprint.startDate.toLocaleDateString()}</div>
          <div>End: {sprint.endDate.toLocaleDateString()}</div>
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
        <Modal
          isOpen={showPlanModal}
          onDismiss={() => setShowPlanModal(false)}
          className="sprintPlanModal"
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
          <style>{`
            .sprintPlanModal .ms-TextField input,
            .sprintPlanModal .ms-TextField textarea {
              color: #ffffff !important;
              background-color: #1A1A1A !important;
              caret-color: #ffffff !important;
              border-color: #4fa3ff !important;
              padding: 8px 12px !important;
            }
            
            .sprintPlanModal .ms-TextField input::placeholder,
            .sprintPlanModal .ms-TextField textarea::placeholder {
              color: #aaaaaa !important;
            }
            
            .sprintPlanModal .ms-TextField-fieldGroup {
              background: #1A1A1A !important;
              border: 1px solid #4fa3ff !important;
            }
            
            .sprintPlanModal .ms-TextField-fieldGroup:hover {
              border-color: #4fa3ff !important;
              box-shadow: 0 0 5px rgba(79, 163, 255, 0.5) !important;
            }
            
            .sprintPlanModal h2 {
              text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5) !important;
            }
            
            .sprintPlanModal .ms-Label {
              color: #ffffff !important;
              font-weight: 500 !important;
              margin-bottom: 6px !important;
            }
          `}</style>
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
                color: "#ffffff",
                fontSize: 20,
                fontWeight: 600,
              },
              wrapper: { marginBottom: 24 },
              fieldGroup: {
                background: "#0D0D0D",
                border: "1px solid #4fa3ff",
                selectors: {
                  ":hover": {
                    borderColor: "#4fa3ff",
                    boxShadow: "0 0 5px rgba(79, 163, 255, 0.5)",
                  },
                  "::after": { border: "none" },
                },
              },
              subComponentStyles: {
                label: {
                  root: { color: "#ffffff", fontSize: 16, fontWeight: 500 },
                },
              },
            }}
          />
          <TextField
            label="Plan Description"
            multiline
            rows={5}
            value={planDesc}
            onChange={(_, v) => setPlanDesc(v || "")}
            styles={{
              field: {
                color: "#ffffff",
                fontSize: 16,
              },
              wrapper: { marginBottom: 32 },
              fieldGroup: {
                background: "#0D0D0D",
                border: "1px solid #4fa3ff",
                selectors: {
                  ":hover": {
                    borderColor: "#4fa3ff",
                    boxShadow: "0 0 5px rgba(79, 163, 255, 0.5)",
                  },
                  "::after": { border: "none" },
                },
              },
              subComponentStyles: {
                label: {
                  root: { color: "#ffffff", fontSize: 16, fontWeight: 500 },
                },
              },
            }}
          />

          {/* Sprint Information Section */}
          <div
            style={{
              marginBottom: 32,
              background: "#1e1f1c",
              padding: 16,
              borderRadius: 8,
            }}
          >
            <h3 style={{ color: "#4fa3ff", marginBottom: 16 }}>
              Sprint Information
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <div>
                <Text
                  style={{
                    color: "#bdbdbd",
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  Start Date:
                </Text>
                <Text style={{ color: "#ffffff", fontWeight: 600 }}>
                  {sprint.startDate.toLocaleDateString()}
                </Text>
              </div>
              <div>
                <Text
                  style={{
                    color: "#bdbdbd",
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  End Date:
                </Text>
                <Text style={{ color: "#ffffff", fontWeight: 600 }}>
                  {sprint.endDate.toLocaleDateString()}
                </Text>
              </div>
              <div>
                <Text
                  style={{
                    color: "#bdbdbd",
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  Status:
                </Text>
                <Text
                  style={{
                    color:
                      sprint.state === SprintState.ACTIVE
                        ? "#4fa3ff"
                        : "#ffb900",
                    fontWeight: 600,
                  }}
                >
                  {formatState(sprint.state)}
                </Text>
              </div>
              <div>
                <Text
                  style={{
                    color: "#bdbdbd",
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  Total Work Items:
                </Text>
                <Text style={{ color: "#ffffff", fontWeight: 600 }}>
                  {workItems.length}
                </Text>
              </div>
            </div>
          </div>

          {/* Work Items Section */}
          {workItems.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ color: "#4fa3ff", marginBottom: 16 }}>Work Items</h3>
              <div
                style={{
                  background: "#1e1f1c",
                  borderRadius: 8,
                  maxHeight: 250,
                  overflowY: "auto",
                  marginBottom: 16,
                  padding: "0 12px",
                }}
              >
                {workItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: "12px 0",
                      borderBottom: "1px solid #2d2e2b",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
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
                    <span style={{ flex: 1, color: "#ffffff" }}>
                      {item.title}
                    </span>
                    <WorkItemStatus status={item.status}>
                      {item.status}
                    </WorkItemStatus>
                    <span style={{ color: "#bdbdbd" }}>{item.points} pts</span>
                  </div>
                ))}
              </div>
              <Stack>
                <Text style={{ color: "#bdbdbd", marginBottom: 8 }}>
                  Progress: {completedItems}/{totalItems} items (
                  {completedPoints}/{totalPoints} points)
                </Text>
                <ProgressIndicator
                  percentComplete={progress / 100}
                  styles={{
                    root: { width: "100%" },
                    progressBar: { background: "#4fa3ff" },
                  }}
                />
              </Stack>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <DefaultButton
              onClick={() => setShowPlanModal(false)}
              style={{ fontSize: 16, padding: "8px 24px" }}
            >
              Close
            </DefaultButton>
            <PrimaryButton
              style={{ fontSize: 16, padding: "8px 32px" }}
              onClick={() => {
                // We could add an API call here to save the plan details
                showSuccessToast(`"${planTitle}" plan saved successfully`);
                setShowPlanModal(false);
              }}
            >
              Save
            </PrimaryButton>
          </div>
        </Modal>
        <Dialog
          hidden={!showDeleteDialog}
          onDismiss={() => setShowDeleteDialog(false)}
          dialogContentProps={{
            type: DialogType.normal,
            title: "Sprint Silme",
            subText: `"${sprint.name}" sprinti silmek istediğinize emin misiniz?`,
          }}
          modalProps={{
            isBlocking: true,
            styles: { main: { maxWidth: 450 } },
          }}
        >
          <DialogFooter>
            <PrimaryButton
              onClick={handleDeleteSprint}
              text="Sil"
              disabled={isDeleting}
            />
            <DefaultButton
              onClick={() => setShowDeleteDialog(false)}
              text="İptal"
            />
          </DialogFooter>
        </Dialog>
      </CardContent>
    </CardContainer>
  );
};

export default SprintCard;
