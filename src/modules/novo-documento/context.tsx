import { createContext, useContext } from "react";
import { useNovoDocumentoForm } from "./hooks/useNovoDocumentoForm";

type FormContext = ReturnType<typeof useNovoDocumentoForm>;

const NovoDocumentoContext = createContext<FormContext | null>(null);

export function NovoDocumentoProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: FormContext;
}) {
  return (
    <NovoDocumentoContext.Provider value={value}>
      {children}
    </NovoDocumentoContext.Provider>
  );
}

export function useNovoDocumentoCtx(): FormContext {
  const ctx = useContext(NovoDocumentoContext);
  if (!ctx) throw new Error("useNovoDocumentoCtx must be used inside NovoDocumentoProvider");
  return ctx;
}
