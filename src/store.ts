import { create } from "zustand";

type StateActiveConvoId = {
  activeConvoId: string;
};

type ActionsActiveConvoId = {
  updateActiveConvoId: (activeConvoId: string) => void;
};

const useActiveConvoIdStore = create<StateActiveConvoId & ActionsActiveConvoId>(
  (set) => ({
    activeConvoId: "",
    updateActiveConvoId: (activeConvoId) => set({ activeConvoId }),
  })
);

type StateEditMessageMode = {
  editMessageMode: boolean;
};

type ActionsEditMessageMode = {
  updateEditMessageMode: (editMessageMode: boolean) => void;
};

const useEditMessageModeStore = create<
  StateEditMessageMode & ActionsEditMessageMode
>((set) => ({
  editMessageMode: false,
  updateEditMessageMode: (editMessageMode) => set({ editMessageMode }),
}));

export { useActiveConvoIdStore, useEditMessageModeStore };
