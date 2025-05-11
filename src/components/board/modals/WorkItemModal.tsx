import { useState } from "react";
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

interface WorkItemModalProps {
  item: WorkItem;
  open: boolean;
  onClose: () => void;
  isNew?: boolean;
}

const WorkItemModal = ({
  item,
  open,
  onClose,
  isNew = false,
}: WorkItemModalProps) => {
  if (!item) return null;

  // State variables
  const [description, setDescription] = useState(item.description || "");
  const [editDescription, setEditDescription] = useState(false);
  const [functionalDescription, setFunctionalDescription] = useState(
    item.functionalDescription || ""
  );
  const [editFunctionalDescription, setEditFunctionalDescription] =
    useState(false);
  const [technicalDescription, setTechnicalDescription] = useState(
    item.technicalDescription || ""
  );
  const [editTechnicalDescription, setEditTechnicalDescription] =
    useState(false);
  const [priority, setPriority] = useState(item.priority);
  const [editPriority, setEditPriority] = useState(false);
  const [assignedUserId, setAssignedUserId] = useState(
    item.assignedUserId || ""
  );
  const [editAssignedUserId, setEditAssignedUserId] = useState(false);
  const [state, setState] = useState(item.state);
  const [editState, setEditState] = useState(false);
  const [areaId, setAreaId] = useState(item.areaId || "");
  const [editAreaId, setEditAreaId] = useState(false);
  const [sprintId, setSprintId] = useState(item.sprintId || "");
  const [editSprintId, setEditSprintId] = useState(false);
  const [featureId, setFeatureId] = useState(item.featureId || "");
  const [editFeatureId, setEditFeatureId] = useState(false);
  const [startedDate, setStartedDate] = useState(item.startedDate || "");
  const [editStartedDate, setEditStartedDate] = useState(false);
  const [dueDate, setDueDate] = useState(item.dueDate || "");
  const [editDueDate, setEditDueDate] = useState(false);
  const [completedDate, setCompletedDate] = useState(item.completedDate || "");
  const [editCompletedDate, setEditCompletedDate] = useState(false);
  const [tagIds, setTagIds] = useState(item.tagIds || []);

  if (!open) return null;

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
            editDescription={editDescription}
            setEditDescription={setEditDescription}
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
          <ModalHeaderBtn style={{ minWidth: 120 }}>
            {isNew ? "Create" : "Save and Close"}
          </ModalHeaderBtn>
        </ModalFooter>
      </Modal>
    </Overlay>
  );
};

export default WorkItemModal;
