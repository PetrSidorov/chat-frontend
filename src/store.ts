import { create } from "zustand";

type State = {
  activeConvoId: string;
};

type Actions = {
  updateActiveConvoId: (activeConvoId: string) => void;
};

const useActiveConvoIdStore = create<State & Actions>((set) => ({
  activeConvoId: "",
  updateActiveConvoId: (activeConvoId) => set({ activeConvoId }),
}));

export default useActiveConvoIdStore;
