import { v4 as uuidv4 } from "uuid";
import type { WorkItem } from "../components/board/BoardColumn";

export enum WorkItemType {
  PBI = "PBI",
  BUG = "BUG",
  FEATURE = "FEATURE",
  EPIC = "EPIC",
}

export class WorkItemService {
  private mockWorkItems: WorkItem[] = [
    {
      id: uuidv4(),
      sprintId: "",
      areaId: "",
      featureId: "",
      assignedUserId: "",
      description: "Create login screen and authentication logic",
      functionalDescription: "",
      technicalDescription: "",
      priority: 1,
      state: "To Do",
      storyPoint: 5,
      businessValue: 8,
      dueDate: new Date().toISOString(),
      startedDate: "",
      completedDate: "",
      isDeleted: false,
      tagIds: [],
    },
    {
      id: uuidv4(),
      sprintId: "",
      areaId: "",
      featureId: "",
      assignedUserId: "",
      description:
        "Navbar items overflow on mobile devices smaller than 375px width",
      functionalDescription: "",
      technicalDescription: "",
      priority: 2,
      state: "In Progress",
      storyPoint: 3,
      businessValue: 5,
      dueDate: new Date().toISOString(),
      startedDate: new Date().toISOString(),
      completedDate: "",
      isDeleted: false,
      tagIds: [],
    },
    {
      id: uuidv4(),
      sprintId: "",
      areaId: "",
      featureId: "",
      assignedUserId: "",
      description: "Implement authentication for API endpoints",
      functionalDescription:
        "Users should be authenticated before accessing protected resources",
      technicalDescription: "Use JWT tokens with refresh token pattern",
      priority: 3,
      state: "To Do",
      storyPoint: 8,
      businessValue: 10,
      dueDate: new Date().toISOString(),
      startedDate: "",
      completedDate: "",
      isDeleted: false,
      tagIds: [],
    },
    {
      id: uuidv4(),
      sprintId: "",
      areaId: "",
      featureId: "",
      assignedUserId: "",
      description: "Generate final report for sprint review",
      functionalDescription: "",
      technicalDescription: "",
      priority: 1,
      state: "Done",
      storyPoint: 2,
      businessValue: 3,
      dueDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      startedDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      completedDate: new Date().toISOString(),
      isDeleted: false,
      tagIds: [],
    },
  ];

  // For tracking listeners
  private listeners: (() => void)[] = [];

  // Add a listener function for changes
  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // Notify all listeners
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener());
  }

  async getAll(): Promise<WorkItem[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...this.mockWorkItems].filter((item) => !item.isDeleted);
  }

  async getById(id: string): Promise<WorkItem | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return this.mockWorkItems.find((item) => item.id === id && !item.isDeleted);
  }

  async create(workItem: Omit<WorkItem, "id">): Promise<WorkItem> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newWorkItem: WorkItem = {
      ...workItem,
      id: uuidv4(),
      isDeleted: false,
    };

    this.mockWorkItems.push(newWorkItem);
    this.notifyListeners();
    return newWorkItem;
  }

  async update(workItem: WorkItem): Promise<WorkItem> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = this.mockWorkItems.findIndex(
      (item) => item.id === workItem.id
    );

    if (index === -1) {
      throw new Error("Work item not found");
    }

    const updatedWorkItem = {
      ...workItem,
    };

    this.mockWorkItems[index] = updatedWorkItem;
    this.notifyListeners();
    return updatedWorkItem;
  }

  async delete(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = this.mockWorkItems.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error("Work item not found");
    }

    // Soft delete - mark as deleted rather than removing from array
    this.mockWorkItems[index] = {
      ...this.mockWorkItems[index],
      isDeleted: true,
    };

    this.notifyListeners();
  }

  async getByState(state: string): Promise<WorkItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return this.mockWorkItems.filter(
      (item) => item.state === state && !item.isDeleted
    );
  }

  async getByAssignedUser(userId: string): Promise<WorkItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return this.mockWorkItems.filter(
      (item) => item.assignedUserId === userId && !item.isDeleted
    );
  }
}

// Create and export a singleton instance of the service
const workItemService = new WorkItemService();
export default workItemService;
