import React, { createContext, useContext, ReactNode } from 'react';

interface SchedulerContextProps {
    hoursFrom: number;
    hoursTo: number;
}

const SchedulerContext = createContext<SchedulerContextProps | undefined>(undefined);

export const SchedulerProvider: React.FC<{ children: ReactNode, hoursFrom: number, hoursTo: number }> = ({ children, hoursFrom, hoursTo }) => {
    return (
        <SchedulerContext.Provider value={{ hoursFrom, hoursTo }}>
            {children}
        </SchedulerContext.Provider>
    );
};

export const useScheduler = () => {
    const context = useContext(SchedulerContext);
    if (!context) {
        throw new Error('useScheduler must be used within a SchedulerProvider');
    }
    return context;
}; 