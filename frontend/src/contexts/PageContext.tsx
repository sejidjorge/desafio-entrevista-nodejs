"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface ControlMenuTypes {
  pageTitle: string;
  setPageTitle: Dispatch<SetStateAction<string>>;
}

interface ProviderTypes {
  children: ReactNode;
}

const ControlPageTitleContext = createContext<ControlMenuTypes>(
  {} as ControlMenuTypes
);

export function useControlPageTitle() {
  return useContext(ControlPageTitleContext);
}

export default function ControlPageTitleProvider({ children }: ProviderTypes) {
  const [pageTitle, setPageTitle] = useState("Dashboard");

  return (
    <ControlPageTitleContext.Provider value={{ pageTitle, setPageTitle }}>
      {children}
    </ControlPageTitleContext.Provider>
  );
}
