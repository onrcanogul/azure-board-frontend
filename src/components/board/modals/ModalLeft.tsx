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
import styled from "@emotion/styled";

// Create a styled section specifically for the Discussion section
const DiscussionSection = styled(Section)`
  margin-bottom: 20px;
`;

// Style for the comment box
const StyledCommentBox = styled(CommentBox)`
  margin-bottom: 20px;
`;

// Smaller text area with specific height to ensure highlights are visible
const ScrollableTextArea = styled(SectionTextarea)`
  min-height: 80px;
  max-height: 150px;
  resize: vertical;
  margin-bottom: 12px;
`;

// Custom section box with better focus visibility
const FocusableSectionBox = styled(SectionBox)`
  margin-bottom: 12px;
  padding: 12px;
  border-radius: 4px;

  &:focus,
  &:active {
    outline: 2px solid #ffb900;
    outline-offset: 2px;
  }
`;

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

  // Boxların stili
  const boxStyle = {
    cursor: "pointer" as const,
    border: "1px solid #333",
    transition: "all 0.2s ease",
    minHeight: "40px",
    height: "auto",
    padding: "10px 12px",
    fontSize: "14px",
    width: "100%",
    overflow: "auto",
    wordWrap: "break-word" as const,
    marginBottom: "12px",
    borderRadius: "4px",
    display: "block",
  };

  return (
    <Left>
      <Section>
        <SectionTitle>Description</SectionTitle>
        {isEditingDescription ? (
          <ScrollableTextArea
            value={localDescription}
            autoFocus
            onChange={handleDescriptionChange}
            onBlur={handleDescriptionBlur}
            onKeyDown={handleDescriptionKeyDown}
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
          <ScrollableTextArea
            value={teknikTasarim}
            autoFocus
            onChange={(e) => setTeknikTasarim(e.target.value)}
            onBlur={() => setEditTeknikTasarim(false)}
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
          <ScrollableTextArea
            value={fonksiyonelTasarim}
            autoFocus
            onChange={(e) => setFonksiyonelTasarim(e.target.value)}
            onBlur={() => setEditFonksiyonelTasarim(false)}
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
      <DiscussionSection>
        <SectionTitle>Discussion</SectionTitle>
        <StyledCommentBox>
          <Avatar>OO</Avatar>
          <CommentInput placeholder="Add a comment. Use # to link a work item, @ to mention a person, or ! to link a pull request." />
        </StyledCommentBox>
      </DiscussionSection>
    </Left>
  );
};

export default ModalLeft;
