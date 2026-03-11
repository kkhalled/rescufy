import { useState } from "react";
import type { ActiveTab } from "../types/settings.types";

export default function useSettingsTabs() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("profile");

  return {
    activeTab,
    setActiveTab,
  };
}