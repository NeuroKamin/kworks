import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { TSpace } from "@workspace/database/types";
import { useDebounceCallback } from "@workspace/ui/hooks/use-debounce";

import { updateCurrentSpace } from "@/actions/spaces";

interface SpaceContextValue {
  currentSpace: TSpace;
  setSpace: (Space: TSpace) => void;
  updateSpace: (Space: Partial<TSpace>) => void;
}

const defaultSpace: TSpace = {
  id: "",
  name: "",
  description: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  icon: "IconStack2",
};

const SpaceContext = createContext<SpaceContextValue>({
  currentSpace: defaultSpace,
  setSpace: () => {},
  updateSpace: () => {},
});

interface SpaceProviderProps {
  Space: TSpace;
  children: ReactNode;
}

export const SpaceProvider = ({ Space, children }: SpaceProviderProps) => {
  const [currentSpace, setCurrentSpace] = useState<TSpace>(Space);

  const debouncedUpdateServer = useDebounceCallback((data: Partial<TSpace>) => {
    return updateCurrentSpace(data);
  }, 500);

  const setSpace = (Space: TSpace) => {
    setCurrentSpace(Space);
  };

  const updateSpace = useCallback(
    (Space: Partial<TSpace>) => {
      setCurrentSpace((prev) => ({ ...prev, ...Space }));
      debouncedUpdateServer(Space);
    },
    [debouncedUpdateServer],
  );

  return React.createElement(
    SpaceContext.Provider,
    { value: { currentSpace, setSpace, updateSpace } },
    children,
  );
};

export const useSpace = () => useContext(SpaceContext);

// Хук для гидратации состояния организации
export function useHydrateSpaceStore(Space: TSpace) {
  const { setSpace } = useSpace();
  useEffect(() => {
    setSpace(Space);
  }, [Space, setSpace]);
}
