import styles from "./LeftArea.module.css";
import UserOptions from "./options/bottom/UserOptions";
import ConversationList from "./conversations/ConversationsList";
import { useState } from "react";

const LeftArea = () => {
  const [view, setView] = useState("Chats");

  return (
    <div className={styles.container}>
      <UserOptions />
      {view == "Chats" && <ConversationList view={view} />}
    </div>
  );
};

export default LeftArea;
