import styled from "@emotion/styled";
import BoardHeader from "./board/BoardHeader";
import BoardFilterBar from "./board/BoardFilterBar";
import BoardColumn from "./board/BoardColumn";
import WorkItemModal from "./board/WorkItemModal";
import type { WorkItem } from "./board/BoardColumn";
import { useState, useEffect, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { v4 as uuidv4 } from "uuid";
import {
  showErrorToast,
  showSuccessToast,
} from "../components/toast/ToastManager";
import pbiService from "../services/pbiService";
import bugService from "../services/bugService";
import {
  type ProductBacklogItem,
  PbiState,
} from "../domain/models/productBacklogItem";
import { BugStatus, type Bug } from "../domain/models/bug";
import { WorkItemType } from "../services/workItemService";

// Type union to represent both item types
type BoardItem = ProductBacklogItem | (Bug & { type: string });

// ProductBacklogItem -> WorkItem dönüşümü için yardımcı fonksiyon
const pbiToWorkItem = (pbi: ProductBacklogItem): WorkItem => {
  return {
    id: pbi.id,
    sprintId: pbi.sprintId,
    areaId: pbi.areaId,
    featureId: pbi.featureId,
    assignedUserId: pbi.assignedUserId,
    description: pbi.description,
    functionalDescription: pbi.functionalDescription,
    technicalDescription: pbi.technicalDescription,
    priority: pbi.priority,
    state: pbi.state ? stateMapping[pbi.state] : "To Do", // Handle null state
    storyPoint: pbi.storyPoint,
    businessValue: pbi.businessValue,
    dueDate: pbi.dueDate ? pbi.dueDate.toISOString() : "",
    startedDate: pbi.startedDate ? pbi.startedDate.toISOString() : "",
    completedDate: pbi.completedDate ? pbi.completedDate.toISOString() : "",
    isDeleted: pbi.isDeleted || false,
    tagIds: Array.isArray(pbi.tagIds)
      ? pbi.tagIds
      : pbi.tagIds
      ? Array.from(pbi.tagIds)
      : [], // Handle both array and Set
    type: WorkItemType.PBI,
  };
};

// Bug -> WorkItem dönüşümü için yardımcı fonksiyon
const bugToWorkItem = (bug: Bug): WorkItem => {
  return {
    id: bug.id,
    sprintId: bug.sprintId,
    areaId: bug.areaId,
    featureId: bug.featureId,
    assignedUserId: bug.assignedUserId,
    description: bug.description,
    functionalDescription: bug.functionalDescription,
    technicalDescription: bug.technicalDescription,
    priority: bug.priority,
    state: bug.status ? bugStatusMapping[bug.status] : "To Do", // Map status to column state
    status: bug.status || BugStatus.NEW,
    storyPoint: bug.storyPoint,
    businessValue: bug.businessValue,
    dueDate: bug.dueDate ? bug.dueDate.toISOString() : "",
    startedDate: bug.startedDate ? bug.startedDate.toISOString() : "",
    completedDate: bug.completedDate ? bug.completedDate.toISOString() : "",
    isDeleted: bug.isDeleted || false,
    tagIds: Array.isArray(bug.tagIds)
      ? bug.tagIds
      : bug.tagIds
      ? Array.from(bug.tagIds)
      : [],
    type: WorkItemType.BUG,
  };
};

// WorkItem -> ProductBacklogItem dönüşümü için yardımcı fonksiyon
const workItemToPbi = (workItem: WorkItem): Partial<ProductBacklogItem> => {
  return {
    id: workItem.id,
    sprintId: workItem.sprintId,
    areaId: workItem.areaId,
    featureId: workItem.featureId,
    assignedUserId: workItem.assignedUserId,
    description: workItem.description,
    functionalDescription: workItem.functionalDescription,
    technicalDescription: workItem.technicalDescription,
    priority: workItem.priority,
    state:
      columnToStateMapping[
        workItem.state as keyof typeof columnToStateMapping
      ] || PbiState.NEW,
    storyPoint: workItem.storyPoint,
    businessValue: workItem.businessValue,
    dueDate: workItem.dueDate ? new Date(workItem.dueDate) : new Date(),
    startedDate: workItem.startedDate
      ? new Date(workItem.startedDate)
      : new Date(),
    completedDate: workItem.completedDate
      ? new Date(workItem.completedDate)
      : new Date(),
    isDeleted: workItem.isDeleted || false,
    tagIds: new Set(Array.isArray(workItem.tagIds) ? workItem.tagIds : []), // Handle null or undefined tagIds
  };
};

const BoardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: #181a17;
  min-height: 100%;
  width: 100%;
  box-sizing: border-box;
  flex: 1;
  padding-top: 60px; /* Make room for the mobile menu toggle */

  @media (min-width: 1024px) {
    padding-top: 0;
  }
`;

const BoardContainer = styled.div`
  display: grid;
  gap: 16px;
  padding: 12px;
  background: #181a17;
  width: 100%;
  box-sizing: border-box;
  overflow-x: auto;
  min-width: 0; /* Prevents flex items from overflowing */
  flex: 1;

  /* Mobile: Stack columns vertically */
  grid-template-columns: minmax(0, 1fr);

  /* Tablet: 2 columns */
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding: 24px;
    gap: 20px;
  }

  /* Desktop: 3 columns */
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    padding: 32px;
    gap: 24px;
  }
