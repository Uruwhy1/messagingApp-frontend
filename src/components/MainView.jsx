import ConversationList from "./ConversationList";
import styles from "./MainView.module.css";

const MainView = () => {
  return (
    <div className={styles.container}>
      <ConversationList />
      <div></div>
    </div>
  );
};

export default MainView;
