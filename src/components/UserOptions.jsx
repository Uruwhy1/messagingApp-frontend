import styles from "./UserOptions.module.css";
import { useWebSocket } from "../contexts/WebSocketContext";
import UserPicture from "./reusable/UserPicture";
import { LogOut } from "lucide-react";

const UserOptions = () => {
  const { user, fetchData } = useWebSocket();

  return (
    <div className={styles.userContainer}>
      <div className={styles.userStuff}>
        <UserPicture user={user} />

        <div className={styles.menuContainer}>
          <div className={styles.menu}>
            <button
              onClick={() => fetchData("/users/logout", "POST")}
              className={styles.logoutButton}
              title="Log Out"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOptions;
