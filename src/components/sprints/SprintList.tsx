import { useEffect, useState, useMemo } from "react";
import {
  Stack,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
} from "@fluentui/react";
import styled from "@emotion/styled";
import SprintCard from "./SprintCard";
import { SprintState } from "../../domain/models/sprint";
import type { Sprint } from "../../domain/models/sprint";
import { SprintService } from "../../services/sprintService";
import { showErrorToast } from "../../components/toast/ToastManager";

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CenteredContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px;
`;

// Extend the Sprint type with UI-specific properties
interface EnhancedSprint extends Sprint {
  workItems: Array<{
    id: number;
    title: string;
    type: "Task" | "Bug" | "Feature" | "Epic";
    status: "To Do" | "In Progress" | "Done";
    points: number;
  }>;
  completedPoints: number;
  totalPoints: number;
  status: "active" | "future" | "completed"; // UI status
}

interface FilterState {
  searchText: string;
  statusFilter: SprintState | "all";
}

interface SprintListProps {
  filters?: FilterState;
}

const SprintList: React.FC<SprintListProps> = ({
  filters = { searchText: "", statusFilter: "all" },
}) => {
  const [sprints, setSprints] = useState<EnhancedSprint[]>([]);
  const [allSprints, setAllSprints] = useState<EnhancedSprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sprintService = new SprintService();

  useEffect(() => {
    const fetchSprints = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get the selected team ID from localStorage
        const teamId = localStorage.getItem("selectedTeamId");

        if (!teamId) {
          const errorMsg = "Takım seçilmedi. Lütfen bir takım seçin.";
          showErrorToast(errorMsg);
          throw new Error(errorMsg);
        }

        // Fetch sprints by team ID
        const backendSprints = await sprintService.getByTeam(teamId);
        console.log(`Fetched sprints for team ${teamId}:`, backendSprints);

        // Enhance the sprints with UI data
        const enhancedSprints = backendSprints.map((sprint) => {
          // Map backend state to UI status
          let status: "active" | "future" | "completed";
          switch (sprint.state) {
            case SprintState.ACTIVE:
              status = "active";
              break;
            case SprintState.INACTIVE:
              status = "future";
              break;
            default:
              status = "future";
          }

          return {
            ...sprint,
            startDate: new Date(sprint.startDate),
            endDate: new Date(sprint.endDate),
            workItems: [], // Initialize with empty array, will be fetched separately when needed
            completedPoints: 0,
            totalPoints: 0,
            status,
          };
        });

        setAllSprints(enhancedSprints);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch sprint data:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu";
        const errorMsg =
          "Sprintler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
        setError(errorMsg);
        showErrorToast(`Sprint verisi alınamadı: ${errorMessage}`);
        setLoading(false);
      }
    };

    fetchSprints();
  }, [filters]);

  // Apply filters to sprints
  useEffect(() => {
    if (allSprints.length === 0) return;

    let filteredSprints = [...allSprints];

    // Apply status filter
    if (filters.statusFilter !== "all") {
      filteredSprints = filteredSprints.filter(
        (sprint) => sprint.state === filters.statusFilter
      );
    }

    // Apply search text filter
    if (filters.searchText) {
      const searchTerm = filters.searchText.toLowerCase();
      filteredSprints = filteredSprints.filter(
        (sprint) =>
          sprint.name.toLowerCase().includes(searchTerm) ||
          (sprint.goal && sprint.goal.toLowerCase().includes(searchTerm))
      );
    }

    setSprints(filteredSprints);
  }, [allSprints, filters.statusFilter, filters.searchText]);

  if (loading) {
    return (
      <CenteredContent>
        <Spinner size={SpinnerSize.large} label="Sprintler yükleniyor..." />
      </CenteredContent>
    );
  }

  if (error) {
    return (
      <MessageBar messageBarType={MessageBarType.error}>{error}</MessageBar>
    );
  }

  if (sprints.length === 0) {
    return (
      <MessageBar messageBarType={MessageBarType.info}>
        Seçilen filtrelerle eşleşen sprint bulunamadı. Lütfen filtrelerinizi
        değiştirin veya yeni bir sprint oluşturun.
      </MessageBar>
    );
  }

  return (
    <ListContainer>
      {sprints.map((sprint) => (
        <SprintCard key={sprint.id} sprint={sprint} />
      ))}
    </ListContainer>
  );
};

export default SprintList;
