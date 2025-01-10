import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import styles from "./NewConversation.module.css";
import { useWebSocket } from "../../../../contexts/WebSocketContext";
import GenericItem from "../../../reusable/GenericItem";
import NewConversationTitle from "./NewConversationTitle";
import Empty from "../../../reusable/Empty";

const NewConversation = ({ setAdding }) => {
  const { user, fetchData } = useWebSocket();
  const [friends, setFriends] = useState(null);
  const [filteredFriends, setFilteredFriends] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const response = await fetchData(`/users/friends/${user.id}`, "GET");
        setFriends(response.friends);
        setFilteredFriends(response.friends);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    if (user?.id) getFriends();
  }, [user, fetchData]);

  useEffect(() => {
    if (friends) {
      setFilteredFriends(
        friends.filter((friend) =>
          friend.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, friends]);

  const handleExitClick = () => {
    setExiting(true);
    setTimeout(() => {
      setAdding(false);
    }, 350); // this should match var(--sliding-view-transition)
  };

  const handleItemClick = (id) => {
    setSelectedIds((prevSelectedIds) =>
      prevSelectedIds.includes(id)
        ? prevSelectedIds.filter((selectedId) => selectedId !== id)
        : [...prevSelectedIds, id]
    );
  };

  const handleCreateClick = () => {
    alert(`Creating chat with IDs: ${selectedIds.join(", ")}`);
  };

  return (
    <div
      className={`${exiting ? "hide" : "show"} ${
        styles.newConversationContainer
      }`}
    >
      <NewConversationTitle
        exitFunc={handleExitClick}
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
      />
      {friends && filteredFriends.length > 0 ? (
        filteredFriends.map((friend) => (
          <GenericItem
            key={friend.id}
            object={friend}
            type="user"
            onClick={() => handleItemClick(friend.id)}
            isSelected={selectedIds.includes(friend.id)}
          />
        ))
      ) : (
        <Empty text={"NO FRIENDS FOUND"} />
      )}
      <button onClick={handleCreateClick}>Create</button>
    </div>
  );
};

NewConversation.propTypes = {
  setAdding: PropTypes.func.isRequired,
};

export default NewConversation;
