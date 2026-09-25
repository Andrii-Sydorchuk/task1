import { NavLink } from "react-router";
import { TABS } from "../tabs";
import styles from "./TabSection.module.css";

function TabSection() {
  return (
    <nav className={styles.tabs}>
      <ul className={styles.list}>
        {TABS.map((tab) => {
          const Icon = tab.icon;

          return (
            <li key={tab.path} className={styles.listItem}>
              <NavLink
                to={tab.path}
                className={({ isActive }) =>
                  `${styles.listItemLink} ${isActive ? styles.activeLink : ""}`
                }
              >
                <Icon className={styles.icon} />
                {tab.label ? <span>{tab.label}</span> : null}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default TabSection;
