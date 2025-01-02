import styles from "./UserOptions.module.css";
import { useWebSocket } from "../contexts/WebSocketContext";
import UserPicture from "./UserPicture";

const UserOptions = () => {
  const { user } = useWebSocket();

  return (
    <div className={styles.userContainer}>
      <UserPicture user={user} />
    </div>
  );
};

export default UserOptions;
