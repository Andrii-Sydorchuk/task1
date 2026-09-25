import { NavLink, useLocation } from "react-router";
import type { Tab } from "../../tabs";
import CrossIcon from "../../assets/icons/cross.svg?react";
import styles from "../TabSection.module.css";

interface OverflowMenuProps {
  overflowTabs: Tab[];
  firstTab?: Tab;
  isOpen: boolean;
  onToggleOpen: (e: React.MouseEvent) => void;
  onCloseMenu: () => void;
  onRemoveTab: (path: string) => void;
}

export function OverflowMenu({
  overflowTabs,
  firstTab,
  isOpen,
  onToggleOpen,
  onCloseMenu,
  onRemoveTab,
}: OverflowMenuProps) {
  const location = useLocation();

  if (overflowTabs.length === 0) return null;

  const dropdownTabs =
    firstTab && !overflowTabs.some((t) => t.path === "/")
      ? [firstTab, ...overflowTabs]
      : overflowTabs;

  const isOverflowActive = overflowTabs.some((tab) =>
    tab.path === "/"
      ? location.pathname === "/"
      : location.pathname.includes(tab.path),
  );

  return (
    <li className={styles.moreItem}>
      <button
        type="button"
        aria-label="Toggle overflow tabs"
        className={`${styles.moreButton} ${
          isOverflowActive || isOpen ? styles.moreButtonActive : ""
        }`}
        onClick={onToggleOpen}
      >
        <svg
          className={styles.moreChevronIcon}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isOpen ? (
            <polyline points="3 10 8 5 13 10" />
          ) : (
            <polyline points="3 6 8 11 13 6" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className={styles.overflowMenu}>
          {dropdownTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive =
              tab.path === "/"
                ? location.pathname === "/"
                : location.pathname.includes(tab.path);
            const isPermanent = tab.path === "/";

            return (
              <div key={tab.path} className={styles.overflowMenuItemRow}>
                <NavLink
                  to={tab.path}
                  className={`${styles.overflowMenuItem} ${
                    isActive ? styles.overflowMenuItemActive : ""
                  }`}
                  onClick={onCloseMenu}
                >
                  <Icon className={styles.icon} />
                  <span>{tab.label}</span>
                </NavLink>

                {!isPermanent && (
                  <button
                    type="button"
                    aria-label={`Remove ${tab.label} tab`}
                    className={styles.closeTabButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveTab(tab.path);
                    }}
                  >
                    <CrossIcon className={styles.contextMenuIcon} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </li>
  );
}
