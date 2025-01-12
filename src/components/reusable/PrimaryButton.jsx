import styles from "./PrimaryButton.module.css";
import PropTypes from "prop-types";
const PrimaryButton = ({ text, func }) => {
  return (
    <button className={styles.primaryButton} onClick={func ? func : ""}>
      {text}
    </button>
  );
};

PrimaryButton.propTypes = {
  text: PropTypes.string.isRequired,
  func: PropTypes.func.isRequired,
};

export default PrimaryButton;
