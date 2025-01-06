import PropTypes from "prop-types";
import UserPicture from "../../reusable/UserPicture";
import styles from "./Conversation.module.css";

const Conversation = ({ object }) => {
  return (
    <div className={styles.conversation}>
      <div className={styles.conversationPicture}>
        <UserPicture user={object} />
      </div>
      <div className={styles.conversationDetails}>
        <h3 className={styles.conversationTitle}>{object.title}</h3>
        <p className={styles.conversationLastMessage}>
          {object.lastMessage?.user.name.split(" ")[0]}
          {": "}
          {object.lastMessage?.content}
        </p>
      </div>
    </div>
  );
};

export default Conversation;

Conversation.propTypes = {
  object: PropTypes.shape({
    title: PropTypes.string.isRequired,
    lastMessage: PropTypes.shape({
      user: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
      content: PropTypes.string.isRequired,
    }),
  }).isRequired,
};
