import PropTypes from "prop-types";
import UserPicture from "../../reusable/UserPicture";
import styles from "./Conversation.module.css";
import ConversationTitle from "./ConversationTitle";

const Conversation = ({ object }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const isYesterday =
      date.getDate() === now.getDate() - 1 &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const isThisWeek = (() => {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Start of the week (Sunday)
      return date >= startOfWeek && date <= now;
    })();

    if (isToday) {
      return date.toLocaleTimeString("en-UK", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if (isYesterday) {
      return "Yesterday";
    }

    if (isThisWeek) {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
      });
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={styles.conversation}>
      <div className={styles.conversationPicture}>
        <UserPicture user={object} />
      </div>
      <div className={styles.conversationDetails}>
        <div>
          <ConversationTitle
            styles={styles}
            users={object.users}
            title={object.title}
          />
          <p className={styles.conversationDate}>
            {formatDate(object.updatedAt)}
          </p>
        </div>
        {object.lastMessage && (
          <p className={styles.conversationLastMessage}>
            {object.lastMessage.user.name.split(" ")[0]}
            {": "}
            {object.lastMessage.content}
          </p>
        )}{" "}
        {!object.lastMessage && (
          <p className={styles.conversationLastMessage}>
            No messages sent, be the first one!
          </p>
        )}
      </div>
    </div>
  );
};

export default Conversation;

Conversation.propTypes = {
  object: PropTypes.shape({
    title: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    lastMessage: PropTypes.shape({
      user: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
      content: PropTypes.string.isRequired,
    }),
  }).isRequired,
};
