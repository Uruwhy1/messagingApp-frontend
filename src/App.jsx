import styles from "./App.module.css";
import Loading from "./components/Loading";
import Login from "./components/Login";
import { useWebSocket } from "./contexts/WebSocketContext";

function App() {
  const { user, loading } = useWebSocket();

  return (
    <div className={styles.container}>
      {loading && <Loading />}
      {user && <div>xd</div>}
      {!user && <Login />}
    </div>
  );
}

export default App;
