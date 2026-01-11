import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
}));

export default useAuthStore;
