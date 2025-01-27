import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useWebSocket } from "../../contexts/WebSocketContext";
import styles from "./Conversation.module.css";

const Conversation = ({ conversationId }) => {
  const { user, fetchData } = useWebSocket();

  const [isLoading, setIsLoading] = useState(true);
  const [conversation, setConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

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
        console.error(err);
        setIsLoading(false);
      }
    };

    if (conversationId) {
      fetchConversation();
      console.log(conversation);
    }
  }, [conversationId, fetchData]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const formatTimestamp = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid date";

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getConversationTitle = () => {
    const title = conversation.title;
    const users = conversation.users;

    if (!title) {
      if (users.length === 2) {
        const notCurrentUser = users.filter((a) => a.id !== user.id);
        return notCurrentUser[0]?.name || "Unknown";
      } else {
        return users.map((u) => u.name).join(", ");
      }
    } else {
      return title;
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const messageData = {
        content: newMessage.trim(),
      };

      const createdMessage = await fetchData(
        `/conversations/${conversationId}/message`,
        "POST",
        messageData
      );

      setConversation((prev) => ({
        ...prev,
        messages: [...prev.messages, createdMessage],
      }));
      setNewMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  if (!conversationId) return <div className={styles.container}></div>;
  if (isLoading)
    return <div className={styles.loading}>Loading conversation...</div>;

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
              (user) => user.id === message.authorId
            );

            return (
              <div key={message.id} className={styles.messageWrapper}>
                <div className={styles.messageBubble}>
                  <div className={styles.messageHeader}>
                    <span className={styles.author}>
                      {author?.name || "Unknown"}
                    </span>
                    <span className={styles.timestamp}>
                      {formatTimestamp(message.createdAt)}
                    </span>
                  </div>
                  <div className={styles.messageContent}>{message.content}</div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputContainer}>
        <form onSubmit={handleSendMessage} className={styles.messageForm}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            className={styles.messageInput}
            aria-label="Message input"
          />
          <button
            type="submit"
            className={styles.sendButton}
            disabled={!newMessage.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

Conversation.propTypes = {
  conversationId: PropTypes.number.isRequired,
};

export default Conversation;
