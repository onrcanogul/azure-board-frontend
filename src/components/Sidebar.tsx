import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Text, Icon } from "@fluentui/react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ProjectService } from "../services/projectService";
import { TeamService } from "../services/teamService";
import type { Project } from "../domain/models/project";
import type { Team } from "../domain/models/team";

const SIDEBAR_WIDTH = 220;

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const SidebarContainer = styled.div<{ isOpen: boolean }>`
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
  transition: transform 0.3s ease;

  /* Mobile & Tablet: slide in/out based on isOpen state */
  transform: translateX(${(props) => (props.isOpen ? "0" : "-100%")});

  /* Desktop: always visible */
  @media (min-width: 1024px) {
    transform: translateX(0);
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 16px 12px 16px;
  font-size: 18px;
  font-weight: bold;
  color: #4fa3ff;
`;

const SidebarTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #bdbdbd;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    color: #fff;
  }

  /* Hide on desktop */
  @media (min-width: 1024px) {
    display: none;
  }
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

const ProjectInfo = styled.div`
  padding: 12px 17px;
  border-bottom: 1px solid #232422;
  margin-bottom: 8px;
`;

const ProjectName = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    color: #4fa3ff;
  }
`;

const TeamName = styled.div`
  font-size: 14px;
  color: #bdbdbd;
  margin-top: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    color: #4fa3ff;
  }
`;

const items = [
  { icon: "Home", label: "Overview", path: "/overview" },
  { icon: "Boards", label: "Boards", path: "/boards" },
  { icon: "Boards", label: "Backlogs", path: "/backlogs" },
  { icon: "Sprint", label: "Sprints", path: "/sprints" },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjectAndTeam = async () => {
      try {
        setLoading(true);

        const projectId = localStorage.getItem("selectedProjectId");
        const teamId = localStorage.getItem("selectedTeamId");
        const teamName = localStorage.getItem("selectedTeamName");

        if (projectId) {
          try {
            const projectService = new ProjectService();
            const projectData = await projectService.getById(projectId);
            setProject(projectData);

            if (teamId && teamName) {
              setTeam({
                id: teamId,
                name: teamName,
                description: "",
                createdDate: new Date(),
                updatedDate: new Date(),
                projectId: projectId,
                isDeleted: false,
              });
            }
          } catch (projectErr) {
            console.error("Proje verisi yüklenirken hata oluştu:", projectErr);
            localStorage.removeItem("selectedProjectId");
            localStorage.removeItem("selectedTeamId");
            localStorage.removeItem("selectedTeamName");
          }
        }
      } catch (err) {
        console.error("Proje ve takım verisi yüklenirken hata oluştu:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProjectAndTeam();
  }, [location.pathname]);

  const handleProjectClick = () => {
    navigate("/projects");
    if (onClose) onClose();
  };

  const handleTeamClick = () => {
    const projectId = localStorage.getItem("selectedProjectId");
    if (projectId) {
      navigate(`/projects/${projectId}/teams`);
    } else {
      navigate("/projects");
    }
    if (onClose) onClose();
  };

  const handleMenuItemClick = () => {
    // On mobile, close the sidebar after clicking a menu item
    if (onClose && window.innerWidth < 1024) {
      onClose();
    }
  };

  const noSelectionMessage = !loading && !project && (
    <ProjectInfo>
      <Text
        onClick={handleProjectClick}
        style={{ color: "#4fa3ff", cursor: "pointer", fontSize: 14 }}
      >
        Proje ve takım seçin
      </Text>
    </ProjectInfo>
  );

  return (
    <SidebarContainer isOpen={isOpen}>
      <SidebarHeader>
        <SidebarTitle>
          <Icon
            iconName="AzureLogo"
            style={{ color: "#4fa3ff", fontSize: 22 }}
          />
          <span>Onur Board</span>
        </SidebarTitle>
        <CloseButton onClick={onClose}>
          <Icon iconName="Cancel" style={{ fontSize: 16 }} />
        </CloseButton>
      </SidebarHeader>

      {noSelectionMessage ||
        (project && (
          <ProjectInfo>
            <ProjectName onClick={handleProjectClick}>
              {project.name}
              <Icon iconName="ChevronDown" style={{ fontSize: 12 }} />
            </ProjectName>
            {team && (
              <TeamName onClick={handleTeamClick}>
                <Icon
                  iconName="Group"
                  style={{ fontSize: 12, marginRight: 6 }}
                />
                {team.name}
              </TeamName>
            )}
          </ProjectInfo>
        ))}

      <SidebarSection>
        {items.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              style={{ textDecoration: "none" }}
              onClick={handleMenuItemClick}
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
        onClick={handleProjectClick}
      >
        <Icon iconName="Settings" style={{ fontSize: 18 }} />
        <span>Project settings</span>
      </MenuItem>
    </SidebarContainer>
  );
};

export default Sidebar;
