import { Right, Section, SectionTitle, SectionBox } from "./ModalStyles";
import PriorityDropdown from "./PriorityDropdown";

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
}: ModalRightProps) => {
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
              Start Date:{" "}
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
              Target Date:{" "}
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
        <SectionBox>
          <a
            href="#"
            style={{
              color: "#4fa3ff",
              textDecoration: "underline",
              fontSize: 13,
            }}
          >
            Add an existing work item as a parent
          </a>
        </SectionBox>
      </Section>
    </Right>
  );
};

export default ModalRight;
