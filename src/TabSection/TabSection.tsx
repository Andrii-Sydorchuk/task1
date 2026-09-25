import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useTabs } from "../hooks/useTabs";
import { useTabOverflow } from "../hooks/useTabOverflow";
import { SortableTabItem } from "./components/SortableTabItem";
import { OverflowMenu } from "./components/OverflowMenu";
import styles from "./TabSection.module.css";

function TabSection() {
  const { tabs, togglePin, reorder, removeTab } = useTabs();
  const { containerRef, visibleTabs, overflowTabs, handleTabMeasure } =
    useTabOverflow(tabs);

  const [contextMenuTabPath, setContextMenuTabPath] = useState<string | null>(
    null,
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isOverflowOpen, setIsOverflowOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  useEffect(() => {
    function handleCloseMenus() {
      setContextMenuTabPath(null);
      setIsOverflowOpen(false);
    }

    window.addEventListener("click", handleCloseMenus);
    return () => {
      window.removeEventListener("click", handleCloseMenus);
    };
  }, []);

  function handleContextMenu(e: React.MouseEvent, path: string) {
    e.preventDefault();
    setContextMenuTabPath(path);
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const oldIndex = tabs.findIndex((t) => t.path === active.id);
    const newIndex = tabs.findIndex((t) => t.path === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    if (oldIndex === 0 || newIndex === 0) return;

    const activeTab = tabs[oldIndex];
    const overTab = tabs[newIndex];

    if ((activeTab.isPinned ?? false) !== (overTab.isPinned ?? false)) {
      return;
    }

    reorder(oldIndex, newIndex);
  }

  const activeTab = tabs.find((t) => t.path === activeId);
  const firstTab = tabs.find((t) => t.path === "/");

  return (
    <nav className={styles.tabs} ref={containerRef}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={visibleTabs.map((t) => t.path)}
          strategy={horizontalListSortingStrategy}
        >
          <ul className={styles.list}>
            {visibleTabs.map((tab) => (
              <SortableTabItem
                key={tab.path}
                tab={tab}
                contextMenuTabPath={contextMenuTabPath}
                onContextMenu={handleContextMenu}
                togglePin={togglePin}
                removeTab={removeTab}
                setContextMenuTabPath={setContextMenuTabPath}
                onMeasure={handleTabMeasure}
              />
            ))}

            <OverflowMenu
              overflowTabs={overflowTabs}
              firstTab={firstTab}
              isOpen={isOverflowOpen}
              onToggleOpen={(e) => {
                e.stopPropagation();
                setIsOverflowOpen((prev) => !prev);
              }}
              onCloseMenu={() => setIsOverflowOpen(false)}
              onRemoveTab={removeTab}
            />
          </ul>
        </SortableContext>

        <DragOverlay>
          {activeTab ? (
            <div className={styles.dragOverlayTab}>
              <activeTab.icon className={styles.overlayIcon} />
              {activeTab.label ? <span>{activeTab.label}</span> : null}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </nav>
  );
}

export default TabSection;
