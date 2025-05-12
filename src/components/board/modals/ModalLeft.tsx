import { useState, useEffect } from "react";
import {
  Left,
  Section,
  SectionTitle,
  SectionBox,
  SectionTextarea,
  CommentBox,
  Avatar,
  CommentInput,
} from "./ModalStyles";

interface ModalLeftProps {
  description: string;
  setDescription: (description: string) => void;
  editDescription?: boolean;
  setEditDescription?: (edit: boolean) => void;
  teknikTasarim: string;
  setTeknikTasarim: (tasarim: string) => void;
  editTeknikTasarim: boolean;
  setEditTeknikTasarim: (edit: boolean) => void;
  fonksiyonelTasarim: string;
  setFonksiyonelTasarim: (tasarim: string) => void;
  editFonksiyonelTasarim: boolean;
  setEditFonksiyonelTasarim: (edit: boolean) => void;
}

const ModalLeft = ({
  description,
  setDescription,
  editDescription: editDescriptionProp,
  setEditDescription,
  teknikTasarim,
  setTeknikTasarim,
  editTeknikTasarim,
  setEditTeknikTasarim,
  fonksiyonelTasarim,
  setFonksiyonelTasarim,
  editFonksiyonelTasarim,
  setEditFonksiyonelTasarim,
}: ModalLeftProps) => {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [localDescription, setLocalDescription] = useState(description);

  useEffect(() => {
    setLocalDescription(description);
  }, [description]);

  const handleDescriptionClick = () => {
    setIsEditingDescription(true);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setLocalDescription(e.target.value);
  };

  const handleDescriptionBlur = () => {
    setDescription(localDescription);
    setIsEditingDescription(false);
  };

  const handleDescriptionKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Escape") {
      setIsEditingDescription(false);
      setLocalDescription(description);
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setDescription(localDescription);
      setIsEditingDescription(false);
    }
  };

  const containerStyle = {
    width: "100%",
    maxWidth: "100%",
    overflow: "hidden",
  };

  const textareaStyle = {
    border: "1px solid #4fa3ff",
    minHeight: "80px",
    maxHeight: "150px",
    padding: "8px 10px",
    fontSize: "14px",
    width: "100%",
    overflow: "auto",
    wordWrap: "break-word" as const,
  };

  const boxStyle = {
    cursor: "pointer" as const,
    border: "1px solid #333",
    transition: "all 0.2s ease",
    minHeight: "60px",
    maxHeight: "120px",
    padding: "8px 10px",
    fontSize: "14px",
    width: "100%",
    overflow: "auto",
    wordWrap: "break-word" as const,
  };

  return (
    <Left style={containerStyle}>
      <Section>
        <SectionTitle>Description</SectionTitle>
        {isEditingDescription ? (
          <SectionTextarea
            value={localDescription}
            autoFocus
            onChange={handleDescriptionChange}
            onBlur={handleDescriptionBlur}
            onKeyDown={handleDescriptionKeyDown}
            style={textareaStyle}
            placeholder="Enter a description..."
          />
        ) : (
          <SectionBox onClick={handleDescriptionClick} style={boxStyle}>
            {description || "Click to add Description."}
          </SectionBox>
        )}
      </Section>
      <Section>
        <SectionTitle>Teknik Tasarım</SectionTitle>
        {editTeknikTasarim ? (
          <SectionTextarea
            value={teknikTasarim}
            autoFocus
            onChange={(e) => setTeknikTasarim(e.target.value)}
            onBlur={() => setEditTeknikTasarim(false)}
            style={textareaStyle}
          />
        ) : (
          <SectionBox
            onClick={() => setEditTeknikTasarim(true)}
            style={boxStyle}
          >
            {teknikTasarim || "Teknik tasarım ekleyin..."}
          </SectionBox>
        )}
      </Section>
      <Section>
        <SectionTitle>Fonksiyonel Tasarım</SectionTitle>
        {editFonksiyonelTasarim ? (
          <SectionTextarea
            value={fonksiyonelTasarim}
            autoFocus
            onChange={(e) => setFonksiyonelTasarim(e.target.value)}
            onBlur={() => setEditFonksiyonelTasarim(false)}
            style={textareaStyle}
          />
        ) : (
          <SectionBox
            onClick={() => setEditFonksiyonelTasarim(true)}
            style={boxStyle}
          >
            {fonksiyonelTasarim || "Fonksiyonel tasarım ekleyin..."}
          </SectionBox>
        )}
      </Section>
      <Section>
        <SectionTitle>Discussion</SectionTitle>
        <CommentBox>
          <Avatar>OO</Avatar>
          <CommentInput placeholder="Add a comment. Use # to link a work item, @ to mention a person, or ! to link a pull request." />
        </CommentBox>
      </Section>
    </Left>
  );
};

export default ModalLeft;
