import { create } from 'zustand';

type ModalState = {
  isOpen: boolean;
};

type ModalActions = {
  openModal: () => void;
  closeModal: () => void;
};

type ModalStore = ModalState & ModalActions;

const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,

  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));

export default useModalStore;
