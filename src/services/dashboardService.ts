import axios from "axios";
import type { Dashboard } from "../domain/models/dashboard";
import type { ProductBacklogItem } from "../domain/models/productBacklogItem";
import { PbiState } from "../domain/models/productBacklogItem";
import type { Bug } from "../domain/models/bug";
import { BugStatus } from "../domain/models/bug";
import { API_GATEWAY_URL } from "../config/api";

class DashboardService {
  async getDashboardBySprint(sprintId: string): Promise<Dashboard> {
    console.log("Fetching dashboard for sprint:", sprintId);
    try {
      // First try to get real data from the API
      try {
        const response = await axios.get(
          `${API_GATEWAY_URL}/dashboard/sprint/${sprintId}`
        );
        return response.data;
      } catch (apiError) {
        console.log("API error, falling back to mock data:", apiError);
        // Fall back to mock data
        return this.getMockDashboardBySprint(sprintId);
      }
    } catch (error) {
      console.error("Error fetching dashboard by sprint:", error);
      throw error;
    }
  }

  async getDashboardByUser(userId: string): Promise<Dashboard> {
    try {
      // First try to get real data from the API
      try {
        const response = await axios.get(
          `${API_GATEWAY_URL}/dashboard/user/${userId}`
        );
        return response.data;
      } catch (apiError) {
        console.log("API error, falling back to mock data:", apiError);
        // Fall back to mock data
        return this.getMockDashboard();
      }
    } catch (error) {
      console.error("Error fetching dashboard by user:", error);
      throw error;
    }
  }