`;

// PbiState değerlerini kanban düzeni için eşleştirme
const stateMapping = {
  [PbiState.NEW]: "To Do",
  [PbiState.ACTIVE]: "In Progress",
  [PbiState.RESOLVED]: "Done",
  [PbiState.CLOSED]: "Done",
};

// BugStatus değerlerini kanban düzeni için eşleştirme
const bugStatusMapping = {
  [BugStatus.NEW]: "To Do",
  [BugStatus.ACTIVE]: "In Progress",
  [BugStatus.RESOLVED]: "Done",
  [BugStatus.CLOSED]: "Done",
};

// Kanban düzeninden PbiState'e eşleştirme
const columnToStateMapping = {
  "To Do": PbiState.NEW,
  "In Progress": PbiState.ACTIVE,
  Done: PbiState.RESOLVED,
};

// Kanban düzeninden BugStatus'a eşleştirme
const columnToBugStatusMapping = {
  "To Do": BugStatus.NEW,
  "In Progress": BugStatus.ACTIVE,
  Done: BugStatus.RESOLVED,
};

const columns = [
  { key: "To Do", label: "To Do" },
  { key: "In Progress", label: "In Progress" },
  { key: "Done", label: "Done" },
];

// Sabit kullanıcı ID
const CURRENT_USER_ID = "a8e4ed53-b671-4f21-a3ee-fc87f1299a11";

// State değişikliklerini takip eden observable sistem
let observers: (() => void)[] = [];

const notifyObservers = () => {
  observers.forEach((observer) => observer());
};

const Board = () => {
  const [pbis, setPbis] = useState<ProductBacklogItem[]>([]);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [selectedPbi, setSelectedPbi] = useState<ProductBacklogItem | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewType, setViewType] = useState<"all" | "my">("my"); // Görünüm tipi: all=tüm PBI'lar, my=kullanıcıya atanmış PBI'lar

  const loadPbis = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let loadedPbis: ProductBacklogItem[] = [];
      let loadedBugs: Bug[] = [];

      // Görünüm tipine göre farklı veri yükleme
      if (viewType === "my") {
        // Kullanıcıya atanmış iş öğelerini getir
        const pbiResponse = await pbiService.getByUser(CURRENT_USER_ID);
        console.log("Raw PBI API response:", pbiResponse);
        loadedPbis = pbiResponse;

        try {
          const bugResponse = await bugService.getByUser(CURRENT_USER_ID);
          console.log("Raw Bug API response:", bugResponse);
          loadedBugs = bugResponse;
        } catch (bugError) {
          console.error("Error loading bugs:", bugError);
        }
      } else {
        // Tüm iş öğelerini getir
        loadedPbis = await pbiService.getAll();

        try {
          loadedBugs = await bugService.getAll();
        } catch (bugError) {
          console.error("Error loading all bugs:", bugError);
        }
      }

      console.log("Loaded PBIs:", loadedPbis);
      console.log("Loaded Bugs:", loadedBugs);
      setPbis(loadedPbis);
      setBugs(loadedBugs);
    } catch (err) {
      console.error("Error loading items:", err);
      setError("İş öğeleri yüklenemedi. Lütfen sayfayı yenileyin.");
    } finally {
      setIsLoading(false);
    }
  }, [viewType]);

  // Observable sisteme abone ol
  useEffect(() => {
    loadPbis();

    // Observable pattern için subscribe
    const observerCallback = () => loadPbis();
    observers.push(observerCallback);

    return () => {
      // Component unmount olduğunda observer'ı kaldır
      observers = observers.filter((observer) => observer !== observerCallback);
    };
  }, [loadPbis]);

  const handleCardClick = (workItem: WorkItem) => {
    // WorkItem'ı PBI'a dönüştür
    const pbi = pbis.find((p) => p.id === workItem.id);
    if (pbi) {
      setSelectedPbi(pbi);
      setModalOpen(true);
      setIsNew(false);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedPbi(null);
    setIsNew(false);
  };

  const handleNewItem = (columnState: string) => {
    // Kanban sütununu PbiState'e dönüştür
    const pbiState =
      columnToStateMapping[columnState as keyof typeof columnToStateMapping] ||
      PbiState.NEW;

    // Yeni PBI oluştur
    const newPbi: Partial<ProductBacklogItem> = {
      id: uuidv4(),
      sprintId: "",
      areaId: "",
      featureId: "",
      assignedUserId: CURRENT_USER_ID,
      description: "Yeni PBI",
      functionalDescription: "",
      technicalDescription: "",
      priority: 0,
      state: pbiState,
      storyPoint: 0,
      businessValue: 0,
      dueDate: new Date(),
      startedDate: new Date(),
      completedDate: new Date(),
      tagIds: new Set<string>(),
      isDeleted: false,
    };

    setSelectedPbi(newPbi as ProductBacklogItem);
    setModalOpen(true);
    setIsNew(true);
  };

  const handleMoveCard = useCallback(
    async (id: string, targetColumnState: string, itemType?: string) => {
      try {
        // İş öğesi tipine göre işlem yap
        const isBug = itemType === WorkItemType.BUG;

        if (isBug) {
          // Bug için durum güncellemesi
          const targetBugStatus =
            columnToBugStatusMapping[
              targetColumnState as keyof typeof columnToBugStatusMapping
            ];

          // İlgili Bug'ı bul
          const bugToMove = bugs.find((item) => item.id === id);
          if (!bugToMove) {
            console.error(`Bug with id ${id} not found`);
            return;
          }

          // Eğer zaten o durumdaysa, işlem yapma
          if (bugStatusMapping[bugToMove.status] === targetColumnState) {
            console.log(`Bug is already in ${targetColumnState} state`);
            return;
          }

          // Optimistik UI güncellemesi için state'i güncelle
          setBugs((prevItems) =>
            prevItems.map((item) =>
              item.id === id ? { ...item, status: targetBugStatus } : item
            )
          );

          // Bug durumunu güncelle
          try {
            // Sadece durum güncelleme komutunu gönder
            const updateStateCommand = {
              id: id,
              status: targetBugStatus,
            };

            await bugService.updateState(updateStateCommand);
            showSuccessToast(
              `Bug durumu başarıyla "${targetColumnState}" olarak güncellendi`
            );
            console.log(`Bug ${id} moved to ${targetColumnState} successfully`);

            // Observable sistemi bilgilendir
            notifyObservers();
          } catch (updateError) {
            console.error(`Error updating Bug ${id}:`, updateError);
            showErrorToast(
              `Durum değiştirme işlemi başarısız oldu: ${
                (updateError as Error).message || "Bilinmeyen bir hata oluştu"
              }`
            );
            // Hata durumunda tekrar yükle
            loadPbis();
          }
        } else {
          // PBI için durum güncellemesi
          const targetPbiState =
            columnToStateMapping[
              targetColumnState as keyof typeof columnToStateMapping
            ];

          // İlgili PBI'ı bul
          const pbiToMove = pbis.find((item) => item.id === id);
          if (!pbiToMove) {
            console.error(`PBI with id ${id} not found`);
            return;
          }

          // Eğer zaten o durumdaysa, işlem yapma
          if (stateMapping[pbiToMove.state] === targetColumnState) {
            console.log(`PBI is already in ${targetColumnState} state`);
            return;
          }

          // Optimistik UI güncellemesi için state'i güncelle
          setPbis((prevItems) =>
            prevItems.map((item) =>
              item.id === id ? { ...item, state: targetPbiState } : item
            )
          );

          // PBI durumunu güncelle
          try {
            // Sadece durum güncelleme komutunu gönder
            const updateStateCommand = {
              id: id,
              state: targetPbiState,
            };

            await pbiService.updateState(updateStateCommand);
            showSuccessToast(
              `PBI durumu başarıyla "${targetColumnState}" olarak güncellendi`
            );
            console.log(`PBI ${id} moved to ${targetColumnState} successfully`);

            // Observable sistemi bilgilendir
            notifyObservers();
          } catch (updateError) {
            console.error(`Error updating PBI ${id}:`, updateError);
            showErrorToast(
              `Durum değiştirme işlemi başarısız oldu: ${
                (updateError as Error).message || "Bilinmeyen bir hata oluştu"
              }`
            );
            // Hata durumunda tekrar yükle
            loadPbis();
          }
        }
      } catch (error) {
        console.error(
          `Error moving item ${id} to ${targetColumnState}:`,
          error
        );
        setError("İş öğesi durumu değiştirilemedi. Lütfen tekrar deneyin.");
      }
    },
    [pbis, bugs]
  );

  const handleSavePbi = async (workItem: WorkItem) => {
    try {
      setError(null);

      // WorkItem'ı ProductBacklogItem'a dönüştür
      const pbiData = workItemToPbi(workItem);

      if (isNew) {
        // Yeni PBI oluştur
        await pbiService.create(pbiData as any);
        showSuccessToast("Yeni PBI başarıyla oluşturuldu");
      } else {
        // Mevcut PBI'ı güncelle
        await pbiService.update(pbiData as any);
        showSuccessToast("PBI başarıyla güncellendi");
      }

      // Observable sistemi bilgilendir
      notifyObservers();
    } catch (error) {
      console.error("Error saving PBI:", error);
      showErrorToast(`PBI kaydedilemedi: ${(error as Error).message}`);
      setError("PBI kaydedilemedi. Lütfen tekrar deneyin.");
      throw error; // Re-throw to be handled by the modal
    }
  };

  const toggleViewType = () => {
    setViewType((prev) => (prev === "all" ? "my" : "all"));
  };

  if (error) {
    return (
      <div style={{ color: "red", padding: "20px", textAlign: "center" }}>
        {error}
        <button
          onClick={loadPbis}
          style={{ marginLeft: "10px", padding: "5px 10px" }}
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  // PBI'ları ve Bug'ları WorkItem'a dönüştür ve kanban sütunlarına göre filtrele
  const getWorkItemsByColumn = (columnKey: string): WorkItem[] => {
    // PBI'ları filtrele ve dönüştür
    const pbiItems = pbis
      .filter((pbi) => !pbi.isDeleted)
      .filter((pbi) => {
        // If state is null, assign it to "To Do" column
        const mappedState = pbi.state ? stateMapping[pbi.state] : "To Do";
        return mappedState === columnKey;
      })
      .map(pbiToWorkItem);

    // Bug'ları filtrele ve dönüştür
    const bugItems = bugs
      .filter((bug) => !bug.isDeleted)
      .filter((bug) => {
        // If status is null, assign it to "To Do" column
        const mappedStatus = bug.status
          ? bugStatusMapping[bug.status]
          : "To Do";
        return mappedStatus === columnKey;
      })
      .map(bugToWorkItem);

    // Her iki tür öğeyi birleştir
    return [...pbiItems, ...bugItems];
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <BoardWrapper>
        <BoardHeader
          onCreateWorkItem={() => handleNewItem("To Do")}
          viewType={viewType}
          onToggleViewType={toggleViewType}
        />
        <BoardFilterBar />
        {isLoading ? (
          <div style={{ padding: "20px", textAlign: "center" }}>
            İş öğeleri yükleniyor...
          </div>
        ) : (
          <BoardContainer>
            {columns.map((column) => (
              <BoardColumn
                key={column.key}
                title={column.key}
                items={getWorkItemsByColumn(column.key)}
                onCardClick={handleCardClick}
                onAddItem={() => handleNewItem(column.key)}
                onMoveCard={handleMoveCard}
              />
            ))}
          </BoardContainer>
        )}
        {selectedPbi && (
          <WorkItemModal
            item={pbiToWorkItem(selectedPbi as ProductBacklogItem)}
            open={modalOpen}
            onClose={handleModalClose}
            isNew={isNew}
            onSave={handleSavePbi}
          />
        )}
      </BoardWrapper>
    </DndProvider>
  );
};

export default Board;
