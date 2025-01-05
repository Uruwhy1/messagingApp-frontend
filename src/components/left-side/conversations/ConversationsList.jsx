import { useEffect, useState } from "react";
import styles from "./ConversationsList.module.css";
import { useWebSocket } from "../../../contexts/WebSocketContext";

const ConversationList = () => {
  const { user, fetchData } = useWebSocket();
  const [conversations, setConversations] = useState(null);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const response = await fetchData(
          `/conversations/user/${user.id}`,
          "GET"
        );
        setConversations(response);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    getConversations();
  }, []);
  return <div className={styles.conversationsContainer}>conveeeeeeeeers</div>;
};

export default ConversationList;
