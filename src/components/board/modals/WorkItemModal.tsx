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
  const [title, setTitle] = useState(isNew ? "" : item.title);
  const [editTitle, setEditTitle] = useState(false);
  const [state, setState] = useState(item.state);
  const [editState, setEditState] = useState(false);
  const [area, setArea] = useState(isNew ? "" : "OO");
  const [editArea, setEditArea] = useState(false);
  const [iteration, setIteration] = useState(isNew ? "" : "OO\\Sprint 1");
  const [editIteration, setEditIteration] = useState(false);
  const [description, setDescription] = useState("");
  const [editDescription, setEditDescription] = useState(false);
  const [priority, setPriority] = useState(isNew ? 2 : 2);
  const [editPriority, setEditPriority] = useState(false);
  const [teknikTasarim, setTeknikTasarim] = useState("");
  const [editTeknikTasarim, setEditTeknikTasarim] = useState(false);
  const [fonksiyonelTasarim, setFonksiyonelTasarim] = useState("");
  const [editFonksiyonelTasarim, setEditFonksiyonelTasarim] = useState(false);
  const [assignedUser, setAssignedUser] = useState<string>("");
  const [editAssignedUser, setEditAssignedUser] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [editStartDate, setEditStartDate] = useState(false);
  const [targetDate, setTargetDate] = useState<string>("");
  const [editTargetDate, setEditTargetDate] = useState(false);

  if (!open) return null;

  return (
    <Overlay>
      <Modal>
        <ModalHeader
          item={item}
          onClose={onClose}
          title={title}
          setTitle={setTitle}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
          state={state}
          setState={setState}
          editState={editState}
          setEditState={setEditState}
          area={area}
          setArea={setArea}
          editArea={editArea}
          setEditArea={setEditArea}
          iteration={iteration}
          setIteration={setIteration}
          editIteration={editIteration}
          setEditIteration={setEditIteration}
          assignedUser={assignedUser}
          setAssignedUser={setAssignedUser}
          editAssignedUser={editAssignedUser}
          setEditAssignedUser={setEditAssignedUser}
        />

        <ModalBody>
          <ModalLeft
            description={description}
            setDescription={setDescription}
            editDescription={editDescription}
            setEditDescription={setEditDescription}
            teknikTasarim={teknikTasarim}
            setTeknikTasarim={setTeknikTasarim}
            editTeknikTasarim={editTeknikTasarim}
            setEditTeknikTasarim={setEditTeknikTasarim}
            fonksiyonelTasarim={fonksiyonelTasarim}
            setFonksiyonelTasarim={setFonksiyonelTasarim}
            editFonksiyonelTasarim={editFonksiyonelTasarim}
            setEditFonksiyonelTasarim={setEditFonksiyonelTasarim}
          />

          <ModalRight
            priority={priority}
            setPriority={setPriority}
            editPriority={editPriority}
            setEditPriority={setEditPriority}
            startDate={startDate}
            setStartDate={setStartDate}
            editStartDate={editStartDate}
            setEditStartDate={setEditStartDate}
            targetDate={targetDate}
            setTargetDate={setTargetDate}
            editTargetDate={editTargetDate}
            setEditTargetDate={setEditTargetDate}
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
