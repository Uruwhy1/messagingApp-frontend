import LeftArea from "./LeftArea";
import styles from "./MainView.module.css";

const MainView = () => {
  return (
    <div className={styles.container}>
      <LeftArea />
      <div></div>
    </div>
  );
};

export default MainView;
