import { useState, useEffect } from "react";
import type { WorkItem } from "../BoardColumn";
import {
  Overlay,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeaderBtn,
} from "./ModalStyles";
import ModalHeader from "./ModalHeader";
import ModalLeft from "./ModalLeft";
import ModalRight from "./ModalRight";
import workItemService, {
  WorkItemType as ServiceWorkItemType,
} from "../../../services/workItemService";
import pbiService from "../../../services/pbiService";
import { FeatureService } from "../../../services/featureService";
import { EpicService } from "../../../services/epicService";
import { BugStatus } from "../../../domain/models/bug";
import { PbiState } from "../../../domain/models/productBacklogItem";
import { Dropdown, type IDropdownOption } from "@fluentui/react";
import styled from "@emotion/styled";
import bugService from "../../../services/bugService";

// İş öğesi türlerini tanımlayan enum
export enum WorkItemType {
  PBI = "PBI",
  BUG = "Bug",
  EPIC = "Epic",
  FEATURE = "Feature",
}

const TypeSelector = styled.div`
  margin-bottom: 16px;
  margin-top: 8px;

  .ms-Dropdown-title {
    background-color: #232422;
    color: #fff;
    border-color: #444;
  }

  .ms-Dropdown-caretDown {
    color: #fff;
  }

  .ms-Dropdown:hover .ms-Dropdown-title {
    border-color: #4fa3ff;
  }
`;

const workItemTypeOptions: IDropdownOption[] = [
  { key: WorkItemType.PBI, text: "Product Backlog Item" },
  { key: WorkItemType.BUG, text: "Bug" },
  { key: WorkItemType.EPIC, text: "Epic" },
  { key: WorkItemType.FEATURE, text: "Feature" },
];

interface WorkItemModalProps {
  item: WorkItem;
  open: boolean;
  onClose: () => void;
  isNew?: boolean;
  onSave?: (item: WorkItem) => Promise<void>;
}

const featureServiceInstance = new FeatureService();
const epicServiceInstance = new EpicService();

