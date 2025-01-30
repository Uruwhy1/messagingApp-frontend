import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import styles from "./AddFriend.module.css";
import { useWebSocket } from "../../../contexts/WebSocketContext";
import { usePopup } from "../../../contexts/PopupContext";
import GenericItem from "../../reusable/GenericItem";
import Empty from "../../reusable/Empty";
import { ArrowLeft, X } from "lucide-react";
import SubViewTitleFull from "../../reusable/SubViewTitleFull";

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
        <SubViewTitleFull
          exitFunc={handleExitClick}
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
          view={"Friends"}
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
              <GenericItem
                object={foundUser}
                type="user"
                onClick={() => handleSendRequest(foundUser.id)}
              />
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
