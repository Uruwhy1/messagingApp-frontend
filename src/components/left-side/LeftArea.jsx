import styles from "./LeftArea.module.css";
import UserOptions from "./options/bottom/UserOptions";
import ConversationList from "./conversations/ConversationsList";

const LeftArea = () => {
  return (
    <div className={styles.container}>
      <UserOptions />
      <ConversationList />
    </div>
  );
};

export default LeftArea;
