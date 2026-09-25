import { useEffect, useState } from "react";
import { NavLink } from "react-router";
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
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useTabs } from "../hooks/useTabs";
import type { Tab } from "../tabs";
import styles from "./TabSection.module.css";
import PinIcon from "../assets/icons/fi-rs-thumbtack.svg?react";

interface SortableTabItemProps {
  tab: Tab;
  contextMenuTabPath: string | null;
  onContextMenu: (e: React.MouseEvent, path: string) => void;
  togglePin: (path: string) => void;
  setContextMenuTabPath: (path: string | null) => void;
}

function SortableTabItem({
  tab,
  contextMenuTabPath,
  onContextMenu,
  togglePin,
  setContextMenuTabPath,
}: SortableTabItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tab.path });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.2 : 1,
  };

  const Icon = tab.icon;
  const isMenuOpen = contextMenuTabPath === tab.path;

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={styles.listItem}
      onContextMenu={(e) => onContextMenu(e, tab.path)}
    >
      <NavLink
        to={tab.path}
        className={({ isActive }) =>
          `${styles.listItemLink} ${isActive ? styles.activeLink : ""} ${
            tab.isPinned ? styles.pinnedLink : ""
          }`
        }
      >
        <Icon className={styles.icon} />
        {tab.label ? <span>{tab.label}</span> : null}
      </NavLink>

      {isMenuOpen && (
        <div className={styles.contextMenu}>
          <button
            type="button"
            className={styles.contextMenuItem}
            onClick={(e) => {
              e.stopPropagation();
              togglePin(tab.path);
              setContextMenuTabPath(null);
            }}
          >
            <PinIcon className={styles.contextMenuIcon} />
            <span>{tab.isPinned ? "Tab losen" : "Tab anpinnen"}</span>
          </button>
        </div>
      )}
    </li>
  );
}

function TabSection() {
  const { tabs, togglePin, reorder } = useTabs();
  const [contextMenuTabPath, setContextMenuTabPath] = useState<string | null>(
    null,
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  useEffect(() => {
    function handleCloseMenu() {
      setContextMenuTabPath(null);
    }

    if (contextMenuTabPath) {
      window.addEventListener("click", handleCloseMenu);
    }
    return () => {
      window.removeEventListener("click", handleCloseMenu);
    };
  }, [contextMenuTabPath]);

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

    const activeTab = tabs[oldIndex];
    const overTab = tabs[newIndex];

    if ((activeTab.isPinned ?? false) !== (overTab.isPinned ?? false)) {
      return;
    }

    reorder(oldIndex, newIndex);
  }

  const activeTab = tabs.find((t) => t.path === activeId);

  return (
    <nav className={styles.tabs}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={tabs.map((t) => t.path)}
          strategy={horizontalListSortingStrategy}
        >
          <ul className={styles.list}>
            {tabs.map((tab) => (
              <SortableTabItem
                key={tab.path}
                tab={tab}
                contextMenuTabPath={contextMenuTabPath}
                onContextMenu={handleContextMenu}
                togglePin={togglePin}
                setContextMenuTabPath={setContextMenuTabPath}
              />
            ))}
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
