import React, { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import type { ProductBacklogItem } from "../domain/models/productBacklogItem";
import { PbiState } from "../domain/models/productBacklogItem";
import pbiService from "../services/pbiService";
import {
  showSuccessToast,
  showErrorToast,
} from "../components/toast/ToastManager";

interface PbiContextType {
  pbis: ProductBacklogItem[];
  loading: boolean;
  error: string | null;
  refreshPbis: () => Promise<void>;
  updatePbi: (updatedPbi: ProductBacklogItem) => Promise<void>;
  deletePbi: (id: string) => Promise<void>;
  createPbi: (
    newPbi: Omit<ProductBacklogItem, "id" | "isDeleted">
  ) => Promise<void>;
}

const PbiContext = createContext<PbiContextType | undefined>(undefined);

export const usePbiContext = () => {
  const context = useContext(PbiContext);
  if (context === undefined) {
    throw new Error("usePbiContext must be used within a PbiProvider");
  }
  return context;
};

interface PbiProviderProps {
  children: ReactNode;
}

export const PbiProvider: React.FC<PbiProviderProps> = ({ children }) => {
  const [pbis, setPbis] = useState<ProductBacklogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all PBIs
  const refreshPbis = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await pbiService.getAll();
      setPbis(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch PBIs";
      setError(errorMessage);
      showErrorToast(`PBI veri yüklemesi başarısız: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Load PBIs on component mount
  useEffect(() => {
    refreshPbis();
  }, []);

  // Update a PBI - this is called whenever a PBI is updated
  const updatePbi = async (updatedPbi: ProductBacklogItem) => {
    try {
      // First, update the UI state immediately
      setPbis((currentPbis) =>
        currentPbis.map((pbi) => (pbi.id === updatedPbi.id ? updatedPbi : pbi))
      );

      // Then, send the update to the backend
      await pbiService.update({
        id: updatedPbi.id,
        sprintId: updatedPbi.sprintId,
        areaId: updatedPbi.areaId,
        featureId: updatedPbi.featureId,
        assignedUserId: updatedPbi.assignedUserId,
        description: updatedPbi.description,
        functionalDescription: updatedPbi.functionalDescription,
        technicalDescription: updatedPbi.technicalDescription,
        priority: updatedPbi.priority,
        state: updatedPbi.state,
        storyPoint: updatedPbi.storyPoint,
        businessValue: updatedPbi.businessValue,
        dueDate: updatedPbi.dueDate,
        startedDate: updatedPbi.startedDate,
        completedDate: updatedPbi.completedDate,
        tagIds: updatedPbi.tagIds,
      });

      showSuccessToast("PBI başarıyla güncellendi");
    } catch (err) {
      // Revert the UI update on error
      refreshPbis();
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update PBI";
      showErrorToast(`PBI güncellenemedi: ${errorMessage}`);
      throw err;
    }
  };

  // Delete a PBI
  const deletePbi = async (id: string) => {
    try {
      // First, update the UI state to reflect deletion
      setPbis((currentPbis) => currentPbis.filter((pbi) => pbi.id !== id));

      // Then, send the delete request to the backend
      await pbiService.delete(id);

      showSuccessToast("PBI başarıyla silindi");
    } catch (err) {
      // Revert the UI update on error
      refreshPbis();
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete PBI";
      showErrorToast(`PBI silinemedi: ${errorMessage}`);
      throw err;
    }
  };

  // Create a new PBI
  const createPbi = async (
    newPbi: Omit<ProductBacklogItem, "id" | "isDeleted">
  ) => {
    try {
      // Send the create request to the backend
      await pbiService.create({
        sprintId: newPbi.sprintId,
        areaId: newPbi.areaId,
        featureId: newPbi.featureId,
        assignedUserId: newPbi.assignedUserId,
        description: newPbi.description,
        functionalDescription: newPbi.functionalDescription,
        technicalDescription: newPbi.technicalDescription,
        priority: newPbi.priority,
        state: newPbi.state,
        storyPoint: newPbi.storyPoint,
        businessValue: newPbi.businessValue,
        dueDate: newPbi.dueDate,
        startedDate: newPbi.startedDate,
        completedDate: newPbi.completedDate,
        tagIds: newPbi.tagIds,
      });

      // Refresh the list to get the new PBI with its ID
      await refreshPbis();

      showSuccessToast("PBI başarıyla oluşturuldu");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create PBI";
      showErrorToast(`PBI oluşturulamadı: ${errorMessage}`);
      throw err;
    }
  };

  const value = {
    pbis,
    loading,
    error,
    refreshPbis,
    updatePbi,
    deletePbi,
    createPbi,
  };

  return <PbiContext.Provider value={value}>{children}</PbiContext.Provider>;
};
