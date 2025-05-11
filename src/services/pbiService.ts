import axios from "axios";
import type { ProductBacklogItem } from "../domain/models/productBacklogItem";
import type {
  PbiCreatedCommand,
  PbiUpdateCommand,
} from "../domain/commands/pbiCommands";

export class PbiService {
  private readonly baseUrl = "/api/pbi";

  // Command Operations
  async create(command: PbiCreatedCommand): Promise<void> {
    try {
      const response = await axios.post(this.baseUrl, command);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(command: PbiUpdateCommand): Promise<void> {
    try {
      const response = await axios.put(this.baseUrl, command);
      return response.data;
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

  // Query Operations
  async getAll(): Promise<ProductBacklogItem[]> {
    try {
      const response = await axios.get(this.baseUrl);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getById(id: string): Promise<ProductBacklogItem> {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getByUser(userId: string): Promise<ProductBacklogItem[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/user/${userId}`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getByTag(tagId: string): Promise<ProductBacklogItem[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/tag/${tagId}`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getByFeature(featureId: string): Promise<ProductBacklogItem[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/feature/${featureId}`);
      return response.data.data;
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
