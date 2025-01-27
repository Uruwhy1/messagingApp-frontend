import { useState } from "react";
import LeftArea from "./left-side/LeftArea";
import styles from "./MainView.module.css";
import Conversation from "./right-side/Conversation";

const MainView = () => {
  const [currentConversation, setCurrentConversation] = useState(null);

  return (
    <div className={styles.container}>
      <LeftArea
        setCurrentConversation={setCurrentConversation}
        currentConversation={currentConversation}
      />
      <Conversation conversationId={currentConversation} />
    </div>
  );
};

export default MainView;
