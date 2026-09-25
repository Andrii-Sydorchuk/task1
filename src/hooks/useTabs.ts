import { useState, useEffect } from "react";
import { TABS, type Tab } from "../tabs";

function sortTabsByPin(a: Tab, b: Tab): -1 | 0 | 1 {
  if (a.path === "/") return -1;
  if (b.path === "/") return 1;

  if (a.isPinned && !b.isPinned) return -1;
  if (!a.isPinned && b.isPinned) return 1;

  return 0;
}

function loadTabs(): Tab[] {
  try {
    const rawStoredTabs = localStorage.getItem("tabs");
    if (!rawStoredTabs) return TABS.slice().sort(sortTabsByPin);

    const parsedStoredTabs: { path: string; isPinned?: boolean }[] =
      JSON.parse(rawStoredTabs);
    const predefinedTabs = new Map(TABS.map((TAB) => [TAB.path, TAB]));
    const restoredTabs: Tab[] = [];

    parsedStoredTabs.forEach((parsedTab) => {
      const predefinedTab = predefinedTabs.get(parsedTab.path);
      if (predefinedTab) {
        restoredTabs.push({
          ...predefinedTab,
          isPinned:
            predefinedTab.path === "/" ? true : (parsedTab.isPinned ?? false),
        });
        predefinedTabs.delete(parsedTab.path);
      }
    });

    predefinedTabs.forEach((predefinedTab) => restoredTabs.push(predefinedTab));

    return restoredTabs.length > 0
      ? restoredTabs.sort(sortTabsByPin)
      : TABS.slice().sort(sortTabsByPin);
  } catch {
    return TABS.slice().sort(sortTabsByPin);
  }
}

export function useTabs() {
  const [tabs, setTabs] = useState(loadTabs);

  useEffect(() => {
    const updatedTabs = tabs.map((tab) => {
      return {
        path: tab.path,
        isPinned: tab.path === "/" ? true : (tab.isPinned ?? false),
      };
    });

    localStorage.setItem("tabs", JSON.stringify(updatedTabs));
  }, [tabs]);

  function togglePin(path: string) {
    if (path === "/") return;

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

  function reorder(startIndex: number, endIndex: number) {
    if (startIndex === endIndex) return;

    setTabs((prevTabs) => {
      const targetTab = prevTabs[startIndex];
      if (!targetTab) return prevTabs;
      const newTabs = prevTabs
        .toSpliced(startIndex, 1)
        .toSpliced(endIndex, 0, targetTab);
      return newTabs.sort(sortTabsByPin);
    });
  }

  function removeTab(path: string) {
    if (path === "/") return;
    setTabs((prevTabs) => prevTabs.filter((tab) => tab.path !== path));
  }

  return { tabs, togglePin, reorder, removeTab };
}
