import { useState, useEffect } from "react";
import { Right, Section, SectionTitle, SectionBox } from "./ModalStyles";
import PriorityDropdown from "./PriorityDropdown";
import { WorkItemType } from "./WorkItemModal";
import styled from "@emotion/styled";
import { EpicService } from "../../../services/epicService";
import { FeatureService } from "../../../services/featureService";
import { Dropdown as FluentDropdown } from "@fluentui/react/lib/Dropdown";
import type { IDropdownOption } from "@fluentui/react/lib/Dropdown";
import type { Feature } from "../../../domain/models/feature";
import type { Epic } from "../../../domain/models/epic";

const StyledDropdown = styled(FluentDropdown)`
  .ms-Dropdown-title {
    background-color: #232422;
    color: #fff;
    border-color: #444;
    height: 32px;
    line-height: 32px;
  }

  .ms-Dropdown-caretDown {
    color: #fff;
  }

  .ms-Dropdown:hover .ms-Dropdown-title {
    border-color: #4fa3ff;
  }

  .ms-Dropdown-callout {
    .ms-Dropdown-optionText {
      color: #fff;
    }
    .ms-Dropdown-item {
      background: #232422;
      &:hover {
        background: #333;
      }
    }
  }
`;

interface ModalRightProps {
  priority: number;
  setPriority: (priority: number) => void;
  editPriority: boolean;
  setEditPriority: (edit: boolean) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  editStartDate: boolean;
  setEditStartDate: (edit: boolean) => void;
  targetDate: string;
  setTargetDate: (date: string) => void;
  editTargetDate: boolean;
  setEditTargetDate: (edit: boolean) => void;
  storyPoint?: number;
  setStoryPoint?: (storyPoint: number) => void;
  editStoryPoint?: boolean;
  setEditStoryPoint?: (edit: boolean) => void;
  businessValue?: number;
  setBusinessValue?: (businessValue: number) => void;
  editBusinessValue?: boolean;
  setEditBusinessValue?: (edit: boolean) => void;
  workItemType?: WorkItemType;
  epicId?: string;
  setEpicId?: (epicId: string) => void;
  editEpicId?: boolean;
  setEditEpicId?: (edit: boolean) => void;
  featureId?: string;
  setFeatureId?: (featureId: string) => void;
  editFeatureId?: boolean;
  setEditFeatureId?: (edit: boolean) => void;
}

