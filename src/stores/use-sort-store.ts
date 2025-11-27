import { create } from "zustand";
import { SortCondition } from "@/types/common";

interface SortState {
  sortConditions: SortCondition[];
  addSortCondition: (sortCondition: SortCondition) => void;
  updateSortCondition: (
    id: string,
    sortCondition: Partial<SortCondition>
  ) => void;
  removeSortCondition: (id: string) => void;
  clearSortConditions: () => void;
}

export const useSortStore = create<SortState>((set) => ({
  sortConditions: [],
  addSortCondition: (sortCondition) =>
    set((state) => ({
      sortConditions: [...state.sortConditions, sortCondition],
    })),
  updateSortCondition: (id, updatedSortCondition) =>
    set((state) => ({
      sortConditions: state.sortConditions.map((sc) =>
        sc.id === id ? { ...sc, ...updatedSortCondition } : sc
      ),
    })),
  removeSortCondition: (id) =>
    set((state) => ({
      sortConditions: state.sortConditions.filter((sc) => sc.id !== id),
    })),
  clearSortConditions: () => set({ sortConditions: [] }),
}));
