import { useState, useEffect } from "react";
import { TABS, type Tab } from "../tabs";

function loadTabs(): Tab[] {
  try {
    const rawStoredTabs = localStorage.getItem("tabs");
    if (!rawStoredTabs) return TABS;

    const parsedStoredTabs: { path: string; isPinned?: boolean }[] =
      JSON.parse(rawStoredTabs);
    const predefinedTabs = new Map(TABS.map((TAB) => [TAB.path, TAB]));
    const restoredTabs: Tab[] = [];

    parsedStoredTabs.forEach((parsedTab) => {
      const predefinedTab = predefinedTabs.get(parsedTab.path);
      if (predefinedTab) {
        restoredTabs.push({
          ...predefinedTab,
          isPinned: parsedTab.isPinned ?? false,
        });
        predefinedTabs.delete(parsedTab.path);
      }
    });

    predefinedTabs.forEach((predefinedTab) => restoredTabs.push(predefinedTab));

    return restoredTabs.length > 0 ? restoredTabs.sort(sortTabsByPin) : TABS;
  } catch {
    return TABS;
  }
}

function sortTabsByPin(a: Tab, b: Tab): -1 | 0 | 1 {
  if (a.isPinned === true && b.isPinned === false) {
    return -1;
  }
  if (a.isPinned === false && b.isPinned === true) {
    return 1;
  }

  return 0;
}

export function useTabs() {
  const [tabs, setTabs] = useState(loadTabs);

  useEffect(() => {
    const updatedTabs = tabs.map((tab) => {
      return {
        path: tab.path,
        isPinned: tab.isPinned ?? false,
      };
    });

    localStorage.setItem("tabs", JSON.stringify(updatedTabs));
  }, [tabs]);

  function togglePin(path: string) {
    const targetTab = tabs.find((tab) => tab.path === path);

    if (targetTab) {
      setTabs((prevTabs) =>
        prevTabs
          .map((prevTab) =>
            prevTab.path === path
              ? { ...prevTab, isPinned: !prevTab.isPinned }
              : prevTab,
          )
          .sort(sortTabsByPin),
      );
    }
  }

  function reorder(startIndex: number, endIndex: number) {
    if (startIndex === endIndex) return;

    setTabs((prevTabs) => {
      const targetTab = prevTabs[startIndex];
      if (!targetTab) return prevTabs;
      return prevTabs
        .toSpliced(startIndex, 1)
        .toSpliced(endIndex, 0, targetTab);
    });
  }

  return { tabs, togglePin, reorder };
}
