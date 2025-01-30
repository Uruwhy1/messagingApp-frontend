import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import styles from "./AddFriend.module.css";
import { useWebSocket } from "../../../contexts/WebSocketContext";
import { usePopup } from "../../../contexts/PopupContext";
import GenericItem from "../../reusable/GenericItem";
import Empty from "../../reusable/Empty";
import { X } from "lucide-react";

const AddFriend = ({ setAdding }) => {
  const { user, fetchData } = useWebSocket();
  const { showPopup } = usePopup();
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [currentFriends, setCurrentFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const response = await fetchData(`/users/friends/${user.id}`, "GET");
        setCurrentFriends(response.friends || []);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    getFriends();
  }, [user, fetchData]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.length >= 3) {
        searchUsers();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const searchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetchData(
        `/users/search?query=${searchTerm}`,
        "GET"
      );
      const filteredUsers = response.users.filter(
        (searchedUser) =>
          searchedUser.id !== user.id &&
          !currentFriends.some((friend) => friend.id === searchedUser.id)
      );
      setSearchResults(filteredUsers);
    } catch (error) {
      console.error("Error searching users:", error);
      showPopup("Failed to search users", false);
    } finally {
      setLoading(false);
    }
  };

  const handleExitClick = () => {
    setExiting(true);
    setTimeout(() => {
      setAdding(false);
    }, 350);
  };

  const handleSendRequest = async (receiverId) => {
    try {
      await fetchData("/friends/send", "POST", { receiverId });
      showPopup("Friend request sent successfully!", true);
      setSearchResults((prev) => prev.filter((user) => user.id !== receiverId));
    } catch (error) {
      if (error.message.includes("already sent")) {
        showPopup("Friend request already sent to this user", false);
      } else {
        showPopup("Failed to send friend request", false);
        console.error("Error sending friend request:", error);
      }
    }
  };

  return (
    <div
      className={`${exiting ? "hide" : "show"} ${styles.addFriendContainer}`}
    >
      <div className={styles.titleContainer}>
        <div className={styles.title}>
          <h2>Add Friend</h2>
          <X onClick={handleExitClick} className={styles.exitIcon} />
        </div>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
          autoFocus
        />
      </div>

      <div className={styles.resultsContainer}>
        {loading ? (
          <Empty text="SEARCHING..." />
        ) : searchTerm.length < 3 ? (
          <Empty text="TYPE AT LEAST 3 CHARACTERS TO SEARCH" />
        ) : searchResults.length === 0 ? (
          <Empty text="NO USERS FOUND" />
        ) : (
          searchResults.map((foundUser) => (
            <div key={foundUser.id} className={styles.userItem}>
              <GenericItem object={foundUser} type="user" />
              <button
                onClick={() => handleSendRequest(foundUser.id)}
                className={styles.sendRequestButton}
              >
                Send Request
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

AddFriend.propTypes = {
  setAdding: PropTypes.func.isRequired,
};

export default AddFriend;
