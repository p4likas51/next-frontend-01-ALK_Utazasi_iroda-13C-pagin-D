import { create } from "zustand";
import { persist } from "zustand/middleware";

type GlobalStore = {
  id: number | null;
  setId: (newId: number | null) => void;
};

export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set) => ({
      id: null,
      // A set függvény itt egy új állapotobjektumot ad vissza
      setId: (newId) =>
        set(() => ({
          // A visszatérési érték egy új objektum, ami az előző state-ből és a módosításokból áll
          id: newId,
        })),
    }),
    { name: "global-store" }, // kulcs-érték párok a böngészó local storage-ben tárolódnak, így csak CSR esetén használható
  ),
);
// persist használata miatt a store állapota megmarad a böngésző újraindításakor is
