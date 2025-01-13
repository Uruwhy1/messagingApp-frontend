import { Check } from "lucide-react";
import styles from "./PrimaryButton.module.css";
import PropTypes from "prop-types";
const PrimaryButton = ({ func }) => {
  return (
    <button className={styles.primaryButton} onClick={func ? func : ""}>
      <Check strokeWidth={3} />
    </button>
  );
};

PrimaryButton.propTypes = {
  func: PropTypes.func.isRequired,
};

export default PrimaryButton;
