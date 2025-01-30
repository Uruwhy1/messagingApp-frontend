import { useEffect, useState } from "react";
import { useWebSocket } from "../../../contexts/WebSocketContext";
import PropTypes from "prop-types";
import GenericItem from "../../reusable/GenericItem";
import ViewTitle from "../ViewTitle";
import Empty from "../../reusable/Empty";
import AddFriend from "./AddFriend";
import styles from "./FriendsList.module.css";
import { UserCheck2, UserMinus2 } from "lucide-react";

const FriendsList = ({ view, setView, setCurrentConversation }) => {
  const { user, socket, fetchData } = useWebSocket();
  const [friends, setFriends] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFriends, setFilteredFriends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

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

    const getFriendRequests = async () => {
      try {
        const requests = await fetchData(
          `/friends/listRequests/${user.id}`,
          "GET"
        );
        const pendingRequests = requests.filter(
          (request) =>
            request.status === "pending" && request.receiverId === user.id
        );
        setFriendRequests(pendingRequests);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      getFriends();
      getFriendRequests();
    }
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

  useEffect(() => {
    if (!socket) return;

    const handleNewFriendRequest = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "NEW_FRIEND_REQUEST") {
        setFriendRequests((prev) => [...prev, data.data]);
      } else if (data.type === "FRIEND_REQUEST_ACCEPTED") {
        setFriends((prev) => {
          const newFriend =
            data.data.senderId === user.id
              ? data.data.receiver
              : data.data.sender;
          return [...prev, newFriend];
        });
        setFriendRequests((prev) =>
          prev.filter(
            (req) =>
              req.senderId !== data.data.senderId ||
              req.receiverId !== data.data.receiverId
          )
        );
      } else if (data.type === "FRIEND_REQUEST_REJECTED") {
        setFriendRequests((prev) =>
          prev.filter((req) => req.id !== data.data.requestId)
        );
      }
    };

    socket.addEventListener("message", handleNewFriendRequest);

    return () => {
      socket.removeEventListener("message", handleNewFriendRequest);
    };
  }, [socket, user.id]);

  const handleFriendClick = async (friendId) => {
    try {
      const newConversation = await fetchData("/conversations/create", "POST", {
        userIds: [user.id, friendId],
        adminId: user.id,
        name: "",
        picture: "",
      });

      setCurrentConversation(newConversation.id);
      setView("Chats");
    } catch (error) {
      if (error.toString().includes("Existing conversation")) {
        try {
          const existingConversations = await fetchData(
            `/conversations/user/${user.id}`,
            "GET"
          );

          const existingConversation = existingConversations.find((conv) =>
            conv.users.every((u) => u.id === friendId || u.id === user.id)
          );

          if (existingConversation) {
            setCurrentConversation(existingConversation.id);
            setView("Chats");
          } else {
            console.error("Existing conversation not found.");
          }
        } catch (fetchError) {
          console.error("Error fetching existing conversation:", fetchError);
        }
      } else {
        console.error("Error handling friend click:", error);
      }
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await fetchData("/friends/accept", "POST", { requestId });
      const requests = await fetchData(
        `/friends/listRequests/${user.id}`,
        "GET"
      );
      const pendingRequests = requests.filter(
        (request) =>
          request.status === "pending" && request.receiverId === user.id
      );
      setFriendRequests(pendingRequests);

      const response = await fetchData(`/users/friends/${user.id}`, "GET");
      setFriends(response.friends);
      setFilteredFriends(response.friends);
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await fetchData("/friends/reject", "POST", { requestId });
      const requests = await fetchData(
        `/friends/listRequests/${user.id}`,
        "GET"
      );
      const pendingRequests = requests.filter(
        (request) =>
          request.status === "pending" && request.receiverId === user.id
      );
      setFriendRequests(pendingRequests);
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  return (
    <div>
      {adding && <AddFriend setAdding={setAdding} />}
      <ViewTitle
        view={view}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setAdding={setAdding}
      />
      {friendRequests.length > 0 && (
        <div className={styles.friendRequests}>
          {friendRequests.map((request) => (
            <div className={styles.request} key={request.id}>
              <GenericItem object={request.sender} type="user" />
              <div className={styles.requestButtons}>
                <button
                  className={styles.good}
                  onClick={() => handleAcceptRequest(request.id)}
                >
                  <UserCheck2 />
                </button>
                <button
                  className={styles.bad}
                  onClick={() => handleRejectRequest(request.id)}
                >
                  <UserMinus2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <Empty text="LOADING FRIENDS..." />
      ) : filteredFriends && filteredFriends.length > 0 ? (
        filteredFriends.map((friend) => (
          <GenericItem
            key={friend.id}
            object={friend}
            type="user"
            onClick={() => handleFriendClick(friend.id)}
          />
        ))
      ) : (
        <Empty text="NO FRIENDS FOUND" />
      )}
    </div>
  );
};

FriendsList.propTypes = {
  view: PropTypes.string.isRequired,
  setView: PropTypes.func.isRequired,
  setCurrentConversation: PropTypes.func.isRequired,
};

export default FriendsList;
