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
  features?: Feature[];
  isLoadingFeatures?: boolean;
  epics?: Epic[];
  isLoadingEpics?: boolean;
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
  features = [],
  isLoadingFeatures = false,
  epics = [],
  isLoadingEpics = false,
}: ModalRightProps) => {
  // State for Epic and Feature options
  const [selectedEpicName, setSelectedEpicName] = useState("");
  const [selectedFeatureName, setSelectedFeatureName] = useState("");

  // Determine if we should show story points and business value based on the work item type
  const showStoryPoints =
    workItemType === WorkItemType.PBI || workItemType === WorkItemType.BUG;
  const showBusinessValue =
    workItemType === WorkItemType.PBI || workItemType === WorkItemType.BUG;
  const showEpicSelector = workItemType === WorkItemType.FEATURE;
  const showFeatureSelector =
    workItemType === WorkItemType.PBI || workItemType === WorkItemType.BUG;

  // Update selected epic name when epics or epicId changes
  useEffect(() => {
    if (epicId && epics.length > 0) {
      const epic = epics.find((e) => e.id === epicId);
      if (epic) {
        setSelectedEpicName(epic.title);
      }
    }
  }, [epicId, epics]);

  // Update selected feature name when features or featureId changes
  useEffect(() => {
    if (featureId && features.length > 0) {
      const feature = features.find((f) => f.id === featureId);
      if (feature) {
        setSelectedFeatureName(feature.title);
      }
    }
  }, [featureId, features]);

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

  // Convert epics to dropdown options
  const epicOptions: IDropdownOption[] = epics.map((epic) => ({
    key: epic.id,
    text: epic.title,
  }));

  // Convert features to dropdown options
  const featureOptions: IDropdownOption[] = features.map((feature) => ({
    key: feature.id,
    text: feature.title,
  }));

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

      {showEpicSelector && (
        <Section>
          <SectionTitle>Epic Selection</SectionTitle>
          <SectionBox>
            <label style={{ display: "block", marginBottom: "4px" }}>
              Epic <span style={{ color: "#ff5252" }}>*</span>
            </label>
            {editEpicId || !epicId ? (
              <StyledDropdown
                placeholder={
                  isLoadingEpics ? "Loading epics..." : "Select an epic"
                }
                options={epicOptions}
                selectedKey={epicId}
                onChange={handleEpicChange}
                disabled={isLoadingEpics}
                onDismiss={() => setEditEpicId(false)}
                required
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
        </Section>
      )}

      {showFeatureSelector && (
        <Section>
          <SectionTitle>Feature Selection</SectionTitle>
          <SectionBox>
            <label style={{ display: "block", marginBottom: "4px" }}>
              Feature
            </label>
            {editFeatureId || !featureId ? (
              <StyledDropdown
                placeholder={
                  isLoadingFeatures ? "Loading features..." : "Select a feature"
                }
                options={featureOptions}
                selectedKey={featureId}
                onChange={handleFeatureChange}
                disabled={isLoadingFeatures}
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
        </Section>
      )}
    </Right>
  );
};

export default ModalRight;
