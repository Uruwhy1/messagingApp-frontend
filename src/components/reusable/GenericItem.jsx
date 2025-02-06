import PropTypes from "prop-types";
import styles from "./GenericItem.module.css";
import UserPicture from "./UserPicture";
import ConversationTitle from "../left-side/conversations/ConversationTitle";
import { useWebSocket } from "../../contexts/WebSocketContext";

const GenericItem = ({ object, type, onClick, isSelected, actionButton }) => {
  const { user } = useWebSocket();

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

  const getPicture = () => {
    if (object.picture) return object.picture;

    if (object.users?.length === 2) {
      const otherUser = object.users.find((u) => u.id !== user.id);
      return otherUser?.picture || null;
    }

    return null;
  };

  const converPicture = getPicture();

  return (
    <div
      onClick={onClick}
      className={`${styles.item} ${
        isSelected
          ? type === "user"
            ? styles.selectedUser
            : styles.selectedConver
          : ""
      }`}
    >
      <div className={styles.itemPicture}>
        <UserPicture user={{ picture: converPicture }} />
      </div>
      <div className={styles.itemDetails}>
        {type === "conversation" && (
          <div>
            <ConversationTitle
              styles={styles}
              users={object.users}
              title={object.title}
            />
            <p className={styles.itemDate}>{formatDate(object.updatedAt)}</p>
          </div>
        )}
        {type === "user" && (
          <>
            <h3 className={styles.itemTitle}>{object.name}</h3>
            {object.description && (
              <p className={styles.itemDescription}>{object.description}</p>
            )}
          </>
        )}
        {type === "conversation" && object.lastMessage && (
          <p className={styles.itemLastMessage}>
            {object.lastMessage.user.name.split(" ")[0]}
            {": "}
            {object.lastMessage.content}
          </p>
        )}
        {type === "conversation" && !object.lastMessage && (
          <p className={styles.itemLastMessage}>
            No messages sent, be the first one!
          </p>
        )}
      </div>
      {actionButton && <div className={styles.itemAction}>{actionButton}</div>}
    </div>
  );
};

GenericItem.propTypes = {
  object: PropTypes.object.isRequired,
  type: PropTypes.oneOf(["conversation", "user"]).isRequired,
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  actionButton: PropTypes.node,
};

export default GenericItem;
