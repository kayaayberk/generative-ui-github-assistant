import { create } from 'zustand'

interface IsLoadingStore {
  isLoadingState: boolean
  setIsLoading: (didComponentMount: boolean) => Promise<void>
}

export const isLoadingStore = create<IsLoadingStore>((set) => ({
  isLoadingState: false,
  setIsLoading: async (isLoadingState: boolean) => set({ isLoadingState }),
}))
