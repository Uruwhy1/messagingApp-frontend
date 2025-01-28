import { useEffect, useState } from "react";
import { useWebSocket } from "../../../contexts/WebSocketContext";
import PropTypes from "prop-types";
import styles from "./ConversationsList.module.css";
import { Ghost } from "lucide-react";
import GenericItem from "../../reusable/GenericItem";
import ViewTitle from "../ViewTitle";
import NewConversation from "./new-chat/NewConversation";
import Empty from "../../reusable/Empty";

const ConversationList = ({
  view,
  adding,
  setAdding,
  setCurrentConversation,
  currentConversation,
}) => {
  const { user, fetchData, socket } = useWebSocket();
  const [conversations, setConversations] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredConversations, setFilteredConversations] = useState(null);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const response = await fetchData(
          `/conversations/user/${user.id}`,
          "GET"
        );
        setConversations(response);
        setFilteredConversations(response);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    if (user?.id) getConversations();
  }, [user, fetchData]);

  useEffect(() => {
    const handleWebSocketMessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case "NEW_CONVERSATION":
          handleNewConversation(message.data);
          break;
        case "NEW_MESSAGE":
          handleNewMessage(message.data);
          break;
        default:
          break;
      }
    };

    if (socket) {
      socket.addEventListener("message", handleWebSocketMessage);
    }

    return () => {
      if (socket) {
        socket.removeEventListener("message", handleWebSocketMessage);
      }
    };
  }, [socket]);

  const handleNewConversation = (newConversation) => {
    setConversations((prev) => {
      if (prev?.some((conv) => conv.id === newConversation.id)) return prev;
      return [newConversation, ...(prev || [])];
    });
  };

  const handleNewMessage = (newMessage) => {
    const messageContent = newMessage.message;
    setConversations((prev) => {
      if (!prev) return prev;

      return prev
        .map((conv) => {
          if (conv.id === newMessage.conversationId) {
            return {
              ...conv,
              lastMessage: {
                content: messageContent.content,
                createdAt: messageContent.createdAt,
                user: {
                  name: messageContent.authorName || "Unknown",
                },
              },
              updatedAt: messageContent.createdAt,
            };
          }
          return conv;
        })
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    });
  };

  useEffect(() => {
    if (conversations) {
      setFilteredConversations(
        conversations.filter((conv) =>
          conv.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, conversations]);

  const handleItemClick = (id) => {
    setCurrentConversation((prev) => (prev === id ? null : id));
  };

  if (!conversations) {
    return (
      <div className={styles.conversationsContainer}>
        <ViewTitle
          view={view}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setAdding={setAdding}
        />
        <div className={styles.emptyList}>
          <Ghost size={35} />
          <p>NO CONVERSATIONS AVAILABLE</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles.conversationsContainer}
      style={adding ? { overflow: "hidden" } : {}}
    >
      {adding && (
        <NewConversation
          setAdding={setAdding}
          setConversations={setConversations}
        />
      )}
      <ViewTitle
        view={view}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setAdding={setAdding}
      />
      {filteredConversations && filteredConversations.length > 0 ? (
        filteredConversations.map((element) => (
          <GenericItem
            key={element.id}
            object={element}
            type="conversation"
            onClick={() => handleItemClick(element.id)}
            isSelected={currentConversation === element.id}
          />
        ))
      ) : (
        <Empty text="NO CONVERSATION FOUND" />
      )}
    </div>
  );
};

ConversationList.propTypes = {
  view: PropTypes.string.isRequired,
  adding: PropTypes.bool.isRequired,
  setAdding: PropTypes.func.isRequired,
  setCurrentConversation: PropTypes.func.isRequired,
  currentConversation: PropTypes.number.isRequired,
};

export default ConversationList;
