import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { Tab } from "../../tabs";
import { TabContextMenu } from "./TabContextMenu";
import styles from "../TabSection.module.css";

interface SortableTabItemProps {
  tab: Tab;
  contextMenuTabPath: string | null;
  onContextMenu: (e: React.MouseEvent, path: string) => void;
  togglePin: (path: string) => void;
  removeTab: (path: string) => void;
  setContextMenuTabPath: (path: string | null) => void;
  onMeasure: (path: string, width: number) => void;
}

export function SortableTabItem({
  tab,
  contextMenuTabPath,
  onContextMenu,
  togglePin,
  removeTab,
  setContextMenuTabPath,
  onMeasure,
}: SortableTabItemProps) {
  const isFirstTab = tab.path === "/";
  const [isHovered, setIsHovered] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: tab.path,
    disabled: isFirstTab,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.2 : 1,
  };

  const itemRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (itemRef.current) {
      const width = itemRef.current.getBoundingClientRect().width;
      if (width > 0) {
        onMeasure(tab.path, width);
      }
    }
  }, [tab.path, tab.label, tab.isPinned, onMeasure]);

  const Icon = tab.icon;
  const isMenuOpen = contextMenuTabPath === tab.path;

  return (
    <li
      ref={(node) => {
        setNodeRef(node);
        itemRef.current = node;
      }}
      style={style}
      {...attributes}
      {...listeners}
      className={styles.listItem}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        {!isFirstTab && tab.label ? <span>{tab.label}</span> : null}

        {!isFirstTab && (
          <button
            type="button"
            aria-label={`Close ${tab.label} tab`}
            className={styles.tabCloseButton}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              removeTab(tab.path);
            }}
          >
            <svg
              viewBox="0 0 12 12"
              className={styles.tabCloseIcon}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="2.5" y1="2.5" x2="9.5" y2="9.5" />
              <line x1="9.5" y1="2.5" x2="2.5" y2="9.5" />
            </svg>
          </button>
        )}
      </NavLink>

      {isFirstTab && isHovered && (
        <div className={styles.hoverTooltip}>
          <Icon className={styles.icon} />
          <span>{tab.label}</span>
        </div>
      )}

      {isMenuOpen && !isFirstTab && (
        <TabContextMenu
          isPinned={tab.isPinned ?? false}
          onTogglePin={(e) => {
            e.stopPropagation();
            togglePin(tab.path);
            setContextMenuTabPath(null);
          }}
        />
      )}
    </li>
  );
}