const ModalRight = ({
  priority,
  setPriority,
  editPriority,
  setEditPriority,
  startDate,
  setStartDate,
  editStartDate,
  setEditStartDate,
  targetDate,
  setTargetDate,
  editTargetDate,
  setEditTargetDate,
  storyPoint = 0,
  setStoryPoint = () => {},
  editStoryPoint = false,
  setEditStoryPoint = () => {},
  businessValue = 0,
  setBusinessValue = () => {},
  editBusinessValue = false,
  setEditBusinessValue = () => {},
  workItemType = WorkItemType.PBI,
  epicId = "",
  setEpicId = () => {},
  editEpicId = false,
  setEditEpicId = () => {},
  featureId = "",
  setFeatureId = () => {},
  editFeatureId = false,
  setEditFeatureId = () => {},
}: ModalRightProps) => {
  // State for Epic and Feature options
  const [epics, setEpics] = useState<IDropdownOption[]>([]);
  const [features, setFeatures] = useState<IDropdownOption[]>([]);
  const [loadingEpics, setLoadingEpics] = useState(false);
  const [loadingFeatures, setLoadingFeatures] = useState(false);
  const [selectedEpicName, setSelectedEpicName] = useState("");
  const [selectedFeatureName, setSelectedFeatureName] = useState("");

  // Service instances
  const epicService = new EpicService();
  const featureService = new FeatureService();

  // Determine if we should show story points and business value based on the work item type
  const showStoryPoints =
    workItemType === WorkItemType.PBI || workItemType === WorkItemType.BUG;
  const showBusinessValue =
    workItemType === WorkItemType.PBI || workItemType === WorkItemType.BUG;
  const showEpicSelector = workItemType === WorkItemType.FEATURE;
  const showFeatureSelector =
    workItemType === WorkItemType.PBI || workItemType === WorkItemType.BUG;

  // Load epics from API - only for FEATURE type
  useEffect(() => {
    if (showEpicSelector) {
      const loadEpics = async () => {
        try {
          setLoadingEpics(true);
          // Get team ID from localStorage
          const teamId = localStorage.getItem("selectedTeamId") || "";
          if (!teamId) return;

          // Get epics for the selected team
          const epicList = await epicService.getByTeam(teamId);
          const options = epicList.map((epic: Epic) => ({
            key: epic.id,
            text: epic.title,
          }));
          setEpics(options);

          // If epicId is set, find the name
          if (epicId) {
            const epic = epicList.find((e: Epic) => e.id === epicId);
            if (epic) setSelectedEpicName(epic.title);
          }
        } catch (error) {
          console.error("Error loading epics:", error);
        } finally {
          setLoadingEpics(false);
        }
      };

      loadEpics();
    }
  }, [showEpicSelector, epicId]);

  // Load features from API - only for PBI or BUG types
  useEffect(() => {
    if (showFeatureSelector) {
      const loadFeatures = async () => {
        try {
          setLoadingFeatures(true);

          // Get team ID for area context
          const teamId = localStorage.getItem("selectedTeamId") || "";
          if (!teamId) return;

          // Use area ID (temporarily same as team ID) to get features
          // In a real implementation, you would get the correct area ID for the team
          const areaId = teamId;

          // Get features by area
          const featureList = await featureService.getByArea(areaId);
          const options = featureList.map((feature: Feature) => ({
            key: feature.id,
            text: feature.title,
          }));
          setFeatures(options);

          // If featureId is set, find the name
          if (featureId) {
            const feature = featureList.find(
              (f: Feature) => f.id === featureId
            );
            if (feature) setSelectedFeatureName(feature.title);
          }
        } catch (error) {
          console.error("Error loading features:", error);
        } finally {
          setLoadingFeatures(false);
        }
      };

      loadFeatures();
    }
  }, [showFeatureSelector, featureId]);

  // Handle epic selection
  const handleEpicChange = (
    _: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ) => {
    if (option) {
      setEpicId(option.key as string);
      setSelectedEpicName(option.text as string);
    }
  };

  // Handle feature selection
  const handleFeatureChange = (
    _: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ) => {
    if (option) {
      setFeatureId(option.key as string);
      setSelectedFeatureName(option.text as string);
    }
  };

  return (
    <Right>
      <Section>
        <SectionTitle>Planning</SectionTitle>
        {editPriority ? (
          <PriorityDropdown
            value={priority}
            onChange={(v) => {
              setPriority(v);
              setEditPriority(false);
            }}
          />
        ) : (
          <SectionBox
            onClick={() => setEditPriority(true)}
            style={{ textAlign: "center" }}
          >
            Priority: <b>{priority}</b>
          </SectionBox>
        )}

        {showStoryPoints && (
          <SectionBox>
            {editStoryPoint ? (
              <input
                type="number"
                min="0"
                max="100"
                value={storyPoint}
                autoFocus
                onChange={(e) => setStoryPoint(Number(e.target.value))}
                onBlur={() => setEditStoryPoint(false)}
                style={{
                  background: "#232422",
                  color: "#fff",
                  border: "1px solid #444",
                  borderRadius: 3,
                  fontSize: 15,
                  padding: "4px 8px",
                  width: "100%",
                }}
              />
            ) : (
              <span
                onClick={() => setEditStoryPoint(true)}
                style={{ cursor: "pointer", display: "block" }}
              >
                Story Point: <b>{storyPoint > 0 ? storyPoint : "Not set"}</b>
              </span>
            )}
          </SectionBox>
        )}

        {showBusinessValue && (
          <SectionBox>
            {editBusinessValue ? (
              <input
                type="number"
                min="0"
                max="10"
                value={businessValue}
                autoFocus
                onChange={(e) => setBusinessValue(Number(e.target.value))}
                onBlur={() => setEditBusinessValue(false)}
                style={{
                  background: "#232422",
                  color: "#fff",
                  border: "1px solid #444",
                  borderRadius: 3,
                  fontSize: 15,
                  padding: "4px 8px",
                  width: "100%",
                }}
              />
            ) : (
              <span
                onClick={() => setEditBusinessValue(true)}
                style={{ cursor: "pointer", display: "block" }}
              >
                Business Value:{" "}
                <b>{businessValue > 0 ? businessValue : "Not set"}</b>
              </span>
            )}
          </SectionBox>
        )}

        <SectionBox>
          {editStartDate ? (
            <input
              type="date"
              value={startDate}
              autoFocus
              onChange={(e) => setStartDate(e.target.value)}
              onBlur={() => setEditStartDate(false)}
              style={{
                background: "#232422",
                color: "#fff",
                border: "1px solid #444",
                borderRadius: 3,
                fontSize: 15,
                padding: "4px 8px",
              }}
            />
          ) : (
            <span
              onClick={() => setEditStartDate(true)}
              style={{ cursor: "pointer" }}
            >
              {workItemType === WorkItemType.EPIC
                ? "Start Date:"
                : "Started Date:"}{" "}
              <span style={{ color: "#888" }}>
                {startDate
                  ? new Date(startDate).toLocaleDateString()
                  : "Select a date..."}
              </span>
            </span>
          )}
        </SectionBox>
        <SectionBox>
          {editTargetDate ? (
            <input
              type="date"
              value={targetDate}
              autoFocus
              onChange={(e) => setTargetDate(e.target.value)}
              onBlur={() => setEditTargetDate(false)}
              style={{
                background: "#232422",
                color: "#fff",
                border: "1px solid #444",
                borderRadius: 3,
                fontSize: 15,
                padding: "4px 8px",
              }}
            />
          ) : (
            <span
              onClick={() => setEditTargetDate(true)}
              style={{ cursor: "pointer" }}
            >
              {workItemType === WorkItemType.EPIC
                ? "End Date:"
                : "Target Date:"}{" "}
              <span style={{ color: "#888" }}>
                {targetDate
                  ? new Date(targetDate).toLocaleDateString()
                  : "Select a date..."}
              </span>
            </span>
          )}
        </SectionBox>
      </Section>
      <Section>
        <SectionTitle>Related Work</SectionTitle>
        {showEpicSelector && (
          <SectionBox>
            <label style={{ display: "block", marginBottom: "4px" }}>
              Epic:
            </label>
            {editEpicId || !epicId ? (
              <StyledDropdown
                placeholder={
                  loadingEpics ? "Loading epics..." : "Select an epic"
                }
                options={epics}
                selectedKey={epicId}
                onChange={handleEpicChange}
                disabled={loadingEpics}
                onDismiss={() => setEditEpicId(false)}
              />
            ) : (
              <span
                onClick={() => setEditEpicId(true)}
                style={{ cursor: "pointer", display: "block" }}
              >
                <b>{selectedEpicName || "No epic selected"}</b>
              </span>
            )}
          </SectionBox>
        )}

        {showFeatureSelector && (
          <SectionBox>
            <label style={{ display: "block", marginBottom: "4px" }}>
              Feature:
            </label>
            {editFeatureId || !featureId ? (
              <StyledDropdown
                placeholder={
                  loadingFeatures ? "Loading features..." : "Select a feature"
                }
                options={features}
                selectedKey={featureId}
                onChange={handleFeatureChange}
                disabled={loadingFeatures}
                onDismiss={() => setEditFeatureId(false)}
              />
            ) : (
              <span
                onClick={() => setEditFeatureId(true)}
                style={{ cursor: "pointer", display: "block" }}
              >
                <b>{selectedFeatureName || "No feature selected"}</b>
              </span>
            )}
          </SectionBox>
        )}
      </Section>
    </Right>
  );
};

export default ModalRight;
