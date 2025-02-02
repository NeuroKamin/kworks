import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { TOrganisation } from "@workspace/database/types";
import { useDebounceCallback } from "@workspace/ui/hooks/use-debounce";

import { updateCurrentOrganization } from "@/actions/organisations";

interface OrganisationContextValue {
  currentOrganisation: TOrganisation;
  setOrganisation: (organisation: TOrganisation) => void;
  updateOrganisation: (organisation: Partial<TOrganisation>) => void;
}

const defaultOrganisation: TOrganisation = {
  id: "",
  name: "",
  description: "",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const OrganisationContext = createContext<OrganisationContextValue>({
  currentOrganisation: defaultOrganisation,
  setOrganisation: () => {},
  updateOrganisation: () => {},
});

interface OrganisationProviderProps {
  organisation: TOrganisation;
  children: ReactNode;
}

export const OrganisationProvider = ({
  organisation,
  children,
}: OrganisationProviderProps) => {
  const [currentOrganisation, setCurrentOrganisation] =
    useState<TOrganisation>(organisation);

  const debouncedUpdateServer = useDebounceCallback(
    (data: Partial<TOrganisation>) => {
      return updateCurrentOrganization(data);
    },
    500,
  );

  const setOrganisation = (organisation: TOrganisation) => {
    setCurrentOrganisation(organisation);
  };

  const updateOrganisation = useCallback(
    (organisation: Partial<TOrganisation>) => {
      setCurrentOrganisation((prev) => ({ ...prev, ...organisation }));
      debouncedUpdateServer(organisation);
    },
    [debouncedUpdateServer],
  );

  return React.createElement(
    OrganisationContext.Provider,
    { value: { currentOrganisation, setOrganisation, updateOrganisation } },
    children,
  );
};

export const useOrganisation = () => useContext(OrganisationContext);

// Хук для гидратации состояния организации
export function useHydrateOrganisationStore(organisation: TOrganisation) {
  const { setOrganisation } = useOrganisation();
  useEffect(() => {
    setOrganisation(organisation);
  }, [organisation, setOrganisation]);
}
