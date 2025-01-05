import { useEffect, useState } from "react";
import styles from "./ConversationsList.module.css";
import { useWebSocket } from "../../../contexts/WebSocketContext";
import Conversation from "./Conversation";
import { Ghost } from "lucide-react";

const ConversationList = () => {
  const { user, fetchData } = useWebSocket();
  const [conversations, setConversations] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredConversations, setFilteredConversations] = useState(null); // Filtered list

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (conversations) {
      setFilteredConversations(
        conversations.filter((conv) =>
          conv.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, conversations]);

  if (!conversations) {
    return <div>No conversations available 😢</div>;
  }

  return (
    <div className={styles.conversationsContainer}>
      <div className={styles.topContainer}>
        <h2>Chats</h2>
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      {filteredConversations && filteredConversations.length > 0 ? (
        filteredConversations.map((element) => (
          <Conversation key={element.id} object={element} />
        ))
      ) : (
        <div className={styles.emptyList}>
          <Ghost size={35} />
          <p>NO CONVERSATIONS FOUND</p>
        </div>
      )}
    </div>
  );
};

export default ConversationList;
