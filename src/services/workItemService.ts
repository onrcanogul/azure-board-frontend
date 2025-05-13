import { v4 as uuidv4 } from "uuid";
import type { WorkItem } from "../components/board/BoardColumn";
import { API_GATEWAY_URL } from "../config/api";
import {
  showSuccessToast,
  showErrorToast,
} from "../components/toast/ToastManager";

// Backend'e gönderilecek veri tipi
export interface WorkItemBackendPayload {
  id?: string; // Update işleminde gerekli
  sprintId: string;
  areaId: string;
  featureId: string;
  assignedUserId: string;
  description: string;
  functionalDescription: string;
  technicalDescription: string;
  priority: number;
  state: string;
  storyPoint: number;
  businessValue: number;
  dueDate: string;
  startedDate: string;
  completedDate: string | null;
  tagIds: string[];
  isDeleted: boolean;
  type: WorkItemType; // İş öğesinin tipi
}

export enum WorkItemType {
  PBI = "PBI",
  BUG = "BUG",
  FEATURE = "FEATURE",
  EPIC = "EPIC",
}

export class WorkItemService {
  private mockWorkItems: WorkItem[] = [
    {
      id: uuidv4(),
      sprintId: "",
      areaId: "",
      featureId: "",
      assignedUserId: "",
      description: "Create login screen and authentication logic",
      functionalDescription: "",
      technicalDescription: "",
      priority: 1,
      state: "To Do",
      storyPoint: 5,
      businessValue: 8,
      dueDate: new Date().toISOString(),
      startedDate: "",
      completedDate: "",
      isDeleted: false,
      tagIds: [],
    },
    {
      id: uuidv4(),
      sprintId: "",
      areaId: "",
      featureId: "",
      assignedUserId: "",
      description:
        "Navbar items overflow on mobile devices smaller than 375px width",
      functionalDescription: "",
      technicalDescription: "",
      priority: 2,
      state: "In Progress",
      storyPoint: 3,
      businessValue: 5,
      dueDate: new Date().toISOString(),
      startedDate: new Date().toISOString(),
      completedDate: "",
      isDeleted: false,
      tagIds: [],
    },
    {
      id: uuidv4(),
      sprintId: "",
      areaId: "",
      featureId: "",
      assignedUserId: "",
      description: "Implement authentication for API endpoints",
      functionalDescription:
        "Users should be authenticated before accessing protected resources",
      technicalDescription: "Use JWT tokens with refresh token pattern",
      priority: 3,
      state: "To Do",
      storyPoint: 8,
      businessValue: 10,
      dueDate: new Date().toISOString(),
      startedDate: "",
      completedDate: "",
      isDeleted: false,
      tagIds: [],
    },
    {
      id: uuidv4(),
      sprintId: "",
      areaId: "",
      featureId: "",
      assignedUserId: "",
      description: "Generate final report for sprint review",
      functionalDescription: "",
      technicalDescription: "",
      priority: 1,
      state: "Done",
      storyPoint: 2,
      businessValue: 3,
      dueDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      startedDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      completedDate: new Date().toISOString(),
      isDeleted: false,
      tagIds: [],
    },
  ];

  // For tracking listeners
  private listeners: (() => void)[] = [];

