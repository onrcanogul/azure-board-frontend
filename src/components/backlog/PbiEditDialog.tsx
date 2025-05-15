import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogType,
  TextField,
  Dropdown,
  DatePicker,
  PrimaryButton,
  DefaultButton,
  Stack,
  Label,
  mergeStyleSets,
} from "@fluentui/react";
import type { IDropdownOption } from "@fluentui/react";
import {
  PbiState,
  type ProductBacklogItem,
} from "../../domain/models/productBacklogItem";
import { usePbiContext } from "../../context/PbiContext";

interface PbiEditDialogProps {
  pbi: ProductBacklogItem | null;
  isOpen: boolean;
  onDismiss: () => void;
}

const styles = mergeStyleSets({
  dialog: {
    ".ms-Dialog-main": {
      backgroundColor: "#232422",
      color: "#ffffff",
      minWidth: "700px",
      maxWidth: "900px",
    },
    ".ms-Dialog-title": {
      color: "#ffffff",
      fontSize: "24px",
      fontWeight: 600,
    },
    ".ms-Dialog-subText": {
      color: "#cccccc",
    },
  },
  fieldGroup: {
    backgroundColor: "#1e1f1c",
    color: "#ffffff",
    border: "1px solid #333",
    selectors: {
      ":hover": {
        borderColor: "#4fa3ff",
      },
    },
  },
  field: {
    color: "#ffffff",
  },
  label: {
    color: "#ffffff",
    fontWeight: 600,
  },
  dropdown: {
    ".ms-Dropdown-title": {
      backgroundColor: "#1e1f1c",
      color: "#ffffff",
      border: "1px solid #333",
      ":hover": {
        borderColor: "#4fa3ff",
      },
    },
    ".ms-Dropdown-caretDownWrapper": {
      color: "#ffffff",
    },
    ".ms-Dropdown-dropdownItem": {
      backgroundColor: "#1e1f1c",
      color: "#ffffff",
      ":hover": {
        backgroundColor: "#333",
        color: "#ffffff",
      },
    },
  },
  datePicker: {
    ".ms-TextField-fieldGroup": {
      backgroundColor: "#1e1f1c",
      border: "1px solid #333",
      ".ms-TextField-field": {
        color: "#ffffff",
      },
    },
  },
});

const stateOptions: IDropdownOption[] = [
  { key: PbiState.NEW, text: "New" },
  { key: PbiState.ACTIVE, text: "Active" },
  { key: PbiState.RESOLVED, text: "Resolved" },
  { key: PbiState.CLOSED, text: "Closed" },
];

