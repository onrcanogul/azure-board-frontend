import axios from "axios";
import type { Team } from "../domain/models/team";
import { API_GATEWAY_URL } from "../config/api";

// Helper function to generate GUID-like IDs
function generateGuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Mock veri with GUID-like IDs
const mockTeams: Team[] = [
  {
    id: "d4e5f6a7-b8c9-4654-10d4-2e1f0a9b8c7d",
    name: "Frontend Takımı",
    description: "React ve TypeScript ile frontend geliştirme",
    projectId: "a1b2c3d4-e5f6-4321-87a1-9b5c8f7e6d5e", // Azure DevOps Klonu
    createdDate: new Date("2023-10-20"),
    updatedDate: new Date("2023-10-20"),
    isDeleted: false,
  },
  {
    id: "e5f6a7b8-c9d0-5765-21e5-3f2a1b0c9d8e",
    name: "Backend Takımı",
    description: "Node.js, Express ve MongoDB ile API geliştirme",
    projectId: "a1b2c3d4-e5f6-4321-87a1-9b5c8f7e6d5e", // Azure DevOps Klonu
    createdDate: new Date("2023-10-21"),
    updatedDate: new Date("2023-10-21"),
    isDeleted: false,
  },
  {
    id: "f6a7b8c9-d0e1-6876-32f6-4a3b2c1d0e9f",
    name: "UX/UI Takımı",
    description: "Kullanıcı deneyimi ve arayüz tasarımı",
    projectId: "a1b2c3d4-e5f6-4321-87a1-9b5c8f7e6d5e", // Azure DevOps Klonu
    createdDate: new Date("2023-10-22"),
    updatedDate: new Date("2023-10-22"),
    isDeleted: false,
  },
  {
    id: "a7b8c9d0-e1f2-7987-43a7-5b4c3d2e1f0a",
    name: "Frontend Ekibi",
    description: "E-ticaret uygulaması için frontend geliştirme",
    projectId: "b2c3d4e5-f6a7-5432-98b2-0c9d8e7f6a5b", // E-Ticaret Sitesi
    createdDate: new Date("2023-09-10"),
    updatedDate: new Date("2023-09-15"),
    isDeleted: false,
  },
  {
    id: "b8c9d0e1-f2a3-8098-54b8-6c5d4e3f2a1b",
    name: "Backend Ekibi",
    description: "E-ticaret uygulaması için backend geliştirme",
    projectId: "b2c3d4e5-f6a7-5432-98b2-0c9d8e7f6a5b", // E-Ticaret Sitesi
    createdDate: new Date("2023-09-10"),
    updatedDate: new Date("2023-09-15"),
    isDeleted: false,
  },
  {
    id: "c9d0e1f2-a3b4-9109-65c9-7d6e5f4a3b2c",
    name: "Mobil Geliştirme",
    description: "React Native ile mobil uygulama geliştirme",
    projectId: "c3d4e5f6-a7b8-6543-09c3-1d0e9f8a7b6c", // Mobil Uygulama
    createdDate: new Date("2023-11-05"),
    updatedDate: new Date("2023-11-05"),
    isDeleted: false,
  },
];

export class TeamService {
  private readonly baseUrl = `${API_GATEWAY_URL}/team`;
  private teams: Team[] = [...mockTeams];

  async getAll(): Promise<Team[]> {
    try {
      // Mock veri dönüş
      console.log("Mock takım verileri dönüyor...");
      return Promise.resolve(this.teams.filter((t) => !t.isDeleted));

      // Gerçek API çağrısı
      // const response = await axios.get(this.baseUrl);
      // return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getById(id: string): Promise<Team> {
    try {
      // Mock veri dönüş
      const team = this.teams.find((t) => t.id === id && !t.isDeleted);
      if (!team) {
        throw new Error("Takım bulunamadı");
      }
      console.log(`Mock takım verisi dönüyor: ${team.name}`);
      return Promise.resolve(team);

      // Gerçek API çağrısı
      // const response = await axios.get(`${this.baseUrl}/${id}`);
      // return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getByProject(projectId: string): Promise<Team[]> {
    try {
      // Mock veri dönüş
      const projectTeams = this.teams.filter(
        (t) => t.projectId === projectId && !t.isDeleted
      );
      console.log(
        `Proje ID ${projectId} için ${projectTeams.length} takım dönüyor`
      );
      return Promise.resolve(projectTeams);

      // Gerçek API çağrısı
      // const response = await axios.get(`${this.baseUrl}/project/${projectId}`);
      // return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async isExist(id: string): Promise<boolean> {
    try {
      // Mock kontrol
      const exists = this.teams.some((t) => t.id === id && !t.isDeleted);
      return Promise.resolve(exists);

      // Gerçek API çağrısı
      // const response = await axios.get(`${this.baseUrl}/exist/${id}`);
      // return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(
    team: Omit<Team, "id" | "createdDate" | "updatedDate">
  ): Promise<Team> {
    try {
      // Mock veri oluşturma
      const newTeam: Team = {
        ...team,
        id: generateGuid(),
        createdDate: new Date(),
        updatedDate: new Date(),
      };

      this.teams.push(newTeam);
      console.log(`Yeni mock takım oluşturuldu: ${newTeam.name}`);
      return Promise.resolve(newTeam);

      // Gerçek API çağrısı
      // const response = await axios.post(this.baseUrl, team);
      // return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(team: Team): Promise<Team> {
    try {
      // Mock veri güncelleme
      const index = this.teams.findIndex((t) => t.id === team.id);
      if (index === -1) {
        throw new Error("Güncellenecek takım bulunamadı");
      }

      const updatedTeam = {
        ...team,
        updatedDate: new Date(),
      };

      this.teams[index] = updatedTeam;
      console.log(`Mock takım güncellendi: ${updatedTeam.name}`);
      return Promise.resolve(updatedTeam);

      // Gerçek API çağrısı
      // const response = await axios.put(this.baseUrl, team);
      // return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      // Mock veri silme (soft delete)
      const index = this.teams.findIndex((t) => t.id === id);
      if (index === -1) {
        throw new Error("Silinecek takım bulunamadı");
      }

      this.teams[index] = {
        ...this.teams[index],
        isDeleted: true,
        updatedDate: new Date(),
      };

      console.log(`Mock takım silindi: ID ${id}`);
      return Promise.resolve();

      // Gerçek API çağrısı
      // const response = await axios.delete(`${this.baseUrl}/${id}`);
      // return response.data;
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
