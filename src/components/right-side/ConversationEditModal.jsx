import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useWebSocket } from "../../contexts/WebSocketContext";
import styles from "./ConversationEditModal.module.css";
import { usePopup } from "../../contexts/PopupContext";
import { ChevronDown, X, UserMinus } from "lucide-react";

const ConversationEditModal = ({
  conversation,
  isOpen,
  onClose,
  onUpdateConversation,
}) => {
  const { fetchData, user } = useWebSocket();
  const [conversationName, setConversationName] = useState(
    conversation.title || ""
  );
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [friendsDropdownOpen, setFriendsDropdownOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const { showPopup } = usePopup();

  const isAdmin =
    conversation.users.find((u) => u.id === user.id)?.id ===
    conversation.adminId;

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetchData(`/users/friends/${user.id}`, "GET");

        const availableFriends = response.friends.filter(
          (friend) =>
            !conversation.users.some(
              (conversationUser) => conversationUser.id === friend.id
            )
        );

        setFriends(availableFriends);
      } catch (error) {
        console.error("Error fetching friends:", error);
        showPopup("Failed to fetch friends", false);
      }
    };

    if (isOpen) {
      fetchFriends();
    }
  }, [isOpen, user.id, fetchData]);

  const handleNameUpdate = async () => {
    if (!conversationName.trim() && conversation.users.length !== 2) {
      showPopup("Conversation name cannot be empty.", false);
      return;
    }

    try {
      await fetchData(`/conversations/${conversation.id}/name`, "PATCH", {
        name: conversationName.trim(),
      });
      onUpdateConversation();
      showPopup("Conversation name updated!", true);
    } catch (err) {
      showPopup(err.message || "Failed to update conversation name.", false);
    }
  };

  const handleAddUsers = async () => {
    if (selectedFriends.length === 0) {
      showPopup("Please select friends to add.", false);
      return;
    }

    const userIds = selectedFriends.map((friend) => friend.id);

    try {
      await fetchData(`/conversations/${conversation.id}/users`, "POST", {
        userIds,
      });
      onUpdateConversation();
      setSelectedFriends([]);
      setFriendsDropdownOpen(false);
      showPopup("Users added successfully!", true);
    } catch (err) {
      showPopup(err.message || "Failed to add users.", false);
    }
  };

  const handleRemoveUser = async (userId) => {
    if (!isAdmin || isRemoving) return;

    setIsRemoving(true);
    try {
      await fetchData(
        `/conversations/${conversation.id}/users/${userId}`,
        "DELETE"
      );
      onUpdateConversation();
      showPopup("User removed successfully!", true);
    } catch (err) {
      showPopup(err.message || "Failed to remove user.", false);
    } finally {
      setIsRemoving(false);
    }
  };

  const toggleFriendSelection = (friend) => {
    setSelectedFriends((prev) =>
      prev.some((f) => f.id === friend.id)
        ? prev.filter((f) => f.id !== friend.id)
        : [...prev, friend]
    );
  };

  const removeSelectedFriend = (friendId) => {
    setSelectedFriends((prev) => prev.filter((f) => f.id !== friendId));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {isAdmin && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Update Conversation</h3>

            <label className={styles.label}>Conversation Name</label>
            <div className={styles.inputGroup}>
              <input
                type="text"
                value={conversationName}
                onChange={(e) => setConversationName(e.target.value)}
                className={styles.input}
                placeholder="Enter conversation name"
              />
              <button
                onClick={handleNameUpdate}
                className={styles.updateButton}
              >
                Update
              </button>
            </div>

            <label className={styles.label}>Add Friends</label>
            <div className={styles.friendsSection}>
              <div>
                <div
                  className={styles.friendsDropdown}
                  onClick={() => setFriendsDropdownOpen(!friendsDropdownOpen)}
                >
                  <span>
                    {selectedFriends.length > 0
                      ? `${selectedFriends.length} friend(s) selected`
                      : "Select friends"}
                  </span>
                  <ChevronDown />

                  {friendsDropdownOpen && (
                    <div className={styles.friendsList}>
                      {friends.length === 0 ? (
                        <div className={styles.noFriends}>
                          No friends available
                        </div>
                      ) : (
                        friends.map((friend) => (
                          <div
                            key={friend.id}
                            className={`${styles.friendItem} ${
                              selectedFriends.some((f) => f.id === friend.id)
                                ? styles.selected
                                : ""
                            }`}
                            onClick={() => toggleFriendSelection(friend)}
                          >
                            {friend.name}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleAddUsers}
                  className={styles.addButton}
                  disabled={selectedFriends.length === 0}
                >
                  Add
                </button>
              </div>

              {selectedFriends.length > 0 && (
                <div className={styles.selectedFriends}>
                  {selectedFriends.map((friend) => (
                    <div key={friend.id} className={styles.selectedFriend}>
                      {friend.name}
                      <X
                        onClick={() => removeSelectedFriend(friend.id)}
                        size={16}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Participants</h3>
          <ul className={styles.participantsList}>
            {conversation.users.map((participant) => (
              <li
                key={participant.id}
                className={`${styles.participant} ${
                  participant.id === user.id ? styles.currentUser : ""
                }`}
              >
                {participant.name}
                {participant.id === conversation.adminId && (
                  <span className={styles.adminTag}>Admin</span>
                )}
                {isAdmin && participant.id !== conversation.adminId && (
                  <button
                    onClick={() => handleRemoveUser(participant.id)}
                    disabled={isRemoving}
                    className={styles.removeUserButton}
                    title="Remove user"
                  >
                    <UserMinus size={18} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.closeButton}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

ConversationEditModal.propTypes = {
  conversation: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string,
    users: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
    adminId: PropTypes.number.isRequired,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateConversation: PropTypes.func.isRequired,
};

export default ConversationEditModal;
