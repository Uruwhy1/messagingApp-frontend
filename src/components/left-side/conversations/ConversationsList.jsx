import { useEffect, useState } from "react";
import { useWebSocket } from "../../../contexts/WebSocketContext";
import PropTypes from "prop-types";
import styles from "./ConversationsList.module.css";
import { Ghost } from "lucide-react";
import GenericItem from "../../reusable/GenericItem";
import ViewTitle from "../ViewTitle";
import NewConversation from "./new-chat/NewConversation";
import Empty from "../../reusable/Empty";

const ConversationList = ({ view, adding, setAdding }) => {
  const { user, fetchData } = useWebSocket();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (conversations) {
      setFilteredConversations(
        conversations.filter((conv) =>
          conv.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, conversations]);

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
    <div className={styles.conversationsContainer}>
      {adding && <NewConversation setAdding={setAdding} />}
      <ViewTitle
        view={view}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setAdding={setAdding}
      />
      {filteredConversations && filteredConversations.length > 0 ? (
        filteredConversations.map((element) => (
          <GenericItem key={element.id} object={element} type="conversation" />
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
};

export default ConversationList;
