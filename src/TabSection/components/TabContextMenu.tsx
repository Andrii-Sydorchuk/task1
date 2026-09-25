import PinIcon from "../../assets/icons/fi-rs-thumbtack.svg?react";
import styles from "../TabSection.module.css";

interface TabContextMenuProps {
  isPinned: boolean;
  onTogglePin: (e: React.MouseEvent) => void;
}

export function TabContextMenu({ isPinned, onTogglePin }: TabContextMenuProps) {
  return (
    <div className={styles.contextMenu}>
      <button
        type="button"
        className={styles.contextMenuItem}
        onClick={onTogglePin}
      >
        <PinIcon className={styles.contextMenuIcon} />
        <span>{isPinned ? "Tab losen" : "Tab anpinnen"}</span>
      </button>
    </div>
  );
}
