import { LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useWebSocket } from "../../../contexts/WebSocketContext";
import styles from "./OptionsMenu.module.css";

const OptionsMenu = () => {
  const { fetchData } = useWebSocket();
  return (
    <div className={styles.menuContainer}>
      <div className={styles.menu}>
        <ThemeToggle />
        <button
          onClick={() => fetchData("/users/logout", "POST")}
          className={styles.logoutButton}
          title="Log Out"
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
};

export default OptionsMenu;
