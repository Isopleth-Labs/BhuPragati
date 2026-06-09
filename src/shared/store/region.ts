import { create } from "zustand";
import { getAncestorChain, getRegion, type Region } from "@/data/regions";

export interface RegionStoreState {
  activeRegionId: string | null;
  historyStack: string[];
  boundaryLoaded: boolean;
  registryReady: boolean;
}

export interface RegionStoreActions {
  selectRegion: (regionId: string) => void;
  clearSelection: () => void;
  goBack: () => void;
  setHistory: (history: string[]) => void;
  setBoundaryLoaded: (loaded: boolean) => void;
  setRegistryReady: (ready: boolean) => void;
}

export type RegionStore = RegionStoreState & RegionStoreActions;

export const useRegionStore = create<RegionStore>((set, get) => ({
  activeRegionId: null,
  historyStack: [],
  boundaryLoaded: false,
  registryReady: false,

  selectRegion: (regionId: string) => {
    const region = getRegion(regionId);
    if (!region) return;

    set((state) => {
      const last = state.historyStack[state.historyStack.length - 1];
      const nextHistory = last === regionId
        ? state.historyStack
        : [...state.historyStack, regionId];

      return {
        activeRegionId: regionId,
        historyStack: nextHistory,
        boundaryLoaded: state.boundaryLoaded,
        registryReady: state.registryReady,
      };
    });
  },

  clearSelection: () => {
    set((state) => ({ ...state, activeRegionId: null }));
  },

  goBack: () => {
    const { historyStack } = get();
    if (historyStack.length === 0) return;

    const nextHistory = historyStack.slice(0, -1);
    const nextActive = nextHistory[nextHistory.length - 1] ?? null;

    set({
      activeRegionId: nextActive,
      historyStack: nextHistory,
      boundaryLoaded: get().boundaryLoaded,
      registryReady: get().registryReady,
    });
  },

  setHistory: (history: string[]) => {
    const normalized = [...history];
    const nextActive = normalized[normalized.length - 1] ?? null;

    set({
      activeRegionId: nextActive,
      historyStack: normalized,
      boundaryLoaded: get().boundaryLoaded,
      registryReady: get().registryReady,
    });
  },

  setBoundaryLoaded: (loaded: boolean) => {
    set((state) => ({ ...state, boundaryLoaded: loaded }));
  },

  setRegistryReady: (ready: boolean) => {
    set((state) => ({ ...state, registryReady: ready }));
  },
}));

export function getActiveRegion(): Region | undefined {
  const { activeRegionId } = useRegionStore.getState();
  if (!activeRegionId) return undefined;
  return getRegion(activeRegionId);
}

export function getActiveAncestors(): Region[] {
  const active = getActiveRegion();
  if (!active) return [];
  return getAncestorChain(active.id);
}
