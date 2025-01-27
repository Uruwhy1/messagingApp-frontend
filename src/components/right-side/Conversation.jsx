import { useState, useEffect } from "react";
import { useWebSocket } from "../../contexts/WebSocketContext";
import styles from "./Conversation.module.css"; // CSS Module import

const Conversation = ({ conversationId }) => {
  const { fetchData } = useWebSocket();
  const [isLoading, setIsLoading] = useState(true);
  const [conversation, setConversation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        if (!conversationId || isNaN(conversationId)) {
          throw new Error("Invalid conversation ID");
        }

        const data = await fetchData(`/conversations/${conversationId}`, "GET");
        setConversation(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchConversation();
  }, [conversationId, fetchData]);

  const formatTimestamp = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid date";

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getConversationTitle = () => {
    if (!conversation) return "";
    return (
      conversation.name ||
      conversation.users.map((user) => user.user.name).join(", ")
    );
  };

  if (isLoading)
    return <div className={styles.loading}>Loading conversation...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!conversation) return <div>Conversation not found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h2 className={styles.title}>{getConversationTitle()}</h2>
          <div className={styles.participants}>
            {conversation.users.length} participants
          </div>
        </div>
      </div>

      <div className={styles.messagesContainer}>
        {conversation.messages.length === 0 ? (
          <div className={styles.noMessages}>No messages yet</div>
        ) : (
          conversation.messages.map((message) => {
            const author = conversation.users.find(
              (user) => user.user.id === message.authorId
            )?.user;

            return (
              <div key={message.id} className={styles.messageWrapper}>
                <div className={styles.messageBubble}>
                  <div className={styles.messageHeader}>
                    <span className={styles.author}>
                      {author?.name || "Unknown"}
                    </span>
                    <span className={styles.timestamp}>
                      {formatTimestamp(message.date)}
                    </span>
                  </div>
                  <div className={styles.messageContent}>{message.content}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Conversation;
