"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getSiteSettings } from "../lib/db";
import { mockSiteSettings } from "../lib/mockData";

const SiteSettingsContext = createContext();

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(mockSiteSettings);

  const fetchSettings = async () => {
    try {
      const data = await getSiteSettings();
      if (data && Object.keys(data).length > 0) {
        setSettings(data);
      }
    } catch (e) {
      console.error("Failed to fetch site settings", e);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, refreshSettings: fetchSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    return {
      settings: mockSiteSettings,
      refreshSettings: () => {}
    };
  }
  return context;
}