const PbiEditDialog: React.FC<PbiEditDialogProps> = ({
  pbi,
  isOpen,
  onDismiss,
}) => {
  const { updatePbi } = usePbiContext();

  // State for form fields
  const [formData, setFormData] = useState<Partial<ProductBacklogItem>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when PBI changes
  useEffect(() => {
    if (pbi) {
      setFormData(pbi);
    } else {
      setFormData({});
    }
  }, [pbi]);

  // Handle form field changes
  const handleFieldChange = (field: keyof ProductBacklogItem, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!pbi || !formData.id) return;

    setIsSubmitting(true);
    try {
      // Create a complete PBI object with all required fields
      const updatedPbi: ProductBacklogItem = {
        id: pbi.id,
        sprintId: formData.sprintId || pbi.sprintId,
        areaId: formData.areaId || pbi.areaId,
        featureId: formData.featureId || pbi.featureId,
        assignedUserId: formData.assignedUserId || pbi.assignedUserId,
        description: formData.description || pbi.description,
        functionalDescription:
          formData.functionalDescription || pbi.functionalDescription,
        technicalDescription:
          formData.technicalDescription || pbi.technicalDescription,
        priority: formData.priority || pbi.priority,
        state: formData.state || pbi.state,
        storyPoint: formData.storyPoint || pbi.storyPoint,
        businessValue: formData.businessValue || pbi.businessValue,
        dueDate: formData.dueDate || pbi.dueDate,
        startedDate: formData.startedDate || pbi.startedDate,
        completedDate: formData.completedDate || pbi.completedDate,
        tagIds: formData.tagIds || pbi.tagIds,
        isDeleted: false,
      };

      // Update PBI through context (this will update both UI and backend)
      await updatePbi(updatedPbi);

      // Close the dialog
      onDismiss();
    } catch (error) {
      console.error("Failed to update PBI:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!pbi) return null;

  return (
    <Dialog
      hidden={!isOpen}
      onDismiss={onDismiss}
      dialogContentProps={{
        type: DialogType.normal,
        title: `Edit PBI: ${pbi.description}`,
        subText: "Update product backlog item details",
      }}
      modalProps={{
        isBlocking: true,
        styles: { main: { backgroundColor: "#232422" } },
        className: styles.dialog,
      }}
    >
      <Stack tokens={{ childrenGap: 16, padding: "0 0 20px" }}>
        <TextField
          label="Description"
          value={formData.description || ""}
          onChange={(_, newValue) => handleFieldChange("description", newValue)}
          required
          styles={{
            fieldGroup: styles.fieldGroup,
            field: styles.field,
            subComponentStyles: { label: { root: styles.label } },
          }}
        />

        <TextField
          label="Functional Description"
          multiline
          rows={4}
          value={formData.functionalDescription || ""}
          onChange={(_, newValue) =>
            handleFieldChange("functionalDescription", newValue)
          }
          styles={{
            fieldGroup: styles.fieldGroup,
            field: styles.field,
            subComponentStyles: { label: { root: styles.label } },
          }}
        />

        <TextField
          label="Technical Description"
          multiline
          rows={4}
          value={formData.technicalDescription || ""}
          onChange={(_, newValue) =>
            handleFieldChange("technicalDescription", newValue)
          }
          styles={{
            fieldGroup: styles.fieldGroup,
            field: styles.field,
            subComponentStyles: { label: { root: styles.label } },
          }}
        />

        <Stack horizontal tokens={{ childrenGap: 16 }}>
          <Stack.Item grow={1}>
            <Dropdown
              label="State"
              selectedKey={formData.state}
              options={stateOptions}
              onChange={(_, option) =>
                option && handleFieldChange("state", option.key)
              }
              styles={{
                root: styles.dropdown,
                subComponentStyles: { label: { root: styles.label } },
              }}
            />
          </Stack.Item>

          <Stack.Item grow={1}>
            <TextField
              label="Priority"
              type="number"
              min={1}
              value={formData.priority?.toString() || ""}
              onChange={(_, newValue) =>
                handleFieldChange(
                  "priority",
                  newValue ? parseInt(newValue, 10) : 0
                )
              }
              styles={{
                fieldGroup: styles.fieldGroup,
                field: styles.field,
                subComponentStyles: { label: { root: styles.label } },
              }}
            />
          </Stack.Item>

          <Stack.Item grow={1}>
            <TextField
              label="Story Points"
              type="number"
              min={0}
              value={formData.storyPoint?.toString() || ""}
              onChange={(_, newValue) =>
                handleFieldChange(
                  "storyPoint",
                  newValue ? parseInt(newValue, 10) : 0
                )
              }
              styles={{
                fieldGroup: styles.fieldGroup,
                field: styles.field,
                subComponentStyles: { label: { root: styles.label } },
              }}
            />
          </Stack.Item>
        </Stack>

        <Stack horizontal tokens={{ childrenGap: 16 }}>
          <Stack.Item grow={1}>
            <DatePicker
              label="Due Date"
              value={formData.dueDate ? new Date(formData.dueDate) : undefined}
              onSelectDate={(date) => handleFieldChange("dueDate", date)}
              styles={{
                root: styles.datePicker,
                textField: {
                  fieldGroup: styles.fieldGroup,
                  field: styles.field,
                },
              }}
            />
          </Stack.Item>

          <Stack.Item grow={1}>
            <TextField
              label="Business Value"
              type="number"
              min={0}
              value={formData.businessValue?.toString() || ""}
              onChange={(_, newValue) =>
                handleFieldChange(
                  "businessValue",
                  newValue ? parseInt(newValue, 10) : 0
                )
              }
              styles={{
                fieldGroup: styles.fieldGroup,
                field: styles.field,
                subComponentStyles: { label: { root: styles.label } },
              }}
            />
          </Stack.Item>
        </Stack>
      </Stack>

      <Stack horizontal tokens={{ childrenGap: 10 }} horizontalAlign="end">
        <DefaultButton
          text="Cancel"
          onClick={onDismiss}
          styles={{
            root: { backgroundColor: "#333", color: "#fff", border: "none" },
            rootHovered: { backgroundColor: "#444" },
          }}
        />
        <PrimaryButton
          text={isSubmitting ? "Saving..." : "Save and Close"}
          onClick={handleSubmit}
          disabled={isSubmitting}
          styles={{
            root: { backgroundColor: "#0078d4" },
            rootHovered: { backgroundColor: "#106ebe" },
          }}
        />
      </Stack>
    </Dialog>
  );
};

export default PbiEditDialog;
