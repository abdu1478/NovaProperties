import { createContext, useContext, useState } from "react";

type CounterState = Record<string, number>;

interface CounterContextType {
  counters: CounterState;
  setCounter: (key: string, value: number) => void;
}

const CounterContext = createContext<CounterContextType | null>(null);

export const useCounterContext = () => {
  const ctx = useContext(CounterContext);
  if (!ctx)
    throw new Error("useCounterContext must be used within CounterProvider");
  return ctx;
};

export const CounterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [counters, setCounters] = useState<CounterState>({});

  const setCounter = (key: string, value: number) => {
    setCounters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <CounterContext.Provider value={{ counters, setCounter }}>
      {children}
    </CounterContext.Provider>
  );
};
