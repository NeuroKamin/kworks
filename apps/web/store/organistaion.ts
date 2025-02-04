import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { TOrganization } from "@workspace/database/types";
import { useDebounceCallback } from "@workspace/ui/hooks/use-debounce";

import { updateCurrentOrganization } from "@/actions/organizations";

interface OrganizationContextValue {
  currentOrganization: TOrganization;
  setOrganization: (Organization: TOrganization) => void;
  updateOrganization: (Organization: Partial<TOrganization>) => void;
}

const defaultOrganization: TOrganization = {
  id: "",
  name: "",
  description: "",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const OrganizationContext = createContext<OrganizationContextValue>({
  currentOrganization: defaultOrganization,
  setOrganization: () => {},
  updateOrganization: () => {},
});

interface OrganizationProviderProps {
  Organization: TOrganization;
  children: ReactNode;
}

export const OrganizationProvider = ({
  Organization,
  children,
}: OrganizationProviderProps) => {
  const [currentOrganization, setCurrentOrganization] =
    useState<TOrganization>(Organization);

  const debouncedUpdateServer = useDebounceCallback(
    (data: Partial<TOrganization>) => {
      return updateCurrentOrganization(data);
    },
    500,
  );

  const setOrganization = (Organization: TOrganization) => {
    setCurrentOrganization(Organization);
  };

  const updateOrganization = useCallback(
    (Organization: Partial<TOrganization>) => {
      setCurrentOrganization((prev) => ({ ...prev, ...Organization }));
      debouncedUpdateServer(Organization);
    },
    [debouncedUpdateServer],
  );

  return React.createElement(
    OrganizationContext.Provider,
    { value: { currentOrganization, setOrganization, updateOrganization } },
    children,
  );
};

export const useOrganization = () => useContext(OrganizationContext);

// Хук для гидратации состояния организации
export function useHydrateOrganizationStore(Organization: TOrganization) {
  const { setOrganization } = useOrganization();
  useEffect(() => {
    setOrganization(Organization);
  }, [Organization, setOrganization]);
}