const WorkItemModal = ({
  item,
  open,
  onClose,
  isNew = false,
  onSave,
}: WorkItemModalProps) => {
  // State variables
  const [description, setDescription] = useState("");
  const [editDescription, setEditDescription] = useState(false);
  const [functionalDescription, setFunctionalDescription] = useState("");
  const [editFunctionalDescription, setEditFunctionalDescription] =
    useState(false);
  const [technicalDescription, setTechnicalDescription] = useState("");
  const [editTechnicalDescription, setEditTechnicalDescription] =
    useState(false);
  const [priority, setPriority] = useState(0);
  const [editPriority, setEditPriority] = useState(false);
  const [assignedUserId, setAssignedUserId] = useState("");
  const [editAssignedUserId, setEditAssignedUserId] = useState(false);
  const [state, setState] = useState("");
  const [editState, setEditState] = useState(false);
  const [areaId, setAreaId] = useState("");
  const [editAreaId, setEditAreaId] = useState(false);
  const [sprintId, setSprintId] = useState("");
  const [editSprintId, setEditSprintId] = useState(false);
  const [featureId, setFeatureId] = useState("");
  const [editFeatureId, setEditFeatureId] = useState(false);
  const [startedDate, setStartedDate] = useState("");
  const [editStartedDate, setEditStartedDate] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [editDueDate, setEditDueDate] = useState(false);
  const [completedDate, setCompletedDate] = useState("");
  const [editCompletedDate, setEditCompletedDate] = useState(false);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [storyPoint, setStoryPoint] = useState(0);
  const [editStoryPoint, setEditStoryPoint] = useState(false);
  const [businessValue, setBusinessValue] = useState(0);
  const [editBusinessValue, setEditBusinessValue] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // İş öğesi türü state'i
  const [workItemType, setWorkItemType] = useState<WorkItemType>(
    WorkItemType.PBI
  );

  // Update state variables to include edit states for epicId and featureId
  const [editEpicId, setEditEpicId] = useState(false);

  // Update state from item prop whenever it changes
  useEffect(() => {
    if (item) {
      setDescription(item.description || "");
      setFunctionalDescription(item.functionalDescription || "");
      setTechnicalDescription(item.technicalDescription || "");
      setPriority(item.priority || 0);
      setAssignedUserId(item.assignedUserId || "");
      setState(item.state || "");
      setAreaId(item.areaId || "");
      setSprintId(item.sprintId || "");
      setFeatureId(item.featureId || "");
      setStartedDate(item.startedDate || "");
      setDueDate(item.dueDate || "");
      setCompletedDate(item.completedDate || "");
      setTagIds(item.tagIds || []);
      setStoryPoint(item.storyPoint || 0);
      setBusinessValue(item.businessValue || 0);

      // İş öğesi türünü mevcut veriden belirleme
      if (item.type === ServiceWorkItemType.BUG) {
        setWorkItemType(WorkItemType.BUG);
      } else if (item.type === ServiceWorkItemType.EPIC) {
        setWorkItemType(WorkItemType.EPIC);
      } else if (item.type === ServiceWorkItemType.FEATURE) {
        setWorkItemType(WorkItemType.FEATURE);
      } else {
        setWorkItemType(WorkItemType.PBI);
      }
    }
  }, [item]);

  const handleSave = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // Mevcut değerleri kullanıcı ID'si ile birlikte ayarla
      const currentAssignedUserId =
        assignedUserId || "a8e4ed53-b671-4f21-a3ee-fc87f1299a11";

      // Temel iş öğesi verileri
      const commonData = {
        description,
        priority,
        areaId,
      };

      // Seçilen iş öğesi türüne göre farklı işlemler
      switch (workItemType) {
        case WorkItemType.PBI:
          if (isNew) {
            await pbiService.create({
              ...commonData,
              sprintId,
              featureId,
              assignedUserId: currentAssignedUserId,
              functionalDescription,
              technicalDescription,
              state: (state as PbiState) || PbiState.NEW,
              storyPoint,
              businessValue,
              dueDate: dueDate ? new Date(dueDate) : new Date(),
              startedDate: startedDate ? new Date(startedDate) : new Date(),
              completedDate: completedDate
                ? new Date(completedDate)
                : new Date(),
              tagIds: new Set(tagIds),
            });
          } else {
            await pbiService.update({
              id: item.id,
              ...commonData,
              sprintId,
              featureId,
              assignedUserId: currentAssignedUserId,
              functionalDescription,
              technicalDescription,
              state: (state as PbiState) || PbiState.NEW,
              storyPoint,
              businessValue,
              dueDate: dueDate ? new Date(dueDate) : new Date(),
              startedDate: startedDate ? new Date(startedDate) : new Date(),
              completedDate: completedDate
                ? new Date(completedDate)
                : new Date(),
              tagIds: new Set(tagIds),
            });
          }
          break;

        case WorkItemType.BUG:
          if (isNew) {
            await bugService.create({
              ...commonData,
              sprintId,
              featureId,
              assignedUserId: currentAssignedUserId,
              functionalDescription,
              technicalDescription,
              status: (state as BugStatus) || BugStatus.NEW,
              storyPoint,
              businessValue,
              dueDate: dueDate ? new Date(dueDate) : new Date(),
              startedDate: startedDate ? new Date(startedDate) : new Date(),
              completedDate: completedDate
                ? new Date(completedDate)
                : new Date(),
              isNoBug: false,
              tagIds: new Set(tagIds),
            });
          } else {
            await bugService.update({
              id: item.id,
              ...commonData,
              sprintId,
              featureId,
              assignedUserId: currentAssignedUserId,
              functionalDescription,
              technicalDescription,
              status: (state as BugStatus) || BugStatus.NEW,
              storyPoint,
              businessValue,
              dueDate: dueDate ? new Date(dueDate) : new Date(),
              startedDate: startedDate ? new Date(startedDate) : new Date(),
              completedDate: completedDate
                ? new Date(completedDate)
                : new Date(),
              isNoBug: false,
              tagIds: new Set(tagIds),
            });
          }
          break;

        case WorkItemType.EPIC:
          if (isNew) {
            await epicServiceInstance.create({
              ...commonData,
              title: description,
              teamId: currentAssignedUserId,
              startDate: startedDate ? new Date(startedDate) : new Date(),
              endDate: dueDate ? new Date(dueDate) : new Date(),
              isDeleted: false,
            });
          } else {
            await epicServiceInstance.update({
              id: item.id,
              ...commonData,
              title: description,
              teamId: currentAssignedUserId,
              startDate: startedDate ? new Date(startedDate) : new Date(),
              endDate: dueDate ? new Date(dueDate) : new Date(),
              createdDate: new Date(),
              updatedDate: new Date(),
              isDeleted: false,
            });
          }
          break;

        case WorkItemType.FEATURE:
          if (isNew) {
            await featureServiceInstance.create({
              ...commonData,
              title: description,
              epicId: featureId || "",
              isCompleted: false,
              isDeleted: false,
            });
          } else {
            await featureServiceInstance.update({
              id: item.id,
              ...commonData,
              title: description,
              epicId: featureId || "",
              createdDate: new Date(),
              updatedDate: new Date(),
              isCompleted: false,
              isDeleted: false,
            });
          }
          break;

        default:
          // Varsayılan olarak workItemService'i kullan
          const updatedItem: WorkItem = {
            ...item,
            description,
            functionalDescription,
            technicalDescription,
            priority,
            assignedUserId: currentAssignedUserId,
            state,
            areaId,
            sprintId,
            featureId,
            startedDate,
            dueDate,
            completedDate,
            tagIds,
            storyPoint,
            businessValue,
            type: mapWorkItemTypeToService(workItemType),
            isDeleted: false,
          };

          if (onSave) {
            await onSave(updatedItem);
          } else if (isNew) {
            await workItemService.create(updatedItem);
          } else {
            await workItemService.update(updatedItem);
          }
      }

      console.log(`${workItemType} tipi iş öğesi kaydedildi`);
      // Close modal after successful save
      onClose();
    } catch (error) {
      console.error("Error saving work item:", error);
      setError(
        `İş öğesi kaydedilemedi: ${
          error instanceof Error ? error.message : "Bilinmeyen hata"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to map WorkItemType to ServiceWorkItemType
  const mapWorkItemTypeToService = (
    type: WorkItemType
  ): ServiceWorkItemType => {
    switch (type) {
      case WorkItemType.PBI:
        return ServiceWorkItemType.PBI;
      case WorkItemType.BUG:
        return ServiceWorkItemType.BUG;
      case WorkItemType.EPIC:
        return ServiceWorkItemType.EPIC;
      case WorkItemType.FEATURE:
        return ServiceWorkItemType.FEATURE;
      default:
        return ServiceWorkItemType.PBI;
    }
  };

  if (!item || !open) return null;

  return (
    <Overlay>
      <Modal>
        <ModalHeader
          item={item}
          onClose={onClose}
          title={description}
          setTitle={setDescription}
          editTitle={editDescription}
          setEditTitle={setEditDescription}
          state={state}
          setState={setState}
          editState={editState}
          setEditState={setEditState}
          area={areaId}
          setArea={setAreaId}
          editArea={editAreaId}
          setEditArea={setEditAreaId}
          iteration={sprintId}
          setIteration={setSprintId}
          editIteration={editSprintId}
          setEditIteration={setEditSprintId}
          assignedUser={assignedUserId}
          setAssignedUser={setAssignedUserId}
          editAssignedUser={editAssignedUserId}
          setEditAssignedUser={setEditAssignedUserId}
          workItemType={workItemType}
          setWorkItemType={setWorkItemType}
          workItemTypeOptions={workItemTypeOptions}
        />

        <ModalBody>
          <ModalLeft
            description={description}
            setDescription={setDescription}
            teknikTasarim={technicalDescription}
            setTeknikTasarim={setTechnicalDescription}
            editTeknikTasarim={editTechnicalDescription}
            setEditTeknikTasarim={setEditTechnicalDescription}
            fonksiyonelTasarim={functionalDescription}
            setFonksiyonelTasarim={setFunctionalDescription}
            editFonksiyonelTasarim={editFunctionalDescription}
            setEditFonksiyonelTasarim={setEditFunctionalDescription}
          />

          <ModalRight
            priority={priority}
            setPriority={setPriority}
            editPriority={editPriority}
            setEditPriority={setEditPriority}
            startDate={startedDate}
            setStartDate={setStartedDate}
            editStartDate={editStartedDate}
            setEditStartDate={setEditStartedDate}
            targetDate={dueDate}
            setTargetDate={setDueDate}
            editTargetDate={editDueDate}
            setEditTargetDate={setEditDueDate}
            storyPoint={storyPoint}
            setStoryPoint={setStoryPoint}
            editStoryPoint={editStoryPoint}
            setEditStoryPoint={setEditStoryPoint}
            businessValue={businessValue}
            setBusinessValue={setBusinessValue}
            editBusinessValue={editBusinessValue}
            setEditBusinessValue={setEditBusinessValue}
            workItemType={workItemType}
            epicId={workItemType === WorkItemType.FEATURE ? featureId : ""}
            setEpicId={setFeatureId}
            editEpicId={editFeatureId}
            setEditEpicId={setEditFeatureId}
            featureId={
              workItemType === WorkItemType.PBI ||
              workItemType === WorkItemType.BUG
                ? featureId
                : ""
            }
            setFeatureId={setFeatureId}
            editFeatureId={editFeatureId}
            setEditFeatureId={setEditFeatureId}
          />
        </ModalBody>

        <ModalFooter>
          {error && (
            <div style={{ color: "#ff5252", marginRight: "12px" }}>{error}</div>
          )}
          <ModalHeaderBtn
            style={{ minWidth: 120 }}
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : isNew ? "Create" : "Save and Close"}
          </ModalHeaderBtn>
        </ModalFooter>
      </Modal>
    </Overlay>
  );
};

export default WorkItemModal;
