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
`;

export const Modal = styled.div`
  background: #181a17;
  color: #fff;
  border-radius: 6px;
  margin: 32px 0 32px 0;
  width: 1100px;
  max-width: 90vw;
  min-height: 700px;
  max-height: 85vh;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ModalHeader = styled.div`
  position: sticky;
  top: 0;
  background: #181a17;
  z-index: 2;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #232422;
  padding: 0;
`;

export const ModalHeaderTop = styled.div`
  display: flex;
  align-items: center;
  padding: 18px 28px 0 28px;
  min-height: 48px;
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
  gap: 12px;
  padding: 10px 28px 0 28px;
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
  font-size: 15px;
`;

export const ModalTitle = styled.input`
  font-size: 20px;
  font-weight: 600;
  background: transparent;
  color: #fff;
  border: none;
  outline: none;
  flex: 1;
`;

export const ModalTitleDisplay = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  flex: 1;
  cursor: pointer;
  padding: 2px 0;
`;

export const ModalTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 0 28px;
  margin-top: 10px;
  border-bottom: 1px solid #232422;
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
  gap: 20px;
  padding: 24px 24px 80px 24px;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const Left = styled.div`
  flex: 3;
  max-width: 65%;
  min-width: 0;
  overflow-x: hidden;
`;

export const Right = styled.div`
  flex: 1;
  max-width: 30%;
  min-width: 180px;
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
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 18px 32px;
  background: #181a17;
  z-index: 3;
  display: flex;
  justify-content: flex-end;
  width: 100%;
  border-top: 1px solid #333;
`;
