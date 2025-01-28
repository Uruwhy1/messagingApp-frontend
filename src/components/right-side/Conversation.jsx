import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useWebSocket } from "../../contexts/WebSocketContext";
import styles from "./Conversation.module.css";

const Conversation = ({ conversationId }) => {
  const { user, fetchData, socket } = useWebSocket();
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

    if (conversationId) fetchConversation();
  }, [conversationId, fetchData]);

  useEffect(() => {
    const handleIncomingMessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (
          message.type === "NEW_MESSAGE" &&
          message.data.conversationId === conversationId
        ) {
          setConversation((prev) => ({
            ...prev,
            messages: [...prev.messages, message.data.message],
          }));
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    if (socket && conversationId) {
      socket.addEventListener("message", handleIncomingMessage);
    }

    return () => {
      if (socket) {
        socket.removeEventListener("message", handleIncomingMessage);
      }
    };
  }, [socket, conversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const formatTimestamp = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date)
      ? "Invalid date"
      : date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  const getConversationTitle = () => {
    if (!conversation) return "";
    if (conversation.title) return conversation.title;

    return conversation.users.length === 2
      ? conversation.users.find((u) => u.id !== user.id)?.name || "Unknown"
      : conversation.users.map((u) => u.name).join(", ");
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await fetchData(`/conversations/${conversationId}/message`, "POST", {
        content: newMessage.trim(),
      });
      setNewMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  if (!conversationId) return <div className={styles.container} />;
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
              (u) => u.id === message.authorId
            );
            return (
              <div
                key={message.id}
                className={`${styles.messageWrapper} ${
                  author.id == user.id && styles.ownMessage
                }`}
              >
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
  conversationId: PropTypes.number,
};

export default Conversation;
