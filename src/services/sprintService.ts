import axios from "axios";
import type { Sprint } from "../domain/models/sprint";
import { API_GATEWAY_URL } from "../config/api";

class SprintService {
  private readonly baseUrl = `${API_GATEWAY_URL}/sprint`;

  async getAll(): Promise<Sprint[]> {
    try {
      const response = await axios.get(this.baseUrl);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch sprints");
    }
  }

  async getById(id: string): Promise<Sprint> {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error, `Failed to fetch sprint with ID: ${id}`);
    }
  }

  async getByTeam(teamId: string): Promise<Sprint[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/team/${teamId}`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(
        error,
        `Failed to fetch sprints for team: ${teamId}`
      );
    }
  }

  async getByProject(projectId: string): Promise<Sprint[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/project/${projectId}`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(
        error,
        `Failed to fetch sprints for project: ${projectId}`
      );
    }
  }

  async isExist(id: string): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/exist/${id}`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error, `Failed to check if sprint exists: ${id}`);
    }
  }

  async create(sprint: Omit<Sprint, "id">): Promise<Sprint> {
    try {
      const response = await axios.post(this.baseUrl, sprint);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error, "Failed to create sprint");
    }
  }

  async update(sprint: Sprint): Promise<Sprint> {
    try {
      const response = await axios.put(this.baseUrl, sprint);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error, `Failed to update sprint: ${sprint.id}`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      throw this.handleError(error, `Failed to delete sprint: ${id}`);
    }
  }

  private handleError(
    error: any,
    defaultMessage: string = "An error occurred"
  ): Error {
    if (axios.isAxiosError(error)) {
      // Network error (no response)
      if (!error.response) {
        console.error("Network error:", error.message);
        return new Error(
          "Network error. Please check your connection and try again."
        );
      }

      // Server response with error status
      const status = error.response.status;
      const serverMessage = error.response?.data?.message;

      switch (status) {
        case 400:
          return new Error(
            serverMessage || "Bad request. Please check your inputs."
          );
        case 401:
          return new Error(
            serverMessage || "Unauthorized. Please log in again."
          );
        case 403:
          return new Error(
            serverMessage ||
              "Forbidden. You don't have permission for this action."
          );
        case 404:
          return new Error(serverMessage || "Resource not found.");
        case 500:
          return new Error(
            serverMessage || "Server error. Please try again later."
          );
        default:
          return new Error(serverMessage || defaultMessage);
      }
    }

    // For non-Axios errors
    console.error("Unknown error:", error);
    return new Error(defaultMessage);
  }
}

// Export as singleton instance
export default new SprintService();
export { SprintService };
