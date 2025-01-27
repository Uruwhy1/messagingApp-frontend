import PropTypes from "prop-types";
import styles from "./LeftArea.module.css";
import UserOptions from "./options/UserOptions";
import ConversationList from "./conversations/ConversationsList";
import { useState } from "react";

const LeftArea = ({ setCurrentConversation, currentConversation }) => {
  const [view, setView] = useState("Chats");
  const [adding, setAdding] = useState(false);

  return (
    <div className={styles.leftContainer}>
      <UserOptions setView={setView} />
      {view == "Chats" && (
        <ConversationList
          setCurrentConversation={setCurrentConversation}
          currentConversation={currentConversation}
          view={view}
          adding={adding}
          setAdding={setAdding}
        />
      )}
    </div>
  );
};

LeftArea.propTypes = {
  setCurrentConversation: PropTypes.func.isRequired,
  currentConversation: PropTypes.number.isRequired,
};

export default LeftArea;
