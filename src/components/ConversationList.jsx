import { useEffect, useState } from "react";
import styles from "./ConversationList.module.css";
import { useWebSocket } from "../contexts/WebSocketContext";

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

  useEffect(() => {
    console.log(conversations);
  }, [conversations]);

  return (
    <div className={styles.container}>
      {conversations ? conversations.length : "xd"}
    </div>
  );
};

export default ConversationList;
