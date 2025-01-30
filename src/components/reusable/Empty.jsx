import { Ghost } from "lucide-react";
import styles from "./Empty.module.css";
import PropTypes from "prop-types";

const Empty = ({ text }) => {
  return (
    <div className={styles.emptyList}>
      <Ghost className={styles.ghostAnimation} size={35} />
      <p className={styles.textAnimation}>{text}</p>
    </div>
  );
};

Empty.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Empty;
