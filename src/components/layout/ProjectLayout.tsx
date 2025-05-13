import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import Sidebar from "../Sidebar";
import {
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
  Icon,
} from "@fluentui/react";

interface ProjectLayoutProps {
  children: React.ReactNode;
  requireTeam?: boolean;
}

const LayoutContainer = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  background-color: #1e1f1c;
  position: relative;
`;

const MainContent = styled.div<{ sidebarOpen: boolean }>`
  flex: 1;
  min-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  transition: margin-left 0.3s ease;

  /* Mobile & Tablet (sidebar is hidden by default) */
  margin-left: 0;

  /* Desktop (sidebar is always visible) */
  @media (min-width: 1024px) {
    margin-left: 220px; // Width of the sidebar
  }
`;

const CenteredContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 16px;
`;

const MobileMenuToggle = styled.button`
  position: fixed;
  top: 12px;
  left: 12px;
  background: #232422;
  color: #fff;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  /* Hide on desktop */
  @media (min-width: 1024px) {
    display: none;
  }
`;

const Overlay = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  display: ${(props) => (props.visible ? "block" : "none")};

  /* Hide on desktop */
  @media (min-width: 1024px) {
    display: none;
  }
`;

const ProjectLayout: React.FC<ProjectLayoutProps> = ({
  children,
  requireTeam = true,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkProjectTeamSelection = () => {
      const projectId = localStorage.getItem("selectedProjectId");
      const teamId = localStorage.getItem("selectedTeamId");

      if (!projectId) {
        console.log("Proje seçilmemiş, yönlendiriliyor...");
        setError("Devam etmek için bir proje seçmelisiniz.");
        navigate("/projects");
        return;
      }

      if (requireTeam && !teamId) {
        console.log("Takım seçilmemiş, yönlendiriliyor...");
        setError("Devam etmek için bir takım seçmelisiniz.");
        navigate(`/projects/${projectId}/teams`);
        return;
      }

      setError(null);
      setLoading(false);
    };

    // Kısa bir gecikme ekleyerek UI'nin render olmasını sağlayalım
    const timer = setTimeout(() => {
      checkProjectTeamSelection();
    }, 100);

    return () => clearTimeout(timer);
  }, [navigate, requireTeam]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  if (loading) {
    return (
      <LayoutContainer>
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        <MainContent sidebarOpen={sidebarOpen}>
          <CenteredContent>
            <Spinner size={SpinnerSize.large} label="Yükleniyor..." />
          </CenteredContent>
        </MainContent>
      </LayoutContainer>
    );
  }

  if (error) {
    return (
      <LayoutContainer>
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        <MainContent sidebarOpen={sidebarOpen}>
          <CenteredContent>
            <MessageBar
              messageBarType={MessageBarType.warning}
              style={{ maxWidth: "400px" }}
            >
              {error}
            </MessageBar>
          </CenteredContent>
        </MainContent>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer>
      <MobileMenuToggle onClick={toggleSidebar}>
        <Icon iconName="GlobalNavButton" style={{ fontSize: 16 }} />
      </MobileMenuToggle>

      <Overlay visible={sidebarOpen} onClick={closeSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <MainContent sidebarOpen={sidebarOpen}>{children}</MainContent>
    </LayoutContainer>
  );
};

export default ProjectLayout;
