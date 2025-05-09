import { Icon, Dropdown, ComboBox } from "@fluentui/react";
import { useState } from "react";
import type { WorkItem } from "../BoardColumn";
import {
  ModalHeader as StyledModalHeader,
  ModalHeaderTop,
  ModalHeaderActions,
  ModalHeaderBtn,
  ModalClose,
  ModalHeaderInfo,
  TypeIcon,
  ModalId,
  ModalTitle,
  ModalTitleDisplay,
  ModalTabs,
  Tab,
  StateBox,
  TagBox,
  InfoItem,
} from "./ModalStyles";
import {
  stateOptions,
  areaOptions,
  iterationOptions,
  userOptions,
} from "./modalOptions";

interface ModalHeaderProps {
  item: WorkItem;
  onClose: () => void;
  title: string;
  setTitle: (title: string) => void;
  editTitle: boolean;
  setEditTitle: (edit: boolean) => void;
  state: string;
  setState: (state: string) => void;
  editState: boolean;
  setEditState: (edit: boolean) => void;
  area: string;
  setArea: (area: string) => void;
  editArea: boolean;
  setEditArea: (edit: boolean) => void;
  iteration: string;
  setIteration: (iteration: string) => void;
  editIteration: boolean;
  setEditIteration: (edit: boolean) => void;
  assignedUser: string;
  setAssignedUser: (user: string) => void;
  editAssignedUser: boolean;
  setEditAssignedUser: (edit: boolean) => void;
}

const ModalHeader = ({
  item,
  onClose,
  title,
  setTitle,
  editTitle,
  setEditTitle,
  state,
  setState,
  editState,
  setEditState,
  area,
  setArea,
  editArea,
  setEditArea,
  iteration,
  setIteration,
  editIteration,
  setEditIteration,
  assignedUser,
  setAssignedUser,
  editAssignedUser,
  setEditAssignedUser,
}: ModalHeaderProps) => {
  return (
    <StyledModalHeader>
      <ModalHeaderTop>
        <TypeIcon>
          <Icon iconName="Crown" style={{ color: "#ffb900", fontSize: 18 }} />
        </TypeIcon>
        <ModalId>{item.id}</ModalId>
        {editTitle ? (
          <ModalTitle
            value={title}
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setEditTitle(false)}
            onKeyDown={(e) => e.key === "Enter" && setEditTitle(false)}
          />
        ) : (
          <ModalTitleDisplay onClick={() => setEditTitle(true)}>
            {title}
          </ModalTitleDisplay>
        )}
        <ModalHeaderActions>
          <ModalHeaderBtn>
            <Icon
              iconName="FavoriteStar"
              style={{ fontSize: 16, marginRight: 4 }}
            />
            Follow
          </ModalHeaderBtn>
          <ModalHeaderBtn>
            <Icon iconName="Settings" style={{ fontSize: 16 }} />
          </ModalHeaderBtn>
          <ModalClose onClick={onClose} iconProps={{ iconName: "Cancel" }} />
        </ModalHeaderActions>
      </ModalHeaderTop>
      <ModalHeaderInfo>
        {editState ? (
          <Dropdown
            options={stateOptions}
            selectedKey={state}
            onChange={(_, o) => {
              setState(o!.key as string);
              setEditState(false);
            }}
            onBlur={() => setEditState(false)}
            styles={{
              dropdown: {
                minWidth: 90,
                width: 110,
                background: "#232422",
                color: "#fff",
              },
              title: { background: "#232422", color: "#fff" },
            }}
          />
        ) : (
          <StateBox onClick={() => setEditState(true)}>
            <Icon
              iconName="CircleFill"
              style={{ color: "#ffb900", fontSize: 11 }}
            />{" "}
            {state}
          </StateBox>
        )}
        <TagBox>
          <Icon iconName="Tag" style={{ fontSize: 12 }} /> epic
        </TagBox>
        {editArea ? (
          <Dropdown
            options={areaOptions}
            selectedKey={area}
            onChange={(_, o) => {
              setArea(o!.key as string);
              setEditArea(false);
            }}
            onBlur={() => setEditArea(false)}
            styles={{
              dropdown: {
                minWidth: 80,
                width: 100,
                background: "#232422",
                color: "#fff",
              },
              title: { background: "#232422", color: "#fff" },
            }}
          />
        ) : (
          <InfoItem onClick={() => setEditArea(true)}>
            <Icon
              iconName="MapPin"
              style={{ fontSize: 13, color: "#bdbdbd" }}
            />{" "}
            {area || "Area"}
          </InfoItem>
        )}
        {editIteration ? (
          <Dropdown
            options={iterationOptions}
            selectedKey={iteration}
            onChange={(_, o) => {
              setIteration(o!.key as string);
              setEditIteration(false);
            }}
            onBlur={() => setEditIteration(false)}
            styles={{
              dropdown: {
                minWidth: 110,
                width: 130,
                background: "#232422",
                color: "#fff",
              },
              title: { background: "#232422", color: "#fff" },
            }}
          />
        ) : (
          <InfoItem onClick={() => setEditIteration(true)}>
            <Icon
              iconName="TimelineProgress"
              style={{ fontSize: 13, color: "#bdbdbd" }}
            />{" "}
            {iteration || "Iteration"}
          </InfoItem>
        )}
        {editAssignedUser ? (
          <ComboBox
            options={userOptions}
            selectedKey={assignedUser}
            autoComplete="on"
            allowFreeInput={false}
            useComboBoxAsMenuWidth
            onChange={(_, o) => {
              setAssignedUser(o ? (o.key as string) : "");
              setEditAssignedUser(false);
            }}
            onBlur={() => setEditAssignedUser(false)}
            styles={{
              root: { minWidth: 140, width: 160 },
              input: { background: "#232422", color: "#fff" },
              container: { background: "#232422" },
            }}
          />
        ) : (
          <InfoItem onClick={() => setEditAssignedUser(true)}>
            <Icon
              iconName="Contact"
              style={{ fontSize: 13, color: "#bdbdbd" }}
            />{" "}
            {assignedUser
              ? userOptions.find((u) => u.key === assignedUser)?.text
              : "No one selected"}
          </InfoItem>
        )}
        <InfoItem>
          <Icon
            iconName="Calendar"
            style={{ fontSize: 13, color: "#bdbdbd" }}
          />{" "}
          Added to backlog
        </InfoItem>
      </ModalHeaderInfo>
      <ModalTabs>
        <Tab active>Details</Tab>
      </ModalTabs>
    </StyledModalHeader>
  );
};

export default ModalHeader;
