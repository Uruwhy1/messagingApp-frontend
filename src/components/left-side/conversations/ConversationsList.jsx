import { useEffect, useState } from "react";
import { useWebSocket } from "../../../contexts/WebSocketContext";
import PropTypes from "prop-types";
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
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false); // Set loading to false after fetching (whether successful or not)
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
    setAdding(false);
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

  return (
    <div style={adding ? { overflow: "hidden" } : {}}>
      {adding && <NewConversation setAdding={setAdding} />}
      <ViewTitle
        view={view}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setAdding={setAdding}
      />
      {loading ? (
        <Empty text="LOADING CONVERSATIONS..." />
      ) : filteredConversations && filteredConversations.length > 0 ? (
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
        <Empty text="NO CONVERSATIONS FOUND" />
      )}
    </div>
  );
};

ConversationList.propTypes = {
  view: PropTypes.string.isRequired,
  adding: PropTypes.bool.isRequired,
  setAdding: PropTypes.func.isRequired,
  setCurrentConversation: PropTypes.func.isRequired,
  currentConversation: PropTypes.number,
};

export default ConversationList;
