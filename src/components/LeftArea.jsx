import styles from "./LeftArea.module.css";
import UserOptions from "./UserOptions";
import ConversationList from "./ConversationsList";

const LeftArea = () => {
  return (
    <div className={styles.container}>
      <UserOptions />
      <ConversationList />
    </div>
  );
};

export default LeftArea;
