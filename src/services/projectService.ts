import axios from "axios";
import type { Project } from "../domain/models/project";
import { API_GATEWAY_URL } from "../config/api";

export class ProjectService {
  private readonly baseUrl = `${API_GATEWAY_URL}/project`;

  async getAll(): Promise<Project[]> {
    try {
      const response = await axios.get(this.baseUrl);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getById(id: string): Promise<Project> {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`);
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
    project: Omit<Project, "id" | "createdDate" | "updatedDate">
  ): Promise<Project> {
    try {
      const response = await axios.post(this.baseUrl, project);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(project: Project): Promise<Project> {
    try {
      const response = await axios.put(this.baseUrl, project);
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
