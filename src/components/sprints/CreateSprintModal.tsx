import React, { useState } from "react";
import {
  Modal,
  TextField,
  PrimaryButton,
  DefaultButton,
  Stack,
  DatePicker,
  Dropdown,
  mergeStyleSets,
  Text,
} from "@fluentui/react";
import type {
  IDropdownOption,
  ITextFieldStyles,
  IDropdownStyles,
  IStyleFunction,
  IDatePickerStyleProps,
} from "@fluentui/react";
import styled from "@emotion/styled";
import { SprintState } from "../../domain/models/sprint";
import { SprintService } from "../../services/sprintService";

interface CreateSprintModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  onCreated: () => void;
  teamId?: string;
  projectId?: string;
}

const FormRow = styled.div`
  margin-bottom: 16px;
`;

const styles = mergeStyleSets({
  root: {
    selectors: {
      ".ms-Modal-scrollableContent": {
        padding: "24px",
      },
    },
  },
  header: {
    marginBottom: "20px",
  },
  title: {
    fontSize: "20px",
    fontWeight: 600,
    marginBottom: "4px",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: "14px",
    color: "#cccccc",
    marginBottom: "24px",
  },
  form: {
    maxWidth: "600px",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    marginTop: "24px",
  },
});

const datePickerStyles: Partial<IStyleFunction<IDatePickerStyleProps, {}>> = {
  root: { width: "100%" },
  textField: {
    backgroundColor: "#1e1f1c",
    borderColor: "#323232",
    color: "#ffffff",
    selectors: {
      "::placeholder": { color: "#888888" },
      ":hover": { borderColor: "#4fa3ff" },
      ".ms-TextField-fieldGroup": { color: "#ffffff" },
      ".ms-TextField-field": { color: "#ffffff" },
    },
  },
};

const textFieldStyles: Partial<ITextFieldStyles> = {
  root: { width: "100%" },
  fieldGroup: {
    backgroundColor: "#1e1f1c",
    borderColor: "#323232",
    selectors: {
      ":hover": { borderColor: "#4fa3ff" },
    },
  },
  field: {
    color: "#ffffff",
  },
  subComponentStyles: {
    label: {
      root: {
        color: "#ffffff",
        fontWeight: 400,
      },
    },
  },
};

const dropdownStyles: Partial<IDropdownStyles> = {
  root: { width: "100%" },
  dropdown: {
    backgroundColor: "#1e1f1c",
    borderColor: "#323232",
    selectors: {
      ":hover": { borderColor: "#4fa3ff" },
    },
  },
  title: { backgroundColor: "#1e1f1c", color: "#fff" },
  caretDownWrapper: { color: "#fff" },
  dropdownItemSelected: { backgroundColor: "#2a2d29" },
  dropdownItem: {
    backgroundColor: "#1e1f1c",
    selectors: { ":hover": { backgroundColor: "#2a2d29" } },
  },
  label: {
    color: "#ffffff",
    fontWeight: 400,
  },
};

const sprintStateOptions: IDropdownOption[] = [
  { key: SprintState.PLANNED, text: "Planned" },
  { key: SprintState.ACTIVE, text: "Active" },
];

const CreateSprintModal: React.FC<CreateSprintModalProps> = ({
  isOpen,
  onDismiss,
  onCreated,
  teamId = "",
  projectId = "",
}) => {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [state, setState] = useState<SprintState>(SprintState.PLANNED);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() + 14)) // Default 2 weeks
  );
  const [selectedTeamId, setSelectedTeamId] = useState(teamId);
  const [selectedProjectId, setSelectedProjectId] = useState(projectId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const sprintService = new SprintService();

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      setError("Sprint name is required");
      return;
    }

    if (!startDate || !endDate) {
      setError("Start and end dates are required");
      return;
    }

    if (startDate > endDate) {
      setError("Start date cannot be after end date");
      return;
    }

    if (!selectedTeamId || !selectedProjectId) {
      setError("Team and Project are required");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await sprintService.create({
        name,
        goal,
        state,
        startDate,
        endDate,
        teamId: selectedTeamId,
        projectId: selectedProjectId,
      });

      onCreated();
      resetForm();
      onDismiss();
    } catch (err) {
      console.error("Error creating sprint:", err);
      setError("Failed to create sprint. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName("");
    setGoal("");
    setState(SprintState.PLANNED);
    setStartDate(new Date());
    setEndDate(new Date(new Date().setDate(new Date().getDate() + 14)));
    setError("");
  };

  const handleDismiss = () => {
    resetForm();
    onDismiss();
  };

  const handleStartDateChange = (date: Date | null | undefined): void => {
    if (date) {
      setStartDate(date);
    }
  };

  const handleEndDateChange = (date: Date | null | undefined): void => {
    if (date) {
      setEndDate(date);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={handleDismiss}
      isBlocking={false}
      containerClassName={styles.root}
      styles={{ main: { backgroundColor: "#1e1f1c", minWidth: 500 } }}
    >
      <div className={styles.header}>
        <Text className={styles.title}>Create New Sprint</Text>
        <Text className={styles.subtitle}>
          Add a new sprint to track your team's work
        </Text>
      </div>

      <div className={styles.form}>
        {error && (
          <FormRow>
            <Text style={{ color: "#f1707b" }}>{error}</Text>
          </FormRow>
        )}

        <FormRow>
          <TextField
            label="Sprint Name"
            required
            value={name}
            onChange={(_, newValue) => setName(newValue || "")}
            placeholder="Enter sprint name"
            styles={textFieldStyles}
          />
        </FormRow>

        <FormRow>
          <TextField
            label="Goal"
            multiline
            rows={3}
            value={goal}
            onChange={(_, newValue) => setGoal(newValue || "")}
            placeholder="What is the goal for this sprint?"
            styles={textFieldStyles}
          />
        </FormRow>

        <Stack horizontal tokens={{ childrenGap: 12 }}>
          <Stack.Item grow>
            <FormRow>
              <DatePicker
                label="Start Date"
                value={startDate}
                onSelectDate={handleStartDateChange}
                firstDayOfWeek={0}
                placeholder="Select start date"
                ariaLabel="Select start date"
                styles={datePickerStyles}
              />
            </FormRow>
          </Stack.Item>
          <Stack.Item grow>
            <FormRow>
              <DatePicker
                label="End Date"
                value={endDate}
                onSelectDate={handleEndDateChange}
                firstDayOfWeek={0}
                placeholder="Select end date"
                ariaLabel="Select end date"
                styles={datePickerStyles}
                minDate={startDate}
              />
            </FormRow>
          </Stack.Item>
        </Stack>

        <FormRow>
          <Dropdown
            label="State"
            selectedKey={state}
            onChange={(_, option) =>
              option && setState(option.key as SprintState)
            }
            placeholder="Select a state"
            options={sprintStateOptions}
            styles={dropdownStyles}
          />
        </FormRow>

        {/* If team ID or project ID are not provided as props, we could add dropdowns here to select them */}

        <div className={styles.buttonRow}>
          <DefaultButton text="Cancel" onClick={handleDismiss} />
          <PrimaryButton
            text={isSubmitting ? "Creating..." : "Create Sprint"}
            onClick={handleSubmit}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </Modal>
  );
};

export default CreateSprintModal;
