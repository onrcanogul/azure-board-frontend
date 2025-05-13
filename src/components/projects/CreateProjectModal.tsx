import React, { useState } from "react";
import {
  Modal,
  TextField,
  PrimaryButton,
  DefaultButton,
  Stack,
  Text,
  MessageBar,
  MessageBarType,
} from "@fluentui/react";
import type { ITextFieldStyles } from "@fluentui/react";
import styled from "@emotion/styled";
import { ProjectService } from "../../services/projectService";

interface CreateProjectModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  onCreated: () => void;
}

const FormRow = styled.div`
  margin-bottom: 16px;
`;

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

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onDismiss,
  onCreated,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const projectService = new ProjectService();

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      setError("Proje adı zorunludur");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await projectService.create({
        name,
        description,
        isDeleted: false,
      });

      onCreated();
      resetForm();
      onDismiss();
    } catch (err) {
      console.error("Error creating project:", err);
      setError(
        "Proje oluşturulurken bir hata meydana geldi. Lütfen tekrar deneyin."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setError("");
  };

  const handleDismiss = () => {
    resetForm();
    onDismiss();
  };

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={handleDismiss}
      isBlocking={false}
      containerClassName="modal-container"
      styles={{ main: { backgroundColor: "#1e1f1c", minWidth: 500 } }}
    >
      <div style={{ padding: "24px" }}>
        <Text
          variant="xLarge"
          block
          styles={{ root: { color: "#ffffff", marginBottom: "4px" } }}
        >
          Yeni Proje Oluştur
        </Text>
        <Text styles={{ root: { color: "#cccccc", marginBottom: "24px" } }}>
          Yeni bir proje oluşturarak takımlarınızı ve iş ögelerinizi yönetmeye
          başlayın.
        </Text>

        {error && (
          <FormRow>
            <MessageBar messageBarType={MessageBarType.error}>
              {error}
            </MessageBar>
          </FormRow>
        )}

        <FormRow>
          <TextField
            label="Proje Adı"
            value={name}
            onChange={(_, newValue) => setName(newValue || "")}
            required
            styles={textFieldStyles}
          />
        </FormRow>

        <FormRow>
          <TextField
            label="Açıklama"
            value={description}
            onChange={(_, newValue) => setDescription(newValue || "")}
            multiline
            rows={4}
            styles={textFieldStyles}
          />
        </FormRow>

        <Stack
          horizontal
          tokens={{ childrenGap: 8 }}
          horizontalAlign="end"
          style={{ marginTop: "24px" }}
        >
          <DefaultButton
            text="İptal"
            onClick={handleDismiss}
            styles={{
              root: { minWidth: 80 },
              rootHovered: { backgroundColor: "#232422" },
            }}
          />
          <PrimaryButton
            text="Oluştur"
            onClick={handleSubmit}
            disabled={isSubmitting}
            styles={{
              root: { minWidth: 80, backgroundColor: "#4fa3ff" },
              rootPressed: { backgroundColor: "#2b88d8" },
            }}
          />
        </Stack>
      </div>
    </Modal>
  );
};

export default CreateProjectModal;
