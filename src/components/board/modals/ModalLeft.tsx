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
  editDescription: boolean;
  setEditDescription: (edit: boolean) => void;
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
  editDescription,
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
  return (
    <Left>
      <Section>
        <SectionTitle>Description</SectionTitle>
        {editDescription ? (
          <SectionTextarea
            value={description}
            autoFocus
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => setEditDescription(false)}
          />
        ) : (
          <SectionBox onClick={() => setEditDescription(true)}>
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
          />
        ) : (
          <SectionBox onClick={() => setEditTeknikTasarim(true)}>
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
          />
        ) : (
          <SectionBox onClick={() => setEditFonksiyonelTasarim(true)}>
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
