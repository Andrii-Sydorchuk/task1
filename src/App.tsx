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
        <Outlet />
      </main>
    </div>
  );
}

export default App;
