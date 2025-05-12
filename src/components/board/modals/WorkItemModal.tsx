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
import workItemService from "../../../services/workItemService";

interface WorkItemModalProps {
  item: WorkItem;
  open: boolean;
  onClose: () => void;
  isNew?: boolean;
  onSave?: (item: WorkItem) => Promise<void>;
}

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    }
  }, [item]);

  const handleSave = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // Create updated work item from the current state
      const updatedItem: WorkItem = {
        ...item,
        description,
        functionalDescription,
        technicalDescription,
        priority,
        assignedUserId,
        state,
        areaId,
        sprintId,
        featureId,
        startedDate,
        dueDate,
        completedDate,
        tagIds,
      };

      // If onSave prop is provided, call it
      if (onSave) {
        await onSave(updatedItem);
      } else {
        console.log("Saving work item:", updatedItem);

        // Use workItemService based on isNew flag
        if (isNew) {
          await workItemService.create(updatedItem);
        } else {
          await workItemService.update(updatedItem);
        }
      }

      // Close modal after successful save
      onClose();
    } catch (error) {
      console.error("Error saving work item:", error);
      setError(
        typeof error === "string"
          ? error
          : "Failed to save work item. Please try again."
      );
    } finally {
      setIsLoading(false);
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
