import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useWebSocket } from "../../../contexts/WebSocketContext";

const ConversationTitle = ({ styles, title, users }) => {
  const { user } = useWebSocket();
  const [displayTitle, setDisplayTitle] = useState("");

  // if two people: return the one that is not you
  // if three or more: return all names
  // if title: return title

  useEffect(() => {
    if (!title) {
      if (users.length === 2) {
        const notCurrentUser = users.filter((a) => a.id !== user.id);
        setDisplayTitle(notCurrentUser[0]?.name || "Unknown");
      } else {
        setDisplayTitle(users.map((u) => u.name).join(", "));
      }
    } else {
      setDisplayTitle(title);
    }
  }, [title, users, user]);

  return <h3 className={styles.conversationTitle}>{displayTitle}</h3>;
};

ConversationTitle.propTypes = {
  styles: PropTypes.object,
  title: PropTypes.string,
  users: PropTypes.array,
};

export default ConversationTitle;
