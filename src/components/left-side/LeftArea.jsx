import styles from "./LeftArea.module.css";
import UserOptions from "./options/UserOptions";
import ConversationList from "./conversations/ConversationsList";
import { useState } from "react";

const LeftArea = () => {
  const [view, setView] = useState("Chats");
  const [adding, setAdding] = useState(false);

  return (
    <div className={styles.leftContainer}>
      <UserOptions />
      {view == "Chats" && (
        <ConversationList view={view} adding={adding} setAdding={setAdding} />
      )}
    </div>
  );
};

export default LeftArea;
