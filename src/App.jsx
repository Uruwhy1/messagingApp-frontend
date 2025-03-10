import styles from "./App.module.css";
import Loading from "./components/Loading";
import Login from "./components/login/Landing";
import MainView from "./components/MainView";
import { useWebSocket } from "./contexts/WebSocketContext";

function App() {
  const { user, loading, loadingFade } = useWebSocket();

  return (
    <div className={styles.container}>
      {loading && <Loading loadingFade={loadingFade} />}
      {user && <MainView />}
      {!user && <Login />}
    </div>
  );
}

export default App;