  async getRecentItems(teamId: string, limit: number = 5): Promise<Dashboard> {
    try {
      const response = await axios.get(
        `${API_GATEWAY_URL}/teams/${teamId}/dashboard/recent`,
        {
          params: { limit },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching recent items:", error);
      throw error;
    }
  }

  async getSummaryMetrics(teamId: string): Promise<{
    totalPBIs: number;
    completedPBIs: number;
    totalBugs: number;
    resolvedBugs: number;
  }> {
    try {
      const response = await axios.get(
        `${API_GATEWAY_URL}/api/teams/${teamId}/dashboard/metrics`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      throw error;
    }
  }

  // For demo or testing purposes - Get dashboard for a specific sprint
  getMockDashboardBySprint(sprintId: string): Dashboard {
    console.log("Generating mock dashboard for sprint:", sprintId);
    // Modify mock data based on the sprint id
    let itemCount = 0;
    let completedCount = 0;

    // Adjust mock data based on sprint ID
    if (sprintId === "sprint-1") {
      itemCount = 5;
      completedCount = 3;
    } else if (sprintId === "sprint-2") {
      itemCount = 8;
      completedCount = 2;
    }

    const pbis: ProductBacklogItem[] = [];

    // Generate PBIs for this sprint
    for (let i = 1; i <= itemCount; i++) {
      const isCompleted = i <= completedCount;

      // Determine state based on completion status and index
      let state: PbiState;
      if (isCompleted) {
        state = PbiState.RESOLVED;
      } else if (i % 2 === 0) {
        state = PbiState.ACTIVE;
      } else {
        state = PbiState.NEW;
      }

      pbis.push({
        id: `pbi-${sprintId}-${i}`,
        sprintId: sprintId,
        areaId: "area-1",
        featureId: `feature-${(i % 3) + 1}`,
        assignedUserId: `user-${(i % 4) + 1}`,
        description: `Task ${i} for ${sprintId}`,
        functionalDescription: `Implement feature ${i} for ${sprintId}`,
        technicalDescription: `Technical implementation for task ${i}`,
        priority: (i % 4) + 1,
        state: state,
        storyPoint: (i % 5) + 1,
        businessValue: (i % 8) + 1,
        dueDate: new Date(Date.now() + (i * 2 + 5) * 24 * 60 * 60 * 1000),
        startedDate: isCompleted || i % 2 === 0 ? new Date() : (null as any),
        completedDate: isCompleted ? new Date() : (null as any),
        tagIds: new Set<string>([
          `tag-${(i % 5) + 1}`,
          `priority-${(i % 3) + 1}`,
        ]),
        isDeleted: false,
      });
    }

    // Always generate 2 bugs per sprint
    const bugs: Bug[] = [
      {
        id: `bug-${sprintId}-1`,
        sprintId: sprintId,
        areaId: "area-1",
        featureId: "feature-1",
        assignedUserId: "user-3",
        description: `Bug 1 for ${sprintId}`,
        functionalDescription: "Feature not working as expected",
        technicalDescription: "Issue with data processing",
        priority: 1,
        status: BugStatus.ACTIVE,
        storyPoint: 2,
        businessValue: 7,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        startedDate: new Date(),
        completedDate: null as any,
        isNoBug: false,
        isDeleted: false,
        tagIds: new Set<string>(["bug", "high-priority"]),
      },
      {
        id: `bug-${sprintId}-2`,
        sprintId: sprintId,
        areaId: "area-1",
        featureId: "feature-2",
        assignedUserId: "user-2",
        description: `Bug 2 for ${sprintId}`,
        functionalDescription: "UI display issue",
        technicalDescription: "CSS layout problem",
        priority: 3,
        status: BugStatus.NEW,
        storyPoint: 1,
        businessValue: 4,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        startedDate: null as any,
        completedDate: null as any,
        isNoBug: false,
        isDeleted: false,
        tagIds: new Set<string>(["bug", "ui"]),
      },
    ];

    return {
      productBacklogItems: pbis,
      bugs: bugs,
    };
  }

  // Generic mock dashboard
  getMockDashboard(): Dashboard {
    const pbis: ProductBacklogItem[] = [
      {
        id: "1",
        sprintId: "sprint-1",
        areaId: "area-1",
        featureId: "feature-1",
        assignedUserId: "user-1",
        description: "Implement dashboard overview",
        functionalDescription: "Show sprint progress and team velocity",
        technicalDescription: "Use React and Chart.js",
        priority: 1,
        state: PbiState.ACTIVE,
        storyPoint: 5,
        businessValue: 8,
        dueDate: new Date("2023-12-25"),
        startedDate: new Date("2023-12-10"),
        completedDate: null as any,
        tagIds: new Set<string>(["ui", "dashboard"]),
        isDeleted: false,
      },
      {
        id: "2",
        sprintId: "sprint-1",
        areaId: "area-1",
        featureId: "feature-2",
        assignedUserId: "user-2",
        description: "Add filtering to dashboard",
        functionalDescription: "Allow users to filter by date range and status",
        technicalDescription:
          "Implement filter components and state management",
        priority: 2,
        state: PbiState.NEW,
        storyPoint: 3,
        businessValue: 5,
        dueDate: new Date("2023-12-30"),
        startedDate: null as any,
        completedDate: null as any,
        tagIds: new Set<string>(["dashboard", "filters"]),
        isDeleted: false,
      },
    ];

    const bugs: Bug[] = [
      {
        id: "101",
        sprintId: "sprint-1",
        areaId: "area-1",
        featureId: "feature-1",
        assignedUserId: "user-3",
        description: "Dashboard chart not rendering correctly",
        functionalDescription: "Velocity chart shows incorrect data points",
        technicalDescription: "Chart.js data mapping issue",
        priority: 1,
        status: BugStatus.ACTIVE,
        storyPoint: 2,
        businessValue: 7,
        dueDate: new Date("2023-12-20"),
        startedDate: new Date("2023-12-15"),
        completedDate: null as any,
        isNoBug: false,
        isDeleted: false,
        tagIds: new Set<string>(["dashboard", "bug", "chart"]),
      },
    ];

    return {
      productBacklogItems: pbis,
      bugs: bugs,
    };
  }
}

export default new DashboardService();
