import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { Tab } from "../tabs";

export function useTabOverflow(tabs: Tab[]) {
  const [visibleCount, setVisibleCount] = useState<number>(tabs.length);
  const containerRef = useRef<HTMLElement | null>(null);
  const tabWidthsRef = useRef<Map<string, number>>(new Map());

  const updateOverflow = useCallback(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    if (containerWidth <= 0) return;

    let currentWidth = 0;
    let count = 0;
    const MORE_BUTTON_WIDTH = 54;

    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      const fallbackWidth = i === 0 ? 60 : tab.label ? 130 : 60;
      const width = tabWidthsRef.current.get(tab.path) || fallbackWidth;
      const isLastItem = i === tabs.length - 1;
      const reservedSpace = isLastItem ? 0 : MORE_BUTTON_WIDTH;

      if (currentWidth + width + reservedSpace <= containerWidth) {
        currentWidth += width;
        count++;
      } else {
        break;
      }
    }

    setVisibleCount(count);
  }, [tabs]);

  const handleTabMeasure = useCallback(
    (path: string, width: number) => {
      tabWidthsRef.current.set(path, width);
      updateOverflow();
    },
    [updateOverflow],
  );

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(() => {
      updateOverflow();
    });

    observer.observe(containerRef.current);
    updateOverflow();

    return () => observer.disconnect();
  }, [updateOverflow]);

  const visibleTabs = tabs.slice(0, visibleCount);
  const overflowTabs = tabs.slice(visibleCount);

  return {
    containerRef,
    visibleTabs,
    overflowTabs,
    handleTabMeasure,
  };
}
