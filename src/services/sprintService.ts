import axios from "axios";
import type { Sprint } from "../domain/models/sprint";
import { API_GATEWAY_URL } from "../config/api";

export class SprintService {
  private readonly baseUrl = `${API_GATEWAY_URL}/sprint`;

  async getById(id: string): Promise<Sprint> {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getByTeam(teamId: string): Promise<Sprint[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/team/${teamId}`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getByProject(projectId: string): Promise<Sprint[]> {
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

  async create(sprint: Omit<Sprint, "id">): Promise<Sprint> {
    try {
      const response = await axios.post(this.baseUrl, sprint);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(sprint: Sprint): Promise<Sprint> {
    try {
      const response = await axios.put(this.baseUrl, sprint);
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
