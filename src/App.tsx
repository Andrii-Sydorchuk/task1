import { Outlet } from "react-router";
import styles from "./App.module.css";
import TabSection from "./TabSection/TabSection";

function App() {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}></aside>
      <header className={styles.header}></header>

      <main className={styles.main}>
        <TabSection />

        {/* content placeholder */}
        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