  // Add a listener function for changes
  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // Notify all listeners
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener());
  }

  // WorkItem'i backend payload'ına dönüştür
  private mapToBackendPayload(
    workItem: Partial<WorkItem>
  ): WorkItemBackendPayload {
    // WorkItem.type string olabilir, bunu WorkItemType'a dönüştürelim
    let type: WorkItemType = WorkItemType.PBI; // Varsayılan tip

    if (workItem.type) {
      if (typeof workItem.type === "string") {
        // String değer ise dönüştür
        switch (workItem.type) {
          case "PBI":
            type = WorkItemType.PBI;
            break;
          case "BUG":
            type = WorkItemType.BUG;
            break;
          case "FEATURE":
            type = WorkItemType.FEATURE;
            break;
          case "EPIC":
            type = WorkItemType.EPIC;
            break;
          default:
            type = WorkItemType.PBI;
        }
      } else {
        // Zaten WorkItemType ise doğrudan kullan
        type = workItem.type;
      }
    }

    return {
      id: workItem.id,
      sprintId: workItem.sprintId || "d290f1ee-6c54-4b01-90e6-d701748f0851",
      areaId: workItem.areaId || "1e52c4c1-7d20-4f62-a3d1-267dd2ab4e65",
      featureId: workItem.featureId || "d3f28c50-2fa1-4d45-bef7-df23b13db07b",
      assignedUserId:
        workItem.assignedUserId || "a8e4ed53-b671-4f21-a3ee-fc87f1299a11",
      description: workItem.description || "",
      functionalDescription: workItem.functionalDescription || "",
      technicalDescription: workItem.technicalDescription || "",
      priority: workItem.priority || 0,
      state: workItem.state || "TODO",
      storyPoint: workItem.storyPoint || 0,
      businessValue: workItem.businessValue || 0,
      dueDate: workItem.dueDate || "2025-06-01T17:00:00",
      startedDate: workItem.startedDate || "2025-05-10T09:00:00",
      completedDate: workItem.completedDate || null,
      tagIds: workItem.tagIds?.length
        ? workItem.tagIds
        : [
            "bb29c53b-3468-4a85-8e37-1d95762f8d77",
            "bc38c64b-4594-4e90-a4c8-81ad9fd62ee4",
          ],
      isDeleted: workItem.isDeleted || false,
      type: type,
    };
  }

  async getAll(): Promise<WorkItem[]> {
    try {
      // Tüm iş öğelerini almak için /pbi/all, /bug/all, /feature/all ve /epic/all endpoint'lerinden veri çek
      console.log("Fetching all work items from backend");
      const endpoints = ["/pbi/all", "/bug/all", "/feature/all", "/epic/all"];

      const allItems: WorkItem[] = [];

      for (const endpoint of endpoints) {
        try {
          console.log(`Fetching from ${API_GATEWAY_URL}${endpoint}`);
          const response = await fetch(`${API_GATEWAY_URL}${endpoint}`);

          if (!response.ok) {
            console.error(
              `Backend API error for ${endpoint}: ${response.status}`
            );
            continue; // Bu endpoint için hata varsa diğerine geç
          }

          const items = await response.json();
          console.log(`Received items from ${endpoint}:`, items);
          allItems.push(...items);
        } catch (endpointError) {
          console.error(`Error fetching from ${endpoint}:`, endpointError);
        }
      }

      // UI için mock verileri güncelle
      if (allItems.length > 0) {
        this.mockWorkItems = allItems.filter(
          (item: WorkItem) => !item.isDeleted
        );
      }
      return this.mockWorkItems;
    } catch (error) {
      console.error("Error fetching work items:", error);

      // Hata durumunda mevcut mock verileri döndür
      console.warn("Falling back to cached mock data");
      return [...this.mockWorkItems].filter((item) => !item.isDeleted);
    }
  }

  async getById(id: string, type?: string): Promise<WorkItem | undefined> {
    try {
      // İş öğesi tipine göre uygun API endpoint'i seç
      let endpoint = "/pbi";

      if (type) {
        if (type === WorkItemType.BUG) {
          endpoint = "/bug";
        } else if (type === WorkItemType.FEATURE) {
          endpoint = "/feature";
        } else if (type === WorkItemType.EPIC) {
          endpoint = "/epic";
        }
      }

      // Backend API çağrısı yap
      console.log(`Fetching work item ${id} from backend using ${endpoint}`);
      const response = await fetch(`${API_GATEWAY_URL}${endpoint}/${id}`);

      if (!response.ok) {
        console.error(`Backend API error: ${response.status}`);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const item = await response.json();
      console.log(`Received work item ${id} from backend:`, item);

      // UI için mock veriyi güncelle
      const index = this.mockWorkItems.findIndex((i) => i.id === id);
      if (index >= 0) {
        this.mockWorkItems[index] = item;
      } else {
        this.mockWorkItems.push(item);
      }

      return item;
    } catch (error) {
      console.error(`Error fetching work item ${id}:`, error);

      // Hata durumunda mevcut mock veriyi döndür
      console.warn("Falling back to cached mock data");
      return this.mockWorkItems.find(
        (item) => item.id === id && !item.isDeleted
      );
    }
  }

  async create(workItem: Omit<WorkItem, "id">): Promise<WorkItem> {
    try {
      // Backend API payload'ını hazırla
      const payload = this.mapToBackendPayload(workItem);
      console.log("Sending to backend (create):", payload);

      // İş öğesi tipine göre uygun API endpoint'i seç
      let endpoint = "/pbi"; // Varsayılan olarak PBI endpoint'ini kullan

      if (workItem.type === WorkItemType.BUG) {
        endpoint = "/bug";
      } else if (workItem.type === WorkItemType.FEATURE) {
        endpoint = "/feature";
      } else if (workItem.type === WorkItemType.EPIC) {
        endpoint = "/epic";
      }

      console.log(`Using endpoint: ${API_GATEWAY_URL}${endpoint}`);

      // Backend API çağrısı yap
      const response = await fetch(`${API_GATEWAY_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error(`Backend API error: ${response.status}`);
        const errorText = await response.text();
        const errorMessage = `API Hatası: ${response.status} ${
          errorText || "İşlem başarısız oldu."
        }`;
        showErrorToast(errorMessage);
        throw new Error(errorMessage);
      }

      // Başarılı yanıtı işle
      const serviceResponse = await response.json();
      console.log("Create response from backend:", serviceResponse);

      if (!serviceResponse.isSuccessful) {
        const errorMessage =
          serviceResponse.errors && serviceResponse.errors.length > 0
            ? serviceResponse.errors.join(", ")
            : "API yanıtı başarısız.";
        showErrorToast(errorMessage);
        throw new Error(errorMessage);
      }

      // Başarılı bildirimini göster
      const itemType = this.getItemTypeLabel(workItem.type);
      showSuccessToast(`Yeni ${itemType} başarıyla oluşturuldu.`);

      // Backend'den dönen ID ile yeni çalışma öğesini oluştur
      const newWorkItem: WorkItem = {
        ...workItem,
        id: serviceResponse.data?.id || uuidv4(),
        isDeleted: false,
      };

      // UI'da göstermek için mock verilere ekle
      this.mockWorkItems.push(newWorkItem);
      this.notifyListeners();
      return newWorkItem;
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Error creating work item:", error);

      if (!error.message?.includes("API Hatası")) {
        showErrorToast(
          `İş öğesi oluşturulurken bir hata oluştu: ${
            error.message || "Bilinmeyen hata"
          }`
        );
      }

      throw error;
    }
  }

  async update(workItem: WorkItem): Promise<WorkItem> {
    try {
      // Backend API payload'ını hazırla
      const payload = this.mapToBackendPayload(workItem);
      console.log("Sending to backend (update):", payload);

      // İş öğesi tipine göre uygun API endpoint'i seç
      let endpoint = "/pbi"; // Varsayılan olarak PBI endpoint'ini kullan

      if (workItem.type === WorkItemType.BUG) {
        endpoint = "/bug";
      } else if (workItem.type === WorkItemType.FEATURE) {
        endpoint = "/feature";
      } else if (workItem.type === WorkItemType.EPIC) {
        endpoint = "/epic";
      }

      console.log(
        `Using endpoint: ${API_GATEWAY_URL}${endpoint}/${workItem.id}`
      );

      // Backend API çağrısı yap
      const response = await fetch(
        `${API_GATEWAY_URL}${endpoint}/${workItem.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        console.error(`Backend API error: ${response.status}`);
        const errorText = await response.text();
        const errorMessage = `API Hatası: ${response.status} ${
          errorText || "İşlem başarısız oldu."
        }`;
        showErrorToast(errorMessage);
        throw new Error(errorMessage);
      }

      // Başarılı yanıtı işle
      const serviceResponse = await response.json();
      console.log("Update response from backend:", serviceResponse);

      if (!serviceResponse.isSuccessful) {
        const errorMessage =
          serviceResponse.errors && serviceResponse.errors.length > 0
            ? serviceResponse.errors.join(", ")
            : "API yanıtı başarısız.";
        showErrorToast(errorMessage);
        throw new Error(errorMessage);
      }

      // Başarılı bildirimini göster
      const itemType = this.getItemTypeLabel(workItem.type);
      showSuccessToast(`${itemType} başarıyla güncellendi.`);

      // UI'ı güncellemek için mock veriyi güncelle
      const index = this.mockWorkItems.findIndex(
        (item) => item.id === workItem.id
      );

      if (index === -1) {
        throw new Error("Work item not found");
      }

      const updatedWorkItem = {
        ...workItem,
      };

      this.mockWorkItems[index] = updatedWorkItem;
      this.notifyListeners();
      return updatedWorkItem;
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Error updating work item:", error);

      if (!error.message?.includes("API Hatası")) {
        showErrorToast(
          `İş öğesi güncellenirken bir hata oluştu: ${
            error.message || "Bilinmeyen hata"
          }`
        );
      }

      throw error;
    }
  }

  async delete(id: string, type?: string): Promise<void> {
    try {
      // İş öğesi tipine göre uygun API endpoint'i seç
      let endpoint = "/pbi";
      let itemType = "PBI";

      // Eğer tip belirtilmişse veya işlem yapılacak öğe bulunabilirse
      const itemToDelete = this.mockWorkItems.find((item) => item.id === id);

      if (type) {
        // Parametre olarak gelen tipe göre endpoint belirle
        if (type === WorkItemType.BUG) {
          endpoint = "/bug";
          itemType = "Bug";
        } else if (type === WorkItemType.FEATURE) {
          endpoint = "/feature";
          itemType = "Feature";
        } else if (type === WorkItemType.EPIC) {
          endpoint = "/epic";
          itemType = "Epic";
        }
      } else if (itemToDelete?.type) {
        // Eğer silinen öğenin tipi varsa ona göre endpoint belirle
        if (itemToDelete.type === WorkItemType.BUG) {
          endpoint = "/bug";
          itemType = "Bug";
        } else if (itemToDelete.type === WorkItemType.FEATURE) {
          endpoint = "/feature";
          itemType = "Feature";
        } else if (itemToDelete.type === WorkItemType.EPIC) {
          endpoint = "/epic";
          itemType = "Epic";
        }
      }

      // Backend API çağrısı yap
      console.log(
        `Sending delete request to backend for item ${id} using ${endpoint}`
      );
      const response = await fetch(`${API_GATEWAY_URL}${endpoint}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error(`Backend API error: ${response.status}`);
        const errorText = await response.text();
        const errorMessage = `API Hatası: ${response.status} ${
          errorText || "İşlem başarısız oldu."
        }`;
        showErrorToast(errorMessage);
        throw new Error(errorMessage);
      }

      // Başarılı yanıtı işle
      const serviceResponse = await response.json();
      console.log(`Delete response from backend:`, serviceResponse);

      if (!serviceResponse.isSuccessful) {
        const errorMessage =
          serviceResponse.errors && serviceResponse.errors.length > 0
            ? serviceResponse.errors.join(", ")
            : "API yanıtı başarısız.";
        showErrorToast(errorMessage);
        throw new Error(errorMessage);
      }

      console.log(`Delete successful for item ${id}`);
      showSuccessToast(`${itemType} başarıyla silindi.`);

      // UI'ı güncellemek için mock veriyi güncelle
      const index = this.mockWorkItems.findIndex((item) => item.id === id);

      if (index === -1) {
        console.warn("Work item not found in local data");
        return;
      }

      // Soft delete - mark as deleted rather than removing from array
      this.mockWorkItems[index] = {
        ...this.mockWorkItems[index],
        isDeleted: true,
      };

      this.notifyListeners();
    } catch (err: unknown) {
      const error = err as Error;
      console.error(`Error deleting work item ${id}:`, error);

      if (!error.message?.includes("API Hatası")) {
        showErrorToast(
          `İş öğesi silinirken bir hata oluştu: ${
            error.message || "Bilinmeyen hata"
          }`
        );
      }

      throw error;
    }
  }

  async getByState(state: string): Promise<WorkItem[]> {
    try {
      // Tüm iş öğesi tipleri için duruma göre veri çek
      console.log(`Fetching work items with state ${state} from backend`);
      const endpoints = [
        `/pbi/state/${state}`,
        `/bug/state/${state}`,
        `/feature/state/${state}`,
        `/epic/state/${state}`,
      ];

      const stateItems: WorkItem[] = [];

      for (const endpoint of endpoints) {
        try {
          console.log(`Fetching from ${API_GATEWAY_URL}${endpoint}`);
          const response = await fetch(`${API_GATEWAY_URL}${endpoint}`);

          if (!response.ok) {
            console.error(
              `Backend API error for ${endpoint}: ${response.status}`
            );
            continue; // Bu endpoint için hata varsa diğerine geç
          }

          const items = await response.json();
          console.log(`Received items from ${endpoint}:`, items);
          stateItems.push(...items);
        } catch (endpointError) {
          console.error(`Error fetching from ${endpoint}:`, endpointError);
        }
      }

      if (stateItems.length > 0) {
        return stateItems;
      }

      // Hata durumunda mevcut mock veriyi döndür
      console.warn(
        "No items returned from backend, falling back to cached mock data"
      );
      return this.mockWorkItems.filter(
        (item) => item.state === state && !item.isDeleted
      );
    } catch (error) {
      console.error(`Error fetching work items with state ${state}:`, error);

      // Hata durumunda mevcut mock veriyi döndür
      console.warn("Falling back to cached mock data");
      return this.mockWorkItems.filter(
        (item) => item.state === state && !item.isDeleted
      );
    }
  }

  async getByAssignedUser(userId: string): Promise<WorkItem[]> {
    try {
      // Tüm iş öğesi tipleri için kullanıcıya göre veri çek
      console.log(
        `Fetching work items assigned to user ${userId} from backend`
      );
      const endpoints = [
        `/pbi/user/${userId}`,
        `/bug/user/${userId}`,
        `/feature/user/${userId}`,
        `/epic/user/${userId}`,
      ];

      const userItems: WorkItem[] = [];

      for (const endpoint of endpoints) {
        try {
          console.log(`Fetching from ${API_GATEWAY_URL}${endpoint}`);
          const response = await fetch(`${API_GATEWAY_URL}${endpoint}`);

          if (!response.ok) {
            console.error(
              `Backend API error for ${endpoint}: ${response.status}`
            );
            continue; // Bu endpoint için hata varsa diğerine geç
          }

          const items = await response.json();
          console.log(`Received items from ${endpoint}:`, items);
          userItems.push(...items);
        } catch (endpointError) {
          console.error(`Error fetching from ${endpoint}:`, endpointError);
        }
      }

      if (userItems.length > 0) {
        return userItems;
      }

      // Hata durumunda mevcut mock veriyi döndür
      console.warn(
        "No items returned from backend, falling back to cached mock data"
      );
      return this.mockWorkItems.filter(
        (item) => item.assignedUserId === userId && !item.isDeleted
      );
    } catch (error) {
      console.error(
        `Error fetching work items assigned to user ${userId}:`,
        error
      );

      // Hata durumunda mevcut mock veriyi döndür
      console.warn("Falling back to cached mock data");
      return this.mockWorkItems.filter(
        (item) => item.assignedUserId === userId && !item.isDeleted
      );
    }
  }

  // İş öğesi tipine göre uygun etiket döndüren yardımcı fonksiyon
  private getItemTypeLabel(type?: WorkItemType | string): string {
    if (!type) return "PBI";

    switch (type) {
      case WorkItemType.BUG:
        return "Bug";
      case WorkItemType.FEATURE:
        return "Feature";
      case WorkItemType.EPIC:
        return "Epic";
      case WorkItemType.PBI:
      default:
        return "PBI";
    }
  }

  // PBI'lara özgü metodlar
  async getPbisByAssignedUser(userId: string): Promise<WorkItem[]> {
    try {
      // PBI'ları kullanıcı ID'sine göre getiren API endpoint'i
      console.log(`Fetching PBIs assigned to user ${userId} from backend`);
      const endpoint = `/pbi/user/${userId}`;

      const response = await fetch(`${API_GATEWAY_URL}${endpoint}`);

      if (!response.ok) {
        console.error(`Backend API error for ${endpoint}: ${response.status}`);
        const errorText = await response.text();
        console.error(`Error response body:`, errorText);
        const errorMessage = `API Hatası: ${response.status} ${
          errorText || "İşlem başarısız oldu."
        }`;
        showErrorToast(errorMessage);
        throw new Error(errorMessage);
      }

      // Debug: API yanıtını ham haliyle yazdır
      const responseText = await response.text();
      console.log(`Raw API response from ${endpoint}:`, responseText);

      let serviceResponse;
      try {
        // Metin yanıtı JSON'a dönüştür
        serviceResponse = JSON.parse(responseText);
        console.log(`Parsed response from ${endpoint}:`, serviceResponse);
      } catch (parseError) {
        console.error(`Failed to parse API response as JSON:`, parseError);
        showErrorToast(`API yanıtı geçerli JSON değil`);
        throw new Error(
          `Invalid JSON response: ${responseText.substring(0, 100)}...`
        );
      }

      // API yanıtı bir ServiceResponse objesi mi kontrol et
      if (serviceResponse === null || typeof serviceResponse !== "object") {
        console.error(`API response is not an object:`, serviceResponse);
        showErrorToast(`API yanıtı geçersiz format`);
        throw new Error(
          `Invalid response format: ${JSON.stringify(serviceResponse).substring(
            0,
            100
          )}...`
        );
      }

      // API yanıtında data alanı var mı kontrol et
      if (serviceResponse.data === undefined) {
        // Yanıt doğrudan veri dizisi olabilir
        if (Array.isArray(serviceResponse)) {
          console.log(`Response is directly an array, using it as data`);
          return serviceResponse;
        }

        console.warn(`API response has no data field:`, serviceResponse);

        // Yanıtın kendisi data olabilir
        if (!serviceResponse.isSuccessful && serviceResponse.errors) {
          const errorMessage =
            Array.isArray(serviceResponse.errors) &&
            serviceResponse.errors.length > 0
              ? serviceResponse.errors.join(", ")
              : "API yanıtı başarısız.";
          showErrorToast(errorMessage);
          throw new Error(errorMessage);
        }

        // Yanıt ServiceResponse olmayabilir, doğrudan veriyi döndür
        return [];
      }

      if (!serviceResponse.isSuccessful) {
        const errorMessage =
          serviceResponse.errors && serviceResponse.errors.length > 0
            ? serviceResponse.errors.join(", ")
            : "API yanıtı başarısız.";
        showErrorToast(errorMessage);
        throw new Error(errorMessage);
      }

      // Data alanı array mi kontrol et
      if (!Array.isArray(serviceResponse.data)) {
        console.warn(
          `API response data is not an array:`,
          serviceResponse.data
        );
        // Veri dizi değilse, boş dizi döndür
        return [];
      }

      return serviceResponse.data;
    } catch (err: unknown) {
      const error = err as Error;
      console.error(`Error fetching PBIs for user ${userId}:`, error);

      if (!error.message?.includes("API Hatası")) {
        showErrorToast(
          `Kullanıcıya atanmış PBI'lar yüklenirken bir hata oluştu: ${
            error.message || "Bilinmeyen hata"
          }`
        );
      }

      // Hata durumunda mevcut mock veriyi döndür
      console.warn("Falling back to cached mock data");
      return this.mockWorkItems.filter(
        (item) =>
          item.assignedUserId === userId &&
          item.type === WorkItemType.PBI &&
          !item.isDeleted
      );
    }
  }

  async getPbisByState(state: string): Promise<WorkItem[]> {
    try {
      // PBI'ları duruma göre getiren API endpoint'i
      console.log(`Fetching PBIs with state ${state} from backend`);
      const endpoint = `/pbi/state/${state}`;

      const response = await fetch(`${API_GATEWAY_URL}${endpoint}`);

      if (!response.ok) {
        console.error(`Backend API error for ${endpoint}: ${response.status}`);
        const errorText = await response.text();
        const errorMessage = `API Hatası: ${response.status} ${
          errorText || "İşlem başarısız oldu."
        }`;
        showErrorToast(errorMessage);
        throw new Error(errorMessage);
      }

      const serviceResponse = await response.json();
      console.log(`Received PBIs with state ${state}:`, serviceResponse);

      if (!serviceResponse.isSuccessful) {
        const errorMessage =
          serviceResponse.errors && serviceResponse.errors.length > 0
            ? serviceResponse.errors.join(", ")
            : "API yanıtı başarısız.";
        showErrorToast(errorMessage);
        throw new Error(errorMessage);
      }

      return serviceResponse.data || [];
    } catch (err: unknown) {
      const error = err as Error;
      console.error(`Error fetching PBIs with state ${state}:`, error);

      if (!error.message?.includes("API Hatası")) {
        showErrorToast(
          `${state} durumundaki PBI'lar yüklenirken bir hata oluştu: ${
            error.message || "Bilinmeyen hata"
          }`
        );
      }

      // Hata durumunda mevcut mock veriyi döndür
      console.warn("Falling back to cached mock data");
      return this.mockWorkItems.filter(
        (item) =>
          item.state === state &&
          item.type === WorkItemType.PBI &&
          !item.isDeleted
      );
    }
  }

  async getAllPbis(): Promise<WorkItem[]> {
    try {
      // Tüm PBI'ları getiren API endpoint'i
      console.log("Fetching all PBIs from backend");
      const endpoint = `/pbi`;

      const response = await fetch(`${API_GATEWAY_URL}${endpoint}`);

      if (!response.ok) {
        console.error(`Backend API error for ${endpoint}: ${response.status}`);
        const errorText = await response.text();
        console.error(`Error response body:`, errorText);
        const errorMessage = `API Hatası: ${response.status} ${
          errorText || "İşlem başarısız oldu."
        }`;
        showErrorToast(errorMessage);
        throw new Error(errorMessage);
      }

      // Debug: API yanıtını ham haliyle yazdır
      const responseText = await response.text();
      console.log(`Raw API response from ${endpoint}:`, responseText);

      let serviceResponse;
      try {
        // Metin yanıtı JSON'a dönüştür
        serviceResponse = JSON.parse(responseText);
        console.log(`Parsed response from ${endpoint}:`, serviceResponse);
      } catch (parseError) {
        console.error(`Failed to parse API response as JSON:`, parseError);
        showErrorToast(`API yanıtı geçerli JSON değil`);
        throw new Error(
          `Invalid JSON response: ${responseText.substring(0, 100)}...`
        );
      }

      // API yanıtı bir ServiceResponse objesi mi kontrol et
      if (serviceResponse === null || typeof serviceResponse !== "object") {
        console.error(`API response is not an object:`, serviceResponse);
        showErrorToast(`API yanıtı geçersiz format`);
        throw new Error(
          `Invalid response format: ${JSON.stringify(serviceResponse).substring(
            0,
            100
          )}...`
        );
      }

      // API yanıtında data alanı var mı kontrol et
      if (serviceResponse.data === undefined) {
        // Yanıt doğrudan veri dizisi olabilir
        if (Array.isArray(serviceResponse)) {
          console.log(`Response is directly an array, using it as data`);
          return serviceResponse;
        }

        console.warn(`API response has no data field:`, serviceResponse);

        // Yanıtın kendisi data olabilir
        if (!serviceResponse.isSuccessful && serviceResponse.errors) {
          const errorMessage =
            Array.isArray(serviceResponse.errors) &&
            serviceResponse.errors.length > 0
              ? serviceResponse.errors.join(", ")
              : "API yanıtı başarısız.";
          showErrorToast(errorMessage);
          throw new Error(errorMessage);
        }

        // Yanıt ServiceResponse olmayabilir, doğrudan veriyi döndür
        return [];
      }

      if (!serviceResponse.isSuccessful) {
        const errorMessage =
          serviceResponse.errors && serviceResponse.errors.length > 0
            ? serviceResponse.errors.join(", ")
            : "API yanıtı başarısız.";
        showErrorToast(errorMessage);
        throw new Error(errorMessage);
      }

      // Data alanı array mi kontrol et
      if (!Array.isArray(serviceResponse.data)) {
        console.warn(
          `API response data is not an array:`,
          serviceResponse.data
        );
        // Veri dizi değilse, boş dizi döndür
        return [];
      }

      return serviceResponse.data;
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Error fetching all PBIs:", error);

      if (!error.message?.includes("API Hatası")) {
        showErrorToast(
          `Tüm PBI'lar yüklenirken bir hata oluştu: ${
            error.message || "Bilinmeyen hata"
          }`
        );
      }

      // Hata durumunda mevcut mock veriyi döndür
      console.warn("Falling back to cached mock data");
      return this.mockWorkItems.filter(
        (item) => item.type === WorkItemType.PBI && !item.isDeleted
      );
    }
  }
}

// Create and export a singleton instance of the service
const workItemService = new WorkItemService();
export default workItemService;
