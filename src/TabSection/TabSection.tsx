import { NavLink } from "react-router";
import styles from "./TabSection.module.css";
import { useTabs } from "../hooks/useTabs";
import { useEffect, useState } from "react";
import PinIcon from "../assets/icons/fi-rs-thumbtack.svg?react";

function TabSection() {
  const { tabs, togglePin } = useTabs();
  const [contextMenuTabPath, setContextMenuTabPath] = useState<string | null>(
    null,
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

  return (
    <nav className={styles.tabs}>
      <ul className={styles.list}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isMenuOpen = contextMenuTabPath === tab.path;

          return (
            <li
              key={tab.path}
              className={styles.listItem}
              onContextMenu={(e) => handleContextMenu(e, tab.path)}
            >
              <NavLink
                to={tab.path}
                className={({ isActive }) =>
                  `${styles.listItemLink} ${isActive ? styles.activeLink : ""} ${tab.isPinned ? styles.pinnedLink : ""}`
                }
              >
                <Icon className={styles.icon} />
                {tab.label ? <span>{tab.label}</span> : null}
              </NavLink>

              {isMenuOpen && (
                <div className={styles.contextMenu}>
                  <button
                    className={styles.contextMenuItem}
                    onClick={() => {
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
        })}
      </ul>
    </nav>
  );
}

export default TabSection;
