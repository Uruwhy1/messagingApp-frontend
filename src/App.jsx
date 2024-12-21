import { useState } from "react";
import styles from "./App.module.css";
import Login from "./components/Login";

function App() {
  const [user, setUser] = useState(null);

  return <div className={styles.container}>{!user && <Login />}</div>;
}

export default App;
