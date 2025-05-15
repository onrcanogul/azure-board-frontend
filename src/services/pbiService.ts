import axios from "axios";
import type { ProductBacklogItem } from "../domain/models/productBacklogItem";
import type {
  PbiCreatedCommand,
  PbiUpdateCommand,
  PbiUpdateStateCommand,
} from "../domain/commands/pbiCommands";
import { API_GATEWAY_URL } from "../config/api";
import { PbiState } from "../domain/models/productBacklogItem";

class PbiService {
  private readonly baseUrl = API_GATEWAY_URL + "/pbi";

  // Helper to process PBI items consistently
  private processPbiItem(item: any): ProductBacklogItem {
    return {
      ...item,
      state: item.state || PbiState.NEW,
      tagIds: new Set(item.tagIds || []),
      dueDate: item.dueDate ? new Date(item.dueDate) : null,
      startedDate: item.startedDate ? new Date(item.startedDate) : null,
      completedDate: item.completedDate ? new Date(item.completedDate) : null,
      isDeleted: item.deleted || item.isDeleted || false, // Handle both deleted and isDeleted fields
    };
  }

  // Command Operations
  async create(command: PbiCreatedCommand): Promise<void> {
    try {
      // Convert Set to Array for tagIds to avoid serialization issues
      const commandData = {
        ...command,
        tagIds: Array.isArray(command.tagIds)
          ? command.tagIds
          : Array.from(command.tagIds || []),
      };

      console.log("Sending PBI create command:", commandData);
      const response = await axios.post(this.baseUrl, commandData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(command: PbiUpdateCommand): Promise<void> {
    try {
      // Convert Set to Array for tagIds to avoid serialization issues
      const commandData = {
        ...command,
        tagIds: Array.isArray(command.tagIds)
          ? command.tagIds
          : Array.from(command.tagIds || []),
      };

      console.log("Sending PBI update command:", commandData);
      const response = await axios.put(this.baseUrl, commandData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateState(command: PbiUpdateStateCommand): Promise<void> {
    try {
      console.log("Sending PBI update state command:", command);
      const response = await axios.put(`${this.baseUrl}/state`, command);
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
      console.log("Raw API response in getAll:", response.data);

      // Process the items to ensure they have valid states
      const items = response.data.data || [];
      return items.map((item: any) => this.processPbiItem(item));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getById(id: string): Promise<ProductBacklogItem> {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`);
      return this.processPbiItem(response.data.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getByUser(userId: string): Promise<ProductBacklogItem[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/user/${userId}`);
      console.log("Raw API response in getByUser:", response.data);

      // Process the items to ensure they have valid states
      const items = response.data.data || [];
      return items.map((item: any) => this.processPbiItem(item));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getByTag(tagId: string): Promise<ProductBacklogItem[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/tag/${tagId}`);
      const items = response.data.data || [];
      return items.map((item: any) => this.processPbiItem(item));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getByFeature(featureId: string): Promise<ProductBacklogItem[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/feature/${featureId}`);
      const items = response.data.data || [];
      return items.map((item: any) => this.processPbiItem(item));
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

export default new PbiService();
