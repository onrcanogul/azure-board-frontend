import axios from "axios";
import type { Team } from "../domain/models/team";
import { API_GATEWAY_URL } from "../config/api";

export class TeamService {
  private readonly baseUrl = `${API_GATEWAY_URL}/team`;

  async getAll(): Promise<Team[]> {
    try {
      const response = await axios.get(this.baseUrl);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getByProject(projectId: string): Promise<Team[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/project/${projectId}`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async isExist(id: string): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/exist/${id}`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(
    team: Omit<Team, "id" | "createdDate" | "updatedDate">
  ): Promise<Team> {
    try {
      const response = await axios.post(this.baseUrl, team);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(team: Team): Promise<Team> {
    try {
      const response = await axios.put(this.baseUrl, team);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const response = await axios.delete(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Entity not found");
      }
      throw new Error(error.response?.data?.message || "An error occurred");
    }
    throw error;
  }
}
