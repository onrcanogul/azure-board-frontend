import styled from "@emotion/styled";
import { Text, Icon } from "@fluentui/react";
import { NavLink, useLocation } from "react-router-dom";

const SIDEBAR_WIDTH = 220;

const SidebarContainer = styled.div`
  width: ${SIDEBAR_WIDTH}px;
  background: #20211e;
  color: #fff;
  height: 100vh;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #232422;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  overflow-y: auto;
  overflow-x: hidden;
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px 16px 12px 16px;
  font-size: 18px;
  font-weight: bold;
  color: #4fa3ff;
`;

const SidebarSection = styled.div`
  margin-top: 12px;
  width: 100%;
`;

const MenuItem = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 17px;
  cursor: pointer;
  color: ${(props) => (props.active ? "#fff" : "#bdbdbd")};
  font-size: 16px;
  text-decoration: none;
  position: relative;
  background: ${(props) => (props.active ? "#232422" : "transparent")};

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: ${(props) => (props.active ? "#4fa3ff" : "transparent")};
  }

  &:hover {
    background: #232422;
    color: #fff;

    &::before {
      background: #4fa3ff;
    }
  }
`;

const items = [
  { icon: "Home", label: "Overview", path: "/overview" },
  { icon: "Boards", label: "Boards", path: "/boards" },
  { icon: "ClipboardList", label: "Work items", path: "/work-items" },
  { icon: "Boards", label: "Backlogs", path: "/backlogs" },
  { icon: "Sprint", label: "Sprints", path: "/sprints" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <SidebarContainer>
      <SidebarHeader>
        <Icon iconName="AzureLogo" style={{ color: "#4fa3ff", fontSize: 22 }} />
        <span>Onur Board</span>
      </SidebarHeader>
      <SidebarSection>
        {items.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              style={{ textDecoration: "none" }}
            >
              <MenuItem active={isActive}>
                <Icon iconName={item.icon} style={{ fontSize: 18 }} />
                <span>{item.label}</span>
              </MenuItem>
            </NavLink>
          );
        })}
      </SidebarSection>
      <div style={{ flex: 1 }} />
      <MenuItem
        active={false}
        style={{ borderTop: "1px solid #232422", marginTop: 16 }}
      >
        <Icon iconName="Settings" style={{ fontSize: 18 }} />
        <span>Project settings</span>
      </MenuItem>
    </SidebarContainer>
  );
};

export default Sidebar;
