import PropTypes from "prop-types";
import styles from "./UserOptions.module.css";
import { useWebSocket } from "../../../contexts/WebSocketContext";
import UserPicture from "../../reusable/UserPicture";
import OptionsMenu from "./bottom/OptionsMenu";
import { MessageCircle, UserCheck2Icon } from "lucide-react";

const UserOptions = ({ setView }) => {
  const { user } = useWebSocket();

  return (
    <div className={styles.userContainer}>
      <div className={styles.views}>
        <div>
          <MessageCircle onClick={() => setView("Chats")} />
        </div>
        <div>
          <UserCheck2Icon onClick={() => setView("Friends")} />
        </div>
      </div>
      <div className={styles.userStuff}>
        <UserPicture user={user} />
        <OptionsMenu />
      </div>
    </div>
  );
};

UserOptions.propTypes = {
  setView: PropTypes.func,
};

export default UserOptions;
