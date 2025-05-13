import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "@emotion/styled";
import {
  Spinner,
  SpinnerSize,
  MessageBar,
  MessageBarType,
  Text,
  PrimaryButton,
  IconButton,
  Stack,
  StackItem,
  Icon,
} from "@fluentui/react";
import { TeamService } from "../services/teamService";
import { ProjectService } from "../services/projectService";
import type { Team } from "../domain/models/team";
import type { Project } from "../domain/models/project";
import CreateTeamModal from "../components/teams/CreateTeamModal";

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
  margin-bottom: 10px;
  width: 100%;
  padding-right: 0;
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 30px;
  color: #cccccc;
`;

const TeamsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 20px;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
`;

const TeamCard = styled.div`
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

const TeamTitle = styled.h3`
  margin: 0;
  margin-bottom: 10px;
  color: #ffffff;
  font-size: 18px;
`;

const TeamDescription = styled.p`
  margin: 0;
  color: #cccccc;
  font-size: 14px;
  flex-grow: 1;
  margin-bottom: 16px;
`;

const TeamDate = styled.span`
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

const BreadcrumbLink = styled.span`
  cursor: pointer;
  color: #4fa3ff;

  &:hover {
    text-decoration: underline;
  }
`;

const TeamSelectionPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const teamService = new TeamService();
  const projectService = new ProjectService();

  useEffect(() => {
    if (!projectId) {
      navigate("/projects");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch project details
        const projectData = await projectService.getById(projectId);
        setProject(projectData);

        // Fetch teams for this project
        const teamsData = await teamService.getByProject(projectId);
        setTeams(teamsData);

        setError(null);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(
          "Veriler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId, navigate]);

  const handleTeamClick = (teamId: string) => {
    // Store selected team in local storage or context
    localStorage.setItem("selectedTeamId", teamId);
    localStorage.setItem("selectedProjectId", projectId || "");

    // Navigate to the boards page
    navigate("/boards");
  };

  const handleCreateTeam = async () => {
    setIsCreateModalOpen(false);

    if (projectId) {
      try {
        const teamsData = await teamService.getByProject(projectId);
        setTeams(teamsData);
      } catch (err) {
        console.error("Failed to refresh teams:", err);
      }
    }
  };

  const navigateToProjects = () => {
    navigate("/projects");
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
          <Spinner size={SpinnerSize.large} label="Veriler yükleniyor..." />
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
      <Breadcrumb>
        <BreadcrumbLink onClick={navigateToProjects}>Projeler</BreadcrumbLink>
        <Icon iconName="ChevronRight" style={{ fontSize: 12 }} />
        <span>{project?.name}</span>
      </Breadcrumb>

      <Header>
        <Text variant="xxLarge" styles={{ root: { color: "#ffffff" } }}>
          Takımlar
        </Text>
        <PrimaryButton
          text="Yeni Takım"
          iconProps={{ iconName: "Add" }}
          onClick={() => setIsCreateModalOpen(true)}
        />
      </Header>

      {teams.length === 0 ? (
        <EmptyState>
          <Text
            variant="large"
            styles={{ root: { color: "#ffffff", marginBottom: "16px" } }}
          >
            Bu projede henüz hiç takım yok
          </Text>
          <Text styles={{ root: { color: "#cccccc", marginBottom: "24px" } }}>
            Proje için çalışmaya başlamak için bir takım oluşturun.
          </Text>
          <PrimaryButton
            text="Yeni Takım Oluştur"
            iconProps={{ iconName: "Add" }}
            onClick={() => setIsCreateModalOpen(true)}
          />
        </EmptyState>
      ) : (
        <TeamsGrid>
          {teams.map((team) => (
            <TeamCard key={team.id} onClick={() => handleTeamClick(team.id)}>
              <TeamTitle>{team.name}</TeamTitle>
              <TeamDescription>
                {team.description || "Bu takım için açıklama bulunmamaktadır."}
              </TeamDescription>
              <TeamDate>
                Oluşturulma:{" "}
                {new Date(team.createdDate).toLocaleDateString("tr-TR")}
              </TeamDate>
            </TeamCard>
          ))}
        </TeamsGrid>
      )}

      {projectId && (
        <CreateTeamModal
          isOpen={isCreateModalOpen}
          onDismiss={() => setIsCreateModalOpen(false)}
          onCreated={handleCreateTeam}
          projectId={projectId}
        />
      )}
    </Container>
  );
};

export default TeamSelectionPage;
