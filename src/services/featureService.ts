import axios from "axios";
import type { Feature } from "../domain/models/feature";
import { API_GATEWAY_URL } from "../config/api";

export class FeatureService {
  private readonly baseUrl = `${API_GATEWAY_URL}/feature`;

  async getById(id: string): Promise<Feature> {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getByEpic(epicId: string): Promise<Feature[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/epic/${epicId}`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getByArea(areaId: string): Promise<Feature[]> {
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
    feature: Omit<Feature, "id" | "createdDate" | "updatedDate">
  ): Promise<Feature> {
    try {
      const response = await axios.post(this.baseUrl, feature);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async complete(id: string): Promise<void> {
    try {
      const response = await axios.post(`${this.baseUrl}/complete/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(feature: Feature): Promise<Feature> {
    try {
      const response = await axios.put(this.baseUrl, feature);
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
