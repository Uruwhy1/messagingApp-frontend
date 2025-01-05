import UserPicture from "../../reusable/UserPicture";
import styles from "./Conversation.module.css";

const Conversation = ({ object }) => {
  /* -------------------------------------
|
|   TODO: RETURN COUNT (PROPERLY) AND LAST MESSAGE.
|
----------------------------------------- */

  return (
    <div className={styles.conversation}>
      <div className={styles.conversationPicture}>
        <UserPicture user={object} />
      </div>
      <div className={styles.conversationDetails}>
        <h3 className={styles.conversationTitle}>{object.name}</h3>
        <p className={styles.conversationLastMessage}>{object.lastMessage}</p>
        {object.count > 0 && (
          <span className={styles.conversationCount}>{object.count}</span>
        )}
      </div>
    </div>
  );
};

export default Conversation;
