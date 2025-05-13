import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import {
  Spinner,
  SpinnerSize,
  MessageBar,
  MessageBarType,
  Text,
  PrimaryButton,
  DefaultButton,
} from "@fluentui/react";
import { ProjectService } from "../services/projectService";
import type { Project } from "../domain/models/project";
import CreateProjectModal from "../components/projects/CreateProjectModal";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: #1e1f1c;
  color: #ffffff;
  padding: 40px;
  box-sizing: border-box;
  overflow-x: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  width: 100%;
  padding-right: 0;
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 20px;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
`;

const ProjectCard = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background-color: #2a2d29;
  padding: 20px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    background-color: #303330;
  }
`;

const ProjectTitle = styled.h3`
  margin: 0;
  margin-bottom: 10px;
  color: #ffffff;
  font-size: 18px;
`;

const ProjectDescription = styled.p`
  margin: 0;
  color: #cccccc;
  font-size: 14px;
  flex-grow: 1;
  margin-bottom: 16px;
`;

const ProjectDate = styled.span`
  color: #999999;
  font-size: 12px;
  align-self: flex-end;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  background-color: #2a2d29;
  border-radius: 8px;
  text-align: center;
  width: 100%;
  max-width: 600px;
  margin: 60px auto;
`;

const ProjectSelectionPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();
  const projectService = new ProjectService();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const fetchedProjects = await projectService.getAll();
      setProjects(fetchedProjects);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError(
        "Projeler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}/teams`);
  };

  const handleCreateProject = async () => {
    setIsCreateModalOpen(false);
    await fetchProjects();
  };

  if (loading) {
    return (
      <Container>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Spinner size={SpinnerSize.large} label="Projeler yükleniyor..." />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <MessageBar messageBarType={MessageBarType.error}>{error}</MessageBar>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Text variant="xxLarge" styles={{ root: { color: "#ffffff" } }}>
          Projeler
        </Text>
        <PrimaryButton
          text="Yeni Proje"
          iconProps={{ iconName: "Add" }}
          onClick={() => setIsCreateModalOpen(true)}
          styles={{
            root: {
              backgroundColor: "#4fa3ff",
              border: "none",
              padding: "8px 12px",
            },
            rootHovered: {
              backgroundColor: "#2b88d8",
            },
          }}
        />
      </Header>

      {projects.length === 0 ? (
        <EmptyState>
          <Text
            variant="large"
            styles={{ root: { color: "#ffffff", marginBottom: "16px" } }}
          >
            Henüz hiç projeniz yok
          </Text>
          <Text styles={{ root: { color: "#cccccc", marginBottom: "24px" } }}>
            Başlamak için yeni bir proje oluşturun.
          </Text>
          <PrimaryButton
            text="Yeni Proje Oluştur"
            iconProps={{ iconName: "Add" }}
            onClick={() => setIsCreateModalOpen(true)}
            styles={{
              root: {
                backgroundColor: "#4fa3ff",
                border: "none",
                padding: "8px 12px",
              },
              rootHovered: {
                backgroundColor: "#2b88d8",
              },
            }}
          />
        </EmptyState>
      ) : (
        <ProjectsGrid>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              onClick={() => handleProjectClick(project.id)}
            >
              <ProjectTitle>{project.name}</ProjectTitle>
              <ProjectDescription>
                {project.description ||
                  "Bu proje için açıklama bulunmamaktadır."}
              </ProjectDescription>
              <ProjectDate>
                Oluşturulma:{" "}
                {new Date(project.createdDate).toLocaleDateString("tr-TR")}
              </ProjectDate>
            </ProjectCard>
          ))}
        </ProjectsGrid>
      )}

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onDismiss={() => setIsCreateModalOpen(false)}
        onCreated={handleCreateProject}
      />
    </Container>
  );
};

export default ProjectSelectionPage;
