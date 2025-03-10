import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import styles from "./NewConversation.module.css";
import { useWebSocket } from "../../../../contexts/WebSocketContext";
import { usePopup } from "../../../../contexts/PopupContext";
import GenericItem from "../../../reusable/GenericItem";
import Empty from "../../../reusable/Empty";
import PrimaryButton from "../../../reusable/PrimaryButton";

import ConversationDetailsPrompt from "./ConversationDetailsPrompt";
import ViewTitle from "../../ViewTitle";
import SubViewTitleFull from "../../../reusable/SubViewTitleFull";

const NewConversation = ({ setAdding }) => {
  const { user, fetchData } = useWebSocket();
  const { showPopup } = usePopup();

  const [friends, setFriends] = useState(null);
  const [filteredFriends, setFilteredFriends] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [exiting, setExiting] = useState(false);
  const [showDetailsPrompt, setShowDetailsPrompt] = useState(false);

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
    }, 350); // needs to match var(--sliding-view-transition)
  };

  const handleItemClick = (id) => {
    setSelectedIds((prevSelectedIds) =>
      prevSelectedIds.includes(id)
        ? prevSelectedIds.filter((selectedId) => selectedId !== id)
        : [...prevSelectedIds, id]
    );
  };

  const handleCreateClick = async () => {
    if (selectedIds.length > 1) {
      setShowDetailsPrompt(true);
    } else {
      try {
        await fetchData("/conversations/create", "POST", {
          adminId: user.id,
          userIds: [...selectedIds, user.id],
        });

        handleExitClick();
      } catch (error) {
        showPopup(error.message, false);
        console.error(error);
      }
    }
  };

  const handleDetailsSubmit = async (details) => {
    try {
      await fetchData("/conversations/create", "POST", {
        adminId: user.id,
        userIds: [...selectedIds, user.id],
        name: details.name,
        picture: details.icon,
      });

      handleExitClick();
    } catch (error) {
      showPopup(error.message, false);
      console.error("Error creating conversation:", error);
    }
  };

  return (
    <div
      className={`${exiting ? "hide" : "show"} ${
        styles.newConversationContainer
      }`}
    >
      {showDetailsPrompt ? (
        <ConversationDetailsPrompt
          onSubmit={handleDetailsSubmit}
          onCancel={() => setShowDetailsPrompt(false)}
        />
      ) : (
        <>
          <SubViewTitleFull
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
          <PrimaryButton text="CREATE" func={handleCreateClick} />
        </>
      )}
    </div>
  );
};

NewConversation.propTypes = {
  setAdding: PropTypes.func.isRequired,
};

export default NewConversation;
