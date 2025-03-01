"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface LanguageContextType {
  preferredLanguage: string;
  setPreferredLanguage: (language: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [preferredLanguage, setPreferredLanguage] = useState("cpp");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferred-language") || "cpp";
    setPreferredLanguage(savedLanguage);
  }, []);

  return (
    <LanguageContext.Provider value={{ preferredLanguage, setPreferredLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
