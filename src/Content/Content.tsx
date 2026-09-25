import { Outlet } from "react-router";
import styles from "./Content.module.css";

function Content() {
  return (
    <div className={styles.contentWrapper}>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}

export default Content;
