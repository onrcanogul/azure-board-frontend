import axios from "axios";
import type { Project } from "../domain/models/project";
import { API_GATEWAY_URL } from "../config/api";

// Mock veri with GUID-like IDs
const mockProjects: Project[] = [
  {
    id: "a1b2c3d4-e5f6-4321-87a1-9b5c8f7e6d5e",
    name: "Azure DevOps Klonu",
    description: "Azure DevOps benzeri bir proje yönetim uygulaması",
    createdDate: new Date("2023-10-15"),
    updatedDate: new Date("2023-10-15"),
    isDeleted: false,
  },
  {
    id: "b2c3d4e5-f6a7-5432-98b2-0c9d8e7f6a5b",
    name: "E-Ticaret Sitesi",
    description:
      "Online alışveriş yapılabilecek tam kapsamlı e-ticaret platformu",
    createdDate: new Date("2023-09-05"),
    updatedDate: new Date("2023-09-20"),
    isDeleted: false,
  },
  {
    id: "c3d4e5f6-a7b8-6543-09c3-1d0e9f8a7b6c",
    name: "Mobil Uygulama",
    description: "Fitness takibi için React Native tabanlı mobil uygulama",
    createdDate: new Date("2023-11-01"),
    updatedDate: new Date("2023-11-10"),
    isDeleted: false,
  },
];

// Helper function to generate GUID-like IDs for new projects
function generateGuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export class ProjectService {
  private readonly baseUrl = `${API_GATEWAY_URL}/project`;
  private projects: Project[] = [...mockProjects];

  async getAll(): Promise<Project[]> {
    try {
      // Mock veri dönüş
      console.log("Mock proje verileri dönüyor...");
      return Promise.resolve(this.projects.filter((p) => !p.isDeleted));

      // Gerçek API çağrısı
      // const response = await axios.get(this.baseUrl);
      // return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getById(id: string): Promise<Project> {
    try {
      // Mock veri dönüş
      const project = this.projects.find((p) => p.id === id && !p.isDeleted);
      if (!project) {
        throw new Error("Proje bulunamadı");
      }
      console.log(`Mock proje verisi dönüyor: ${project.name}`);
      return Promise.resolve(project);

      // Gerçek API çağrısı
      // const response = await axios.get(`${this.baseUrl}/${id}`);
      // return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async isExist(id: string): Promise<boolean> {
    try {
      // Mock kontrol
      const exists = this.projects.some((p) => p.id === id && !p.isDeleted);
      return Promise.resolve(exists);

      // Gerçek API çağrısı
      // const response = await axios.get(`${this.baseUrl}/exist/${id}`);
      // return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(
    project: Omit<Project, "id" | "createdDate" | "updatedDate">
  ): Promise<Project> {
    try {
      // Mock veri oluşturma
      const newProject: Project = {
        ...project,
        id: generateGuid(),
        createdDate: new Date(),
        updatedDate: new Date(),
      };

      this.projects.push(newProject);
      console.log(`Yeni mock proje oluşturuldu: ${newProject.name}`);
      return Promise.resolve(newProject);

      // Gerçek API çağrısı
      // const response = await axios.post(this.baseUrl, project);
      // return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(project: Project): Promise<Project> {
    try {
      // Mock veri güncelleme
      const index = this.projects.findIndex((p) => p.id === project.id);
      if (index === -1) {
        throw new Error("Güncellenecek proje bulunamadı");
      }

      const updatedProject = {
        ...project,
        updatedDate: new Date(),
      };

      this.projects[index] = updatedProject;
      console.log(`Mock proje güncellendi: ${updatedProject.name}`);
      return Promise.resolve(updatedProject);

      // Gerçek API çağrısı
      // const response = await axios.put(this.baseUrl, project);
      // return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      // Mock veri silme (soft delete)
      const index = this.projects.findIndex((p) => p.id === id);
      if (index === -1) {
        throw new Error("Silinecek proje bulunamadı");
      }

      this.projects[index] = {
        ...this.projects[index],
        isDeleted: true,
        updatedDate: new Date(),
      };

      console.log(`Mock proje silindi: ID ${id}`);
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
