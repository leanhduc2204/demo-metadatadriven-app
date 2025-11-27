import { create } from "zustand";
import { FilterCondition } from "@/types/common";

interface FilterState {
  filters: FilterCondition[];
  addFilter: (filter: FilterCondition) => void;
  updateFilter: (id: string, filter: Partial<FilterCondition>) => void;
  removeFilter: (id: string) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  filters: [],
  addFilter: (filter) =>
    set((state) => ({ filters: [...state.filters, filter] })),
  updateFilter: (id, updatedFilter) =>
    set((state) => ({
      filters: state.filters.map((f) =>
        f.id === id ? { ...f, ...updatedFilter } : f
      ),
    })),
  removeFilter: (id) =>
    set((state) => ({
      filters: state.filters.filter((f) => f.id !== id),
    })),
  clearFilters: () => set({ filters: [] }),
}));
