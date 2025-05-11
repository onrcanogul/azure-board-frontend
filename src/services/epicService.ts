import axios from "axios";
import type { Epic } from "../domain/models/epic";
import { API_GATEWAY_URL } from "../config/api";

export class EpicService {
  private readonly baseUrl = `${API_GATEWAY_URL}/epic`;

  async getByTeam(teamId: string): Promise<Epic[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/team/${teamId}`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getByArea(areaId: string): Promise<Epic[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/area/${areaId}`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async isExist(id: string): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/isExist/${id}`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(
    epic: Omit<Epic, "id" | "createdDate" | "updatedDate">
  ): Promise<Epic> {
    try {
      const response = await axios.post(this.baseUrl, epic);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(epic: Epic): Promise<Epic> {
    try {
      const response = await axios.put(this.baseUrl, epic);
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
