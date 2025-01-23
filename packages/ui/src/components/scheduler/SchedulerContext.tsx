import React, { createContext, useContext, ReactNode, useState } from "react";

interface SchedulerContextProps {
  hoursFrom: number;
  hoursTo: number;
  columnWidth: number;
  setColumnWidth: (width: number) => void;
}

const SchedulerContext = createContext<SchedulerContextProps | undefined>(
  undefined,
);

export const SchedulerProvider: React.FC<{
  children: ReactNode;
  hoursFrom: number;
  hoursTo: number;
}> = ({ children, hoursFrom, hoursTo }) => {
  const [columnWidth, setColumnWidth] = useState(0);

  return (
    <SchedulerContext.Provider
      value={{ hoursFrom, hoursTo, columnWidth, setColumnWidth }}
    >
      {children}
    </SchedulerContext.Provider>
  );
};

export const useScheduler = () => {
  const context = useContext(SchedulerContext);
  if (!context) {
    throw new Error("useScheduler must be used within a SchedulerProvider");
  }
  return context;
};
