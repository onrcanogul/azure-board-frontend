import styled from "@emotion/styled";
import { DefaultButton } from "@fluentui/react";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 2000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow-y: auto;
  padding: 0;
`;

export const Modal = styled.div`
  background: #181a17;
  color: #fff;
  border-radius: 6px;
  margin: 16px 0;
  width: 95vw;
  max-width: 1100px;
  min-height: 500px;
  max-height: 90vh;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;

  @media (min-width: 768px) {
    margin: 24px 0;
    min-height: 600px;
  }

  @media (min-width: 1024px) {
    margin: 32px 0;
    min-height: 700px;
  }
`;

export const ModalHeader = styled.div`
  position: sticky;
  top: 0;
  background: #181a17;
  z-index: 10;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #232422;
  padding: 0;
`;

export const ModalHeaderTop = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 16px 0 16px;
  min-height: 48px;
  flex-wrap: wrap;

  @media (min-width: 768px) {
    padding: 16px 22px 0 22px;
    flex-wrap: nowrap;
  }

  @media (min-width: 1024px) {
    padding: 18px 28px 0 28px;
  }
`;

export const ModalHeaderActions = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ModalHeaderBtn = styled(DefaultButton)`
  background: #232422;
  color: #bdbdbd;
  border: 1px solid #333;
  font-size: 15px;
  padding: 4px 16px;
  border-radius: 4px;
  min-width: 0;
  &:hover {
    background: #232422cc;
    color: #fff;
    border-color: #4fa3ff;
  }
`;

export const ModalClose = styled(DefaultButton)`
  background: transparent;
  color: #bdbdbd;
  border: none;
  font-size: 22px;
  margin-left: 4px;
  &:hover {
    background: #232422;
    color: #fff;
  }
`;

export const ModalHeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px 0 16px;
  flex-wrap: wrap;

  @media (min-width: 768px) {
    padding: 10px 22px 0 22px;
    gap: 10px;
  }

  @media (min-width: 1024px) {
    padding: 10px 28px 0 28px;
    gap: 12px;
  }
`;

export const TypeIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #232422;
  border-radius: 3px;
  width: 28px;
  height: 28px;
  border-left: 4px solid #ffb900;
`;

export const ModalId = styled.span`
  color: #ffb900;
  font-weight: 600;
  margin-right: 8px;
  font-size: 13px;

  @media (min-width: 768px) {
    font-size: 14px;
  }

  @media (min-width: 1024px) {
    font-size: 15px;
  }
`;

export const ModalTitle = styled.input`
  font-size: 16px;
  font-weight: 600;
  background: transparent;
  color: #fff;
  border: none;
  outline: none;
  flex: 1;
  width: 100%;

  @media (min-width: 768px) {
    font-size: 18px;
  }

  @media (min-width: 1024px) {
    font-size: 20px;
  }
`;

export const ModalTitleDisplay = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  flex: 1;
  cursor: pointer;
  padding: 2px 0;
  width: 100%;

  @media (min-width: 768px) {
    font-size: 18px;
  }

  @media (min-width: 1024px) {
    font-size: 20px;
  }
`;

export const ModalTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  margin-top: 10px;
  border-bottom: 1px solid #232422;
  overflow-x: auto;

  @media (min-width: 768px) {
    padding: 0 22px;
    gap: 16px;
  }

  @media (min-width: 1024px) {
    padding: 0 28px;
    gap: 18px;
  }
`;

export const Tab = styled.div<{ active?: boolean }>`
  color: ${({ active }) => (active ? "#4fa3ff" : "#bdbdbd")};
  font-weight: ${({ active }) => (active ? 600 : 400)};
  border-bottom: ${({ active }) => (active ? "2px solid #4fa3ff" : "none")};
  padding: 8px 0 6px 0;
  cursor: pointer;
  font-size: 15px;
`;

export const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px 16px 80px 16px;
  flex: 1;
  overflow-y: visible;
  overflow-x: hidden;
  position: relative;
  min-height: 400px;

  @media (min-width: 768px) {
    padding: 20px 20px 80px 20px;
    flex-direction: row;
    min-height: 450px;
  }

  @media (min-width: 1024px) {
    padding: 24px 24px 80px 24px;
    min-height: 500px;
  }
`;

export const Left = styled.div`
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  max-height: 600px;
  padding-right: 10px;

  @media (min-width: 768px) {
    flex: 3;
    max-width: 65%;
    min-width: 0;
    margin-bottom: 0;
    max-height: 65vh;
  }
`;

export const Right = styled.div`
  width: 100%;

  @media (min-width: 768px) {
    flex: 1;
    max-width: 30%;
    min-width: 180px;
  }
`;

export const Section = styled.div`
  margin-bottom: 24px;
  width: 100%;
  overflow: hidden;
`;

export const SectionTitle = styled.div`
  font-weight: 600;
  margin-bottom: 6px;
  color: #fff;
  font-size: 15px;
`;

export const SectionBox = styled.div`
  background: #232422;
  border-radius: 3px;
  padding: 10px 12px;
  color: #bdbdbd;
  min-height: 36px;
  border: 1px solid #232422;
  cursor: pointer;
  overflow-wrap: break-word;
  word-break: break-word;
  width: 100%;
  overflow: hidden;
`;

export const SectionTextarea = styled.textarea`
  background: #181a17;
  color: #fff;
  border: 1px solid #333;
  border-radius: 3px;
  padding: 10px 12px;
  font-size: 14px;
  width: 100%;
  min-height: 100px;
  max-height: 300px;
  resize: vertical;
  font-family: inherit;
  overflow-y: auto;
  overflow-x: hidden;
  word-wrap: break-word;
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 8px;
`;

export const InfoItem = styled.div`
  color: #bdbdbd;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
`;

export const StateBox = styled.div`
  background: #232422;
  color: #fff;
  border-radius: 3px;
  padding: 2px 12px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #444;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
`;

export const TagBox = styled.div`
  background: #232422;
  color: #4fa3ff;
  border-radius: 3px;
  padding: 2px 8px;
  font-size: 13px;
  border: 1px solid #333;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const CommentBox = styled.div`
  background: #232422;
  border-radius: 3px;
  padding: 8px 10px 10px 10px;
  color: #bdbdbd;
  min-height: 36px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  border: 1px solid #232422;
`;

export const CommentInput = styled.textarea`
  background: #181a17;
  color: #fff;
  border: 1px solid #333;
  border-radius: 3px;
  padding: 6px;
  font-size: 13px;
  width: 100%;
  min-height: 32px;
  resize: vertical;
`;

export const Avatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #0078d4;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 13px;
  margin-right: 8px;
`;

export const ModalFooter = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  padding: 14px 16px;
  background: #181a17;
  z-index: 10;
  display: flex;
  justify-content: flex-end;
  width: 100%;
  border-top: 1px solid #333;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.2);

  @media (min-width: 768px) {
    padding: 16px 22px;
  }

  @media (min-width: 1024px) {
    padding: 18px 32px;
  }
`;
