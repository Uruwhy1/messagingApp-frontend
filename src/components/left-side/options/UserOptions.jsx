import styles from "./UserOptions.module.css";
import { useWebSocket } from "../../../contexts/WebSocketContext";
import UserPicture from "../../reusable/UserPicture";
import OptionsMenu from "./bottom/OptionsMenu";

const UserOptions = () => {
  const { user } = useWebSocket();

  return (
    <div className={styles.userContainer}>
      <div className={styles.userStuff}>
        <UserPicture user={user} />
        <OptionsMenu />
      </div>
    </div>
  );
};

export default UserOptions;
