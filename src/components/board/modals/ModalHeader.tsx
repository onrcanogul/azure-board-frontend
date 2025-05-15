import {
  Icon,
  Dropdown,
  ComboBox,
  type IDropdownOption,
} from "@fluentui/react";
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
  pbiStateOptions,
  bugStateOptions,
  epicStateOptions,
  featureStateOptions,
  areaOptions,
  iterationOptions,
  userOptions,
} from "./modalOptions";
import { WorkItemType } from "./WorkItemModal";
import styled from "@emotion/styled";

const TypeSelector = styled.div`
  margin: 12px 0;
  padding: 0 16px;

  .ms-Dropdown-title {
    background-color: #232422;
    color: #fff;
    border-color: #444;
  }

  .ms-Dropdown-caretDown {
    color: #fff;
  }

  .ms-Dropdown:hover .ms-Dropdown-title {
    border-color: #4fa3ff;
  }
`;

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
  workItemType?: WorkItemType;
  setWorkItemType?: (type: WorkItemType) => void;
  workItemTypeOptions?: IDropdownOption[];
}

// ID'leri isimlere çeviren yardımcı fonksiyonlar
const getAreaName = (areaId: string) => {
  const area = areaOptions.find((option) => option.key === areaId);
  return area ? area.text : "Area";
};

const getIterationName = (iterationId: string) => {
  const iteration = iterationOptions.find(
    (option) => option.key === iterationId
  );
  return iteration ? iteration.text : "Iteration";
};

const getUserName = (userId: string) => {
  const user = userOptions.find((option) => option.key === userId);
  return user ? user.text : "No one selected";
};

// ID'den kısaltılmış bir kod oluştur
const getShortId = (id: string) => {
  if (!id) return "";
  // ID'yi maksimum 8 karakter olacak şekilde kısalt
  return id.substring(0, 8);
};

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
  workItemType = WorkItemType.PBI,
  setWorkItemType = () => {},
  workItemTypeOptions = [],
}: ModalHeaderProps) => {
  // Get the appropriate state options based on work item type
  const getStateOptions = () => {
    switch (workItemType) {
      case WorkItemType.PBI:
        return pbiStateOptions;
      case WorkItemType.BUG:
        return bugStateOptions;
      case WorkItemType.EPIC:
        return epicStateOptions;
      case WorkItemType.FEATURE:
        return featureStateOptions;
      default:
        return stateOptions;
    }
  };

  // Get icon name based on work item type
  const getIconName = () => {
    switch (workItemType) {
      case WorkItemType.PBI:
        return "CheckboxComposite";
      case WorkItemType.BUG:
        return "Bug";
      case WorkItemType.EPIC:
        return "Crown";
      case WorkItemType.FEATURE:
        return "Trophy";
      default:
        return "CheckboxComposite";
    }
  };

  // Get icon color based on work item type
  const getIconColor = () => {
    switch (workItemType) {
      case WorkItemType.PBI:
        return "#4fa3ff";
      case WorkItemType.BUG:
        return "#ff5252";
      case WorkItemType.EPIC:
        return "#ffb900";
      case WorkItemType.FEATURE:
        return "#7e6fff";
      default:
        return "#4fa3ff";
    }
  };

  return (
    <StyledModalHeader>
      <ModalHeaderTop>
        <TypeIcon>
          <Icon
            iconName={getIconName()}
            style={{ color: getIconColor(), fontSize: 18 }}
          />
        </TypeIcon>
        <ModalId>{getShortId(item.id)}</ModalId>
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
            options={getStateOptions()}
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
              style={{ color: getIconColor(), fontSize: 11 }}
            />{" "}
            {state}
          </StateBox>
        )}
        <TagBox>
          <Icon iconName="Tag" style={{ fontSize: 12 }} />{" "}
          {workItemType.toLowerCase()}
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
            {getAreaName(area)}
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
            {getIterationName(iteration)}
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
            {getUserName(assignedUser)}
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

      {/* İş öğesi türü seçici */}
      <TypeSelector>
        <label style={{ display: "block", marginBottom: "8px", color: "#fff" }}>
          İş Öğesi Türü
        </label>
        <Dropdown
          selectedKey={workItemType}
          options={workItemTypeOptions}
          onChange={(_, option) =>
            option && setWorkItemType(option.key as WorkItemType)
          }
          styles={{
            dropdown: {
              width: "100%",
              backgroundColor: "#232422",
              color: "#fff",
            },
            dropdownItem: { backgroundColor: "#232422", color: "#fff" },
            dropdownItemSelected: {
              backgroundColor: "#353735",
              color: "#fff",
            },
            caretDown: { color: "#fff" },
            title: {
              backgroundColor: "#232422",
              color: "#fff",
              borderColor: "#444",
            },
          }}
        />
      </TypeSelector>

      <ModalTabs>
        <Tab active>Details</Tab>
      </ModalTabs>
    </StyledModalHeader>
  );
};

export default ModalHeader;
